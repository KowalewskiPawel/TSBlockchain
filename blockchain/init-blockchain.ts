import { genesisBlock } from './consts';
import { writeBlockchain, writeTransactions } from './blockchain-helpers';

writeBlockchain([genesisBlock]);
writeTransactions([]);