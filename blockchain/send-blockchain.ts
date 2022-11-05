import WebSocket from 'ws';
import { getBlockchain } from './utils';
import { knownPeers, nodeServer } from "./index";

const currentBlockchain = getBlockchain();

nodeServer.on("open", (socket: any) => {
        // socket.send(
        //     JSON.stringify({ type: 'BLOCKCHAIN', data: currentBlockchain })
        // )
        socket.on('open', function open() {
            console.log('connected');
            socket.send(Date.now());
          });
});

//     const socket = new WebSocket(knownPeers[1]);
//     socket.on('open', () => {
//         console.log(`Connection to ${knownPeers[1]} opened`);
// });