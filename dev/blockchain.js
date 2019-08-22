const sha256 = require('sha256');


function Blockchain() {
    this.chain = [];
    this.pendingTransactions = [];
}

Blockchain.prototype.createNewBlock = function (nonce, previuosBlockhash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.pendingTransactions,
        nonce: nonce,
        hash: hash,
        previuosBlockhash: previuosBlockhash
    };

    this.pendingTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
};

Blockchain.prototype.createNewTransaction = function (
    amount,
    sender,
    recipient
) {
    const newTransaction = {
        amount: amount,
        sender: sender,
        recipient: recipient
    };
    this.pendingTransactions.push(newTransaction);

    return this.getLastBlock()['index'] + 1;
};


Blockchain.prototype.hashBlock = function (previuosBlockhash, currentBlockData, nounce) {
    const dataAsString = previuosBlockhash + nonce.toString() + JSON.stringify(currentBlockData);
    const hash = sha256(dataAsString);
    return hash;
}

module.exports = Blockchain;

Blockchain.prototype.getLastBlock = function () {
    return this.chain[this.chain.length - 1];
};