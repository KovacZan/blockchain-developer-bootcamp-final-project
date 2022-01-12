import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { ArtistPass, ArtistPass__factory } from "../../../typechain-types";

task("mint", "Mint ArtistPass NFT")
    .addParam<string>("contract", "The address of ArtistPass!")
    .setAction(async (taskArgs, {run, ethers}) => {
        await run("compile");

        const accounts = await ethers.getSigners();
        const signer = accounts[0];

        const factory = await ethers.getContractFactory("ArtistPass") as ArtistPass__factory;
        const contract = new ethers.Contract(
            taskArgs.contract,
            factory.interface,
            signer
        ) as ArtistPass;

        const price = await contract.price();
        const trx = await contract.mint({value: price});

        console.log("Transaction Hash: ", trx.hash);
    });

