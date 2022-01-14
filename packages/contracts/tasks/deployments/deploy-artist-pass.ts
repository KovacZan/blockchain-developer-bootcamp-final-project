import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { ArtistPass__factory } from "../../typechain-types";

task("deploy-artist-pass", "Deploy ArtistPass contract")
    .addOptionalParam<number>("maxtokens", "Max number of tokens (default will be set to 10)")
    .addOptionalParam<number>("price", "The price of the ArtistPass NFT (default will be set to 0.05ETH")
    .addOptionalParam<string>("url", "URL for ArtistPass Metadata")
    .setAction(async (taskArgs, {web3, run, ethers}) => {
        await run("compile");

        const maxTokens = taskArgs.maxtokens || 10;
        const price = taskArgs.price || web3.utils.toWei("50", "finney");
        const url = taskArgs.url || "https://gateway.pinata.cloud/ipfs/QmXzKi2F5L1Wvf35ePXGYxrYaS3kfHssbpQGzSiSPpxVAd/";

        console.log("Deploying ArtistPass contract!");
        const contractFactory = await ethers.getContractFactory("ArtistPass") as ArtistPass__factory;
        const contract = await contractFactory.deploy(maxTokens, price, url);
        await contract.deployed();

        console.log("ArtistPass Contract Address: ", contract.address);
        console.log("ArtistPass Contract Transaction: ", contract.deployTransaction.hash);
    });

