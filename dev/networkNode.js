const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Blockchain = require('./blockchain');
const uuid = require('uuid/v1');
const port = process.argv[2];

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
    })
});

app.listen(port, function () {
    console.log(`Listening to port ${port}.....`);

});