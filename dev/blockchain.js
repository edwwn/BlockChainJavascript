function Blockchain() {
    this.chain = [];
    this.newTransactions = [];
}


Blockchain.prototype.createNewBlock = function (nonce, previuosBlockhash, hash) {
    const newBlock = {
        index: this.chain.length + 1,
        timestamp: Date.now(),
        transactions: this.newTransactions,
        nonce: nonce,
        hash: hash,
        previuosBlockhash: previuosBlockhash
    };

    this.newTransactions = [];
    this.chain.push(newBlock);

    return newBlock;
}

module.exports = Blockchain;