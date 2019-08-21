const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
bitcoin.createNewBlock(2434, 'EQWUIEYQWUYHEUIQWB', 'SAKJDLASHFKLASHFASFJA')
bitcoin.createNewBlock(2434, 'EQWUDFGSGTTHYGHQWB', 'SAGHJFKJDLASHFKLASHFASFJA')
bitcoin.createNewBlock(24534, 'EQWUIEYQWUYHGFHEUIQWB', 'SAFGHFGJERWGKJDLASHFKLASHFASFJA')

console.log(bitcoin);