import "@nomiclabs/hardhat-ethers";
import "@nomiclabs/hardhat-etherscan";
import "@typechain/hardhat";
import "dotenv/config";
import "hardhat-gas-reporter";
import "@nomiclabs/hardhat-solhint";
import "@typechain/hardhat";

import { HardhatUserConfig } from "hardhat/types";

import "./tasks/utils/accounts";
import "./tasks/utils/balance";
import "./tasks/utils/block-number";

import "./tasks/deployments/deploy";
import "./tasks/deployments/compile";
import "./tasks/deployments/clean";

import "./tasks/operational/mint";

const MAINNET_RPC_URL = process.env.MAINNET_RPC_URL || "https://eth-mainnet.alchemyapi.io/v2/your-api-key";
const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL || "https://eth-rinkeby.alchemyapi.io/v2/your-api-key";
const KOVAN_RPC_URL = process.env.KOVAN_RPC_URL || "https://eth-kovan.alchemyapi.io/v2/your-api-key";
const ROPSTEN_RPC_URL = process.env.ROPSTEN_RPC_URL || "https://eth-ropsten.alchemyapi.io/v2/your-api-key";
const MNEMONIC = process.env.MNEMONIC || "your mnemonic";
const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
// optional
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const COIN_MARKET_CAP = process.env.COIN_MARKET_CAP;

const config: HardhatUserConfig = {
    defaultNetwork: "hardhat",
    networks: {
        mainnet: {
            url: MAINNET_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
        },
        hardhat: {
            // // If you want to do some forking, uncomment this
            // forking: {
            //   url: MAINNET_RPC_URL
            // }
        },
        localhost: {
            url: "http://127.0.0.1:8545",
        },
        ropsten: {
            url: ROPSTEN_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
        },
        kovan: {
            url: KOVAN_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
        },
        rinkeby: {
            url: RINKEBY_RPC_URL,
            accounts: PRIVATE_KEY ? [PRIVATE_KEY] : { mnemonic: MNEMONIC },
        },
        ganache: {
            url: "http://localhost:8545",
            accounts: {
                mnemonic: MNEMONIC,
            },
        },
    },
    solidity: {
        version: "0.8.10",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    mocha: {
        timeout: 100000,
    },
    etherscan: {
        // Your API key for Etherscan
        // Obtain one at https://etherscan.io/
        apiKey: ETHERSCAN_API_KEY,
    },
    gasReporter: {
        coinmarketcap: COIN_MARKET_CAP,
    },
    multiFileGeneration: {
        artifactsPaths: ["../frontend/src/libraries/generated/artifacts"],
        typesPaths: ["../frontend/src/libraries/generated/typechain-types"]
    }
};

export default config;
