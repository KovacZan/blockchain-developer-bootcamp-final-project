import { task } from "hardhat/config";
import * as fs from "fs-extra";
import "@nomiclabs/hardhat-ethers";
import { ArtistPass__factory, Multicall__factory, NFTGallery__factory } from "../../typechain-types";

task("full-deploy", "Deploy all contracts in this repository")
    .addOptionalParam<number>("maxtokens", "Max number of tokens (default will be set to 10)")
    .addOptionalParam<number>("price", "The price of the ArtistPass NFT (default will be set to 0.05ETH")
    .addOptionalParam<string>("url", "URL for ArtistPass Metadata")
    .addFlag("save", "Save the address to the frontend")
    .setAction(async (taskArgs, {web3, config, run, ethers, network}) => {
        await run("compile");

        console.log("Start Deploying all contracts!");

        let multicallContract;
        if (network.name === "localhost") {
            console.log("Deploy Multicall contract!");
            const multicallFactory = await ethers.getContractFactory("Multicall") as Multicall__factory;
            multicallContract = await multicallFactory.deploy();
            await multicallContract.deployed();
            console.log("Multicall Address: ", multicallContract.address);
            console.log("Multicall Transaction: ", multicallContract.deployTransaction.hash);
        }

        console.log("Deploying ArtistPass contract!");
        const maxTokens = taskArgs.maxtokens || 10;
        const price = taskArgs.price || web3.utils.toWei("50", "finney");
        const url = taskArgs.url || "https://gateway.pinata.cloud/ipfs/QmXzKi2F5L1Wvf35ePXGYxrYaS3kfHssbpQGzSiSPpxVAd/";

        const artistPassFactory = await ethers.getContractFactory("ArtistPass") as ArtistPass__factory;
        const artistPassContract = await artistPassFactory.deploy(maxTokens, price, url);
        await artistPassContract.deployed();
        console.log("ArtistPass Contract Address: ", artistPassContract.address);
        console.log("ArtistPass Contract Transaction: ", artistPassContract.deployTransaction.hash);

        console.log("Deploying NFTGallery contract!");
        const nftGalleryFactory = await ethers.getContractFactory("NFTGallery") as NFTGallery__factory;
        const nftGalleryContract = await nftGalleryFactory.deploy(artistPassContract.address);
        await nftGalleryContract.deployed();

        console.log("NFTGallery Contract Address: ", nftGalleryContract.address);
        console.log("NFTGallery Contract Transaction: ", nftGalleryContract.deployTransaction.hash);

        if (taskArgs.save) {
            console.log("Saving addresses to frontend files!");
            fs.removeSync(`${config.paths.root}/../frontend/src/libraries/generated/contractAddresses.ts`);
            if (network.name === "localhost" && multicallContract) {
                fs.removeSync(`${config.paths.root}/../frontend/src/libraries/generated/multicallAddress.ts`);
                fs.appendFileSync(
                    `${config.paths.root}/../frontend/src/libraries/generated/multicallAddress.ts`,
                    `export const multicallAddress = '${multicallContract.address}'\n`,
                );
            }
            fs.appendFileSync(
                `${config.paths.root}/../frontend/src/libraries/generated/contractAddresses.ts`,
                // eslint-disable-next-line max-len
                `export const artistPassContract = '${artistPassContract.address}'\nexport const nftGalleryContract = '${nftGalleryContract.address}'\n`,
            );
        }
    });

