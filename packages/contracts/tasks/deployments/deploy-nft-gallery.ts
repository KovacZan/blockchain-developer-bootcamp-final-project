import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { NFTGallery__factory } from "../../typechain-types";

task("deploy-nft-gallery", "Deploy NFTGallery contract")
    .addParam<string>("address", "The address of ArtistPass!")
    .setAction(async (taskArgs, { run, ethers}) => {
        await run("compile");

        const address = taskArgs.address;

        console.log("Deploying NFTGallery contract!");
        const contractFactory = await ethers.getContractFactory("NFTGallery") as NFTGallery__factory;
        const contract = await contractFactory.deploy(address);
        await contract.deployed();

        console.log("NFTGallery Contract Address: ", contract.address);
        console.log("NFTGallery Contract Transaction: ", contract.deployTransaction.hash);
    });

