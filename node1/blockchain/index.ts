import WebSocket, { WebSocketServer } from 'ws';
import { getBlockchain } from './utils';

const MY_PORT = 8040;
const MY_ADDRESS = `ws://localhost:${MY_PORT}`;
const openedSockets = [];
const currentBlockchain = getBlockchain();
const connectedAddresses: string[] = [];
const attemptingToConnectAddresses: string[] = [];
const nodeServer = new WebSocketServer({ port: MY_PORT });

nodeServer.on("connection", (socket: any) => {
    console.log("Incoming connection received");

    socket.on('message', (dataString: string) => {
        console.log(`Message: ${dataString}`);
        // const message = JSON.parse(dataString);
        // message.data.forEach((address: string) => connect(address));
    })
});

const knownPeers = [`ws://localhost:${MY_PORT}`, `ws://localhost:${8030}`];

const connect = (address: string) => {
    if (address !== MY_ADDRESS && !attemptingToConnectAddresses.includes(address) && !connectedAddresses.includes(address)) {
        console.log(`Attempting to connect to ${address}`);
        attemptingToConnectAddresses.push(address);

        const socket = new WebSocket(address);
        socket.on('open', () => {
            console.log(`Connection to ${address} opened`);
            attemptingToConnectAddresses.splice(attemptingToConnectAddresses.indexOf(address), 1);
            connectedAddresses.push(address);
            // socket.send(
            //     JSON.stringify({ type: 'BLOCKCHAIN', data: currentBlockchain })
            // )
        });

        socket.on('close', () => {
            console.log(`Connection to ${address} closed`);
            connectedAddresses.splice(connectedAddresses.indexOf(address), 1);
        });

        socket.on('error', () => {
            console.log(`Error while connecting to: ${address}`);
            const indexOfAddress = attemptingToConnectAddresses.indexOf(address);
            if (indexOfAddress >= 0) {
                attemptingToConnectAddresses.splice(indexOfAddress, 1);
            }
        })
    }
}

knownPeers.forEach((knownPeer) => connect(knownPeer));