import { writeBlockchain, writeTransactions } from './blockchain-helpers';
const genesisBlock = { hash: 0, previousHash: null };

writeBlockchain([genesisBlock]);

writeTransactions([]);