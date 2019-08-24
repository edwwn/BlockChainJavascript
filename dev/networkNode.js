const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Blockchain = require("./blockchain");
const uuid = require("uuid/v1");
const port = process.argv[2];
const rp = require("request-promise");

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

const nodeAddress = uuid()
    .split("-")
    .join("");

const bitcoin = new Blockchain();

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
);

app.get("/blockchain", function (req, res) {
    res.send(bitcoin);
});

app.post("/transaction", function (req, res) {
    //console.log(req.body);
    // var amount = req.body.amount;
    //  res.send('The amount of the transaction is ' + amount + ' bitcoin.');

    //const blockIndex = bitcoin.createNewTransaction(
    // req.body.amount,
    // req.body.sender,
    //  req.body.recipient
    // );
    // res.json({
    //     note: `Transaction will be added in block ${blockIndex}.`
    //});

    const newTransaction = req.body;
    const blockIndex = bitcoin.addTransactionToPendingTransactions(newTransaction);
    res.json({
        note: `Transaction will be added in block ${blockIndex}.`
    });

});

app.post('/transaction/broadcast', function (req, res) {
    const newTransaction = bitcoin.createNewTransaction(
        req.body.amount,
        req.body.sender,
        req.body.recipient);
    bitcoin.addTransactionToPendingTransactions(newTransaction);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/transaction',
            method: 'POST',
            body: newTransaction,
            json: true
        };
        requestPromises.push(rp(requestOptions));
    });

    Promise.all(requestPromises)
        .then(data => {
            res.json({
                note: 'Transaction created and broadcast Successfully'
            });
        });


});


// mine a block
app.get("/mine", function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock["hash"];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock["index"] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

    const blockHash = bitcoin.hashBlock(
        previousBlockHash,
        currentBlockData,
        nonce
    );
    // bitcoin.createNewTransaction(12.5, "00", nodeAddress); // reward for mining
    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    const requestPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + '/recieve-new-block',
            method: 'POST',
            body: {
                newBlock: newBlock
            },
            json: true
        };
        requestPromises.push(rp(requestOptions));

    });
    Promise.all(requestPromises)
        .then(data => {
            const requestOptions = {
                uri: bitcoin.currentNodeUrl + '/transaction/broadcast',
                method: 'POST',
                body: {
                    amount: 12.5,
                    sender: "00",
                    recipient: nodeAddress
                },
                json: true
            };
            return rp(requestOptions);
        })
        .then(data => {
            res.json({
                note: "New Block Mined Successfully",
                block: newBlock
            });

        });

});

// register a node and broadcast it the network
app.post("/register-and-broadcast-node", function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    if (bitcoin.networkNodes.indexOf(newNodeUrl) == -1)
        bitcoin.networkNodes.push(newNodeUrl);

    const regNodesPromises = [];
    bitcoin.networkNodes.forEach(networkNodeUrl => {
        const requestOptions = {
            uri: networkNodeUrl + "/register-node",
            method: "POST",
            body: {
                newNodeUrl: newNodeUrl
            },
            json: true
        };

        regNodesPromises.push(rp(requestOptions));
    });

    Promise.all(regNodesPromises)
        .then(data => {
            const bulkRegisterOptions = {
                uri: newNodeUrl + "/register-nodes-bulk",
                method: "POST",
                body: {
                    allNetworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
                },
                json: true
            };

            return rp(bulkRegisterOptions);
        })
        .then(data => {
            res.json({
                note: "New node registered with network successfully."
            });
        });
});

// register a node with the network
app.post("/register-node", function (req, res) {
    const newNodeUrl = req.body.newNodeUrl;
    const nodeNotAlreadyPresent = bitcoin.networkNodes.indexOf(newNodeUrl) == -1;
    const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
    if (nodeNotAlreadyPresent && notCurrentNode)
        bitcoin.networkNodes.push(newNodeUrl);
    res.json({
        note: "New node registered successfully."
    });
});

// register multiple nodes at once
app.post("/register-nodes-bulk", function (req, res) {
    const allNetworkNodes = req.body.allNetworkNodes;
    allNetworkNodes.forEach(networkNodeUrl => {
        const nodeNotAlreadyPresent =
            bitcoin.networkNodes.indexOf(networkNodeUrl) == -1;
        const notCurrentNode = bitcoin.currentNodeUrl !== networkNodeUrl;
        if (nodeNotAlreadyPresent && notCurrentNode)
            bitcoin.networkNodes.push(networkNodeUrl);
    });

    res.json({
        note: "Bulk registration successful."
    });
});

app.listen(port, function () {
    console.log(`Listening to port ${port}.....`);
});