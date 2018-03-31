// An experimental javascript blockchain

const SHA256 = require('crypto-js/sha256');

class Block {
    constructor(index, timestamp, data, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    calculateHash() {
        return SHA256(this.index + this.previousHash + this.timestamp + JSON.stringify(this.data) + this.nonce).toString();
    }

    mineBlock(dif) {
        while(this.hash.substring(0, dif) !== Array(dif + 1).join('0')) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log('Block Mined: ' + this.hash);
    }
}

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.dif = 5;
    }

    createGenesisBlock() {
        return new Block(0, "01/01/2018", "Genesis block", "0")
    }
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }
    addBlock(newBlock) {
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.dif);
        this.chain.push(newBlock);
    }
    isChainValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i];
            const previousBlock = this.chain[i - 1];

            if (currentBlock.hash !== currentBlock.calculateHash()) {
                return false;
            }
            
            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        }

        return true;
    }
}

let tCoin = new Blockchain();

console.log('Mining block 1... ')
tCoin.addBlock(new Block(1, "10/07/2018", { amount: 4}));


console.log('Mining block 2... ')
tCoin.addBlock(new Block(2, "12/07/2018", { amount: 20}));

