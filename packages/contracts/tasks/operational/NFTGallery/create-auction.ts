import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { NFTGallery, NFTGallery__factory } from "../../../typechain-types";

task("create-auction", "Create auction in NFTGallery contract")
    .addParam<string>("contract", "The address of NFTGallery!")
    .addParam<number>("artid", "The id of NFT Art")
    .addParam<number>("price", "The price for NFT Art")
    .setAction(async (taskArgs, {run, ethers}) => {
        await run("compile");

        const accounts = await ethers.getSigners();
        const signer = accounts[0];

        const factory = await ethers.getContractFactory("NFTGallery") as NFTGallery__factory;
        const contract = new ethers.Contract(
            taskArgs.contract,
            factory.interface,
            signer
        ) as NFTGallery;


        const trx = await contract.createAuction(taskArgs.artid, taskArgs.price);

        console.log("Transaction Hash: ", trx.hash);
    });

