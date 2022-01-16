# NFT Gallery 

The idea is to create NFT based Gallery for Artists, where artist will have to require a Pass NFT to
mint their art into the gallery. The project consist of two parts, `contracts` where solidity contracts,
tests and script for code generation, deployment and interaction are located, `frontend` where front-end
React code is located with Typechain generated bindings.

## Contract Features
> There are two contracts for this project, which are dependent on each other for this project.

### ArtistPass Features

- It contains all Features of ERC721 and ERC721Enumerable interfaces from OpenZeppelin
- It contains pausable features
- It contains only owner feature
- It contains mint feature
- It contains tokensOfOwner feature - list all NFT ids from particular address
- You can burn token - it will be used to burn token inside NFTGallery smart contract
- You can withdraw founds collected from minting - only owner can do this

### NFTGallery Features

- It contains all Features of ERC721 and ERC721Enumerable interfaces from OpenZeppelin
- It contains pausable features
- It contains only owner feature
- It contains createArt feature, where you burn your ArtistPass NFT to create art in this contract,
this is protected with ReentrancyGuard
- You can create Auction for NFTGallery NFT
- You can cancel Auction
- You can buy from auction
- You can list all tokensOfOwner


## Frontend Features

> Frontend doesn't yet contain all the feautres supported by the smart contracts

- You can connect your wallet, check your address and balance
- You can purchase an NFT ArtistPass token for specified price
- You can see all your ArtistPasses

## Project Quick Start

> This project requires yarn and node to be installed on your machine

> For more details about setting contracts check `packages/contracts/README.md`

> For more details about setting frontend check `packages/frontend/README.md`

1. Clone the repository
```
git clone https://github.com/KovacZan/blockchain-developer-bootcamp-final-project.git
```
2. Install dependencies
```
yarn install
```
3. Compile Typechain Contract Types
```
yarn compile
```
4. Run React App
```
yarn start
```

## Testing

1. Clone the repository
```
git clone https://github.com/KovacZan/blockchain-developer-bootcamp-final-project.git
```
2. Install dependencies
```
yarn install
```
3. Compile Typechain Contract Types
```
yarn compile
```
4. Run Tests
```
yarn test
```


## Project Structure
```
|-- README.md
|-- avoiding_common_attacks.md 
|-- design_pattern_decisions.md
|-- packages
|   |-- contracts
|   |   |-- README.md //detailed usage explanation of contracts package
|   |   |-- contracts //solidity smart contracts
|   |   |-- hardhat.config.ts //configurations for hardhat
|   |   |-- tasks //tasks to use with hardhat
|   |   |-- test //tests for solidity smart contracts
|   `-- frontend
|       |-- README.md //detailed usage explanation of frontend package
|       |-- public
|       |-- src
|-- workflows.txt
```

## Screen Recording Link

https://www.youtube.com/watch?v=0KijWzEceaQ

## Deployed Contract Links

ArtistPass: https://rinkeby.etherscan.io/address/0x7Db0f41902A9a590A1D36C410A919f4352A5b0D0
NFTGallery: https://rinkeby.etherscan.io/address/0x19102249B6a94E83A881678AF3ab4001fCC65Ff8

## Website link

https://blockchain-developer-bootcamp-final-project-dyzehf6dk-kovaczan.vercel.app/

## Certification Address
My address for certification:
> 0x9e5652761927b33f1E59A13275230BF10084C891
