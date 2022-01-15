## Contracts

> Before using any command from this package make sure you installed dependencies in root folder

## Testing

To run tests for smart contracts execute the following:

1. Compile Typechain Contract Types
```
yarn compile
```
2. Run Tests
```
yarn test
```

## Environment setup
Check .env.example for sample setup of .env file

Setup RPC URL
```
RINKEBY_RPC_URL=https://eth-rinkeby.alchemyapi.io/v2/ABC-YOUR-KEY 

# or use other network prefix for other networks
```

Setup Mnemonic or PrivateKey
```
MNEMONIC=some-mnemonic
# or
PRIVATE_KEY=private-key
```

Optional parameter - for running etherscan verification command
```
ETHERSCAN_API_KEY=your-etherscan-api-key
```

Optional parameter - for market gas fees analysis after test run
```
COIN_MARKET_CAP=your-coin-market-cap-api-key
```

## Deploying 
Before deploying contracts make sure you run: 
```
yarn compile
```
Default network for running hardhat commands is localhost on http://127.0.0.1:8545

### ArtistPass deployment

To deploy `ArtistPass` smart contract run the following:

```
hardhat deploy-artist-pass --maxtokens 10 --price 5000 --url some-url --network rinkeby
```
- maxtokens  - this parameter is optional default is set to 10
- price - this parameter is optional default is set to 0.05 ETH
- url - is optional parameter default is set to `https://gateway.pinata.cloud/ipfs/QmXzKi2F5L1Wvf35ePXGYxrYaS3kfHssbpQGzSiSPpxVAd/`


### NFTGallery deployment

To deploy `NFTGallery` smart contract run the following:

```
hardhat deploy-nft-gallery --address <ADDRESS-OF-ARTIST-PASS-CONTRACT> --network rinkeby
```


### Multicall deployment

Deploy Multicall contract to localhost network to help you work with local node.

```
hardhat deploy-multicall 
```

## Full deployment

Full deployment of both contracts with the following command.

```
hardhat full-deploy --network ropsten
```
or
```
yarn deploy
```
To save address into `frontend/libraries/generated/contractAddress.ts` add `--save` flag
```
hardhat full-deploy --save --network rinkeby
```

### Contract verification
To verify contract make sure you included `ETHERSCAN_API_KEY` into .env file.

Run the following commands: 
For ArtistPass contract
```
hardhat verify 0xB30CdE087f9Aec21d4af03EfBa66995A6C1C1cb6 10 50000000000000000 https://gateway.pinata.cloud/ipfs/QmXzKi2F5L1Wvf35ePXGYxrYaS3kfHssbpQGzSiSPpxVAd/ --network rinkeby
```
For NFTGallery contract
```
hardhat verify 0xB30CdE087f9Aec21d4af03EfBa66995A6C1C1cb6 0xB30CdE087f9Aec21d4af03EfBa66995A6C1C1cb6 --network rinkeby
```

## Other hardhat commands
Commonly used commands for hardhat are:
To setup node, it can be also done with `yarn chain`
```
hardhat node
```
----
To compile the code, it can be also done with `yarn compile`

This generates typechain-types for this project for easier interaction with smart contracts
```
hardhat compile
```
compile command generates files in `contracts/typechain-types` and in `frontend/generated`

---
TTo clean up code, it can be also done with `yarn clean`
```
hardhat clean
```
----

### Custom Commands to interact with smart contracts

- <code>hardhat mint --contract CONTRACT-OF-ARTISTPASS</code>
- <code>hardhat set-approval --apcontract CONTRACT-OF-ARTISTPASS --nfcontract ADDRESS-YOU-WANT-TO-APPROVE</code>
- <code>hardhat create-art --contract CONTRACT-OF-NFT-GALLERY --artistpass ID-OF-ARTISTPASS-NFT --name NAME --description DESCRIOTION --url URL</code>
- <code>hardhat create-auction --contract CONTRACT-OF-NFT-GALLERY --artid ID-OF-NFT --price PRICE-FOR-THIS</code>
- <code>hardhat cancel-auction --contract CONTRACT-OF-NFT-GALLERY --auctionid ID-OF-AUCTION</code>
- <code>hardhat buy-art --contract CONTRACT-OF-NFT-GALLERY --auctionid ID-OF-AUCTION</code>
