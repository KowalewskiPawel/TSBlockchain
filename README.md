<div align="center">
  <h1>TS Blockchain</h1>
  <strong>A simple blockchain built in TypeScript, inspired by <a href="https://github.com/freeCodeCamp/web3-curriculum">Web 3 FreeCodeCamp.org course</a>.</strong>
</div>

## About

Simple Blockchain, with minimal functionality implemented in TypeScript for the educational purposes.

## Installation

```
1. git clone https://github.com/KowalewskiPawel/TSBlockchain.git

2. yarn
```

### Requirements

* Node v18.7.0
* yarn v1.22.19

### Usage

#### Init Blockchain

```
npx ts-node blockchain/init-blockchain.ts
```

#### Generate Wallet

```
npx ts-node blockchain/generate-wallet.ts <wallet_name>
```


#### Mine Blockchain

```
npx ts-node blockchain/mine-block.ts 
```

#### Get Address Info

```
npx ts-node blockchain/get-address-info.ts <wallet_name>
```

#### Airdrop items to random wallets

```
npx ts-node blockchain/gift-items.ts
```

#### Buy Item

```
node buy-item.js <privateKey> <item>
```

#### Sell Item

```
node sell-item.js <privateKey> <item>
```

## License

* MIT license ([LICENSE-MIT](LICENSE-MIT) or http://opensource.org/licenses/MIT)