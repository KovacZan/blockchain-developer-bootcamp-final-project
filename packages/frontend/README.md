# Frontend
Before running this project make sure you have executed `yarn compile` inside root folder
or `yarn compile` inside `packages/contracts` .

This generates Typechain typings for interaction with smart contract and generates ABI.

## Environment

Check .env.example file for .env setup.

`REACT_APP_ETHERS_DEFAULT_PROVIDER` requires RPC url.

`REACT_APP_CHAIN_ID` set the id of chain which you want to support.

For contract addresses check `src/generated/contractAddresses.ts`. This file is generated autoomatically
if you put `--save` flag on `hardhat full-deploy --save --network rinkeby` inside contractrs package.

If you plan to develop frontend on local environment make sure you include `Multicall` contract address 
inside `src/libraries/generated/multicallAddress.ts`

## How to run this project

For development run:
```
yarn start
```

For production run:
```
yarn build
```
