const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];
const rp = require('request-promise');

const nodeAddress = uuid().split('-').join('');

const bitcoin = new Blockchain();



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));


app.get('/blockchain', function (req, res) {
    res.send(bitcoin);
});

app.post('/transaction', function (req, res) {
    //console.log(req.body);
    // var amount = req.body.amount;
    //  res.send('The amount of the transaction is ' + amount + ' bitcoin.');
    const blockIndex = bitcoin.createNewTransaction(req.body.amount, req.body.sender, req.body.recipient);
    res.json({
        note: 'Transaction will be added in block ' + blockIndex + '.'
    });

});

app.get('/mine', function (req, res) {
    const lastBlock = bitcoin.getLastBlock();
    const previousBlockHash = lastBlock['hash'];
    const currentBlockData = {
        transactions: bitcoin.pendingTransactions,
        index: lastBlock['index'] + 1
    };

    const nonce = bitcoin.proofOfWork(previousBlockHash, currentBlockData);

    const blockHash = bitcoin.hashBlock(previousBlockHash, currentBlockData, nonce);

    const newBlock = bitcoin.createNewBlock(nonce, previousBlockHash, blockHash);

    bitcoin.createNewTransaction(12.5, "00", nodeAddress);


    res.json({
        note: "New Block Mined Successfully",
        block: newBlock
    });
});

// register a node and broadcast it to network
app.post('/register-and-brocast-node', function (req, res) {
            const newNodeUrl = req.body.newNodeUrl;
            // registering new node if it already doenst exist
            if (bitcoin.networkNodes.indexOf(newNodeUrl == -1)) bitcoin.networkNodes.push(newNodeUrl);

            const regNodesPromises = [];
            bitcoin.networkNodes.forEach(networkNodeUrl => {
                const requestOptions = {
                    url: networkNodeUrl + '/register-node',
                    method: 'POST',
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
                        url: newNodeUrl + '/register-nodes-bulk',
                        method: 'POST',
                        body: {
                            allNewtworkNodes: [...bitcoin.networkNodes, bitcoin.currentNodeUrl]
                        },
                        json: true
                    };
                    return rp(bulkRegisterOptions);
                })
                .then(data => {
                    res.json({
                        note: 'New Node Registered With Network Succefully'
                    });
                });

            // register a node with network
            app.post('/register-node', function (req, res) {
                const newNodeUrl = req.body.newNodeUrl;
                const nodeNotAllreadyPresent = bitcoin.networkNodeUrl.indexOf(newNodeUrl) == -1;
                const notCurrentNode = bitcoin.currentNodeUrl !== newNodeUrl;
                if (nodeNotAllreadyPresent && notCurrentNode) bitcoin.networkNodes.push(newNodeUrl);
                res.json({
                    note: 'New node Registed Sucessfully'
                });
            });


            // regiter multiple nodes at once
            app.post('/register-nodes-bulk', function (req, res) {

            });


            app.listen(port, function () {
                console.log(`Listening to port ${port}.....`);

            });