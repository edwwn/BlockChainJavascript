const Blockchain = require('./blockchain');

const bitcoin = new Blockchain();
//Testing of the Create Block and Adding of the Previuos Transaction to next block

//bitcoin.createNewBlock(2434, 'EQWUIEYQWUYHEUIQWB', 'SAKJDLASHFKLASHFASFJA');

//bitcoin.createNewBlock(24534, 'EQWUIEYQWUYHGFHEUIQWB', 'SAFGHFGJERWGKJDLASHFKLASHFASFJA')

//bitcoin.createNewTransaction(100, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');

//bitcoin.createNewBlock(56678, 'TRHGHGJHYJHJ', 'GJGHJHJYUIKII');

//bitcoin.createNewTransaction(67, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');
//bitcoin.createNewTransaction(898, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');
//bitcoin.createNewTransaction(5655, 'ALEXfhskldfjleoutuoe', 'JANEhfjkashjkfhsue');

//bitcoin.createNewBlock(546567, 'FGJGHJGHJHJ', 'WEQREWRYTRYTWY');

//console.log(bitcoin.chain[2]);


// this is the test data
//const previuosBlockHash = 'KASJHDKJHSAJKFHSLFIEKLDFJSDLFJ'
//const currentBlockData = [{
// amount: 10,
//sender: 'DSLKFJSLDFJISDFJ',
//recipient: 'JFSAKLFJDLSJFJFKJSD'
// },
//{
// amount: 81,
// sender: '78LDSJFKLSJFIJFGH',
// recipient: 'DJSLGSDKGSDJGLSDGIIJKJ'
// }, {
//  amount: 67,
//  sender: '8KLSDJFLKDSJF;S',
//  recipient: 'YWRKDFGHKSDJHGSDKGH'
//  },
//];
//console.log(bitcoin.proofOfWork(previuosBlockHash, currentBlockData));


//const nonce = 100;
// used with tha data to test hash production 
//console.log(bitcoin.hashBlock(previuosBlockHash, currentBlockData, 48961));

console.log(bitcoin);