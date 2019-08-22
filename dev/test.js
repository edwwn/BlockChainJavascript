const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
bitcoin.createNewBlock(2434, 'EQWUIEYQWUYHEUIQWB', 'SAKJDLASHFKLASHFASFJA');

//bitcoin.createNewBlock(24534, 'EQWUIEYQWUYHGFHEUIQWB', 'SAFGHFGJERWGKJDLASHFKLASHFASFJA')

bitcoin.createNewTransaction(100, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');

bitcoin.createNewBlock(56678, 'TRHGHGJHYJHJ', 'GJGHJHJYUIKII');

bitcoin.createNewTransaction(67, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');
bitcoin.createNewTransaction(898, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');
bitcoin.createNewTransaction(5655, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');

bitcoin.createNewBlock(546567, 'FGJGHJGHJHJ', 'WEQREWRYTRYTWY');


console.log(bitcoin.chain[2]);