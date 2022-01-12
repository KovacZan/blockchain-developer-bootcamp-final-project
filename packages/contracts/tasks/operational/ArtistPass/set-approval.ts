import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { ArtistPass, ArtistPass__factory } from "../../../typechain-types";

task("set-approval", "Set approval to the contract")
    .addParam<string>("apcontract", "The address of ArtistPass!")
    .addParam<string>("ngcontract", "The address of NFTGallery!")
    .setAction(async (taskArgs, {run, ethers}) => {
        await run("compile");

        const accounts = await ethers.getSigners();
        const signer = accounts[0];

        const factory = await ethers.getContractFactory("ArtistPass") as ArtistPass__factory;
        const contract = new ethers.Contract(
            taskArgs.apcontract,
            factory.interface,
            signer
        ) as ArtistPass;

        const approval = await contract.setApprovalForAll(taskArgs.ngcontract, true);

        console.log("Transaction Hash: ", approval.hash);
    });

