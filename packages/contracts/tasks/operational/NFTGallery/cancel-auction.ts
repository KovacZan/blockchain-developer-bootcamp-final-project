import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { NFTGallery, NFTGallery__factory } from "../../../typechain-types";

task("cancel-auction", "Cancel auction in NFTGallery contract")
    .addParam<string>("contract", "The address of NFTGallery!")
    .addParam<number>("auctionid", "The id of auction")
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


        const trx = await contract.cancelAuction(taskArgs.auctionid);

        console.log("Transaction Hash: ", trx.hash);
    });

