import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { NFTGallery, NFTGallery__factory } from "../../../typechain-types";

task("create-art", "Create art in NFTGallery contract")
    .addParam<string>("contract", "The address of NFTGallery!")
    .addParam<number>("artistpass", "The id of ArtistPass contract")
    .addOptionalParam<string>("name", "The name of the art")
    .addOptionalParam<string>("description", "The description of the art")
    .addOptionalParam<string>("url", "The image url of the art")
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

        const name = taskArgs.name || "art";
        const description = taskArgs.description || "description";
        const url = taskArgs.url || "https://via.placeholder.com/150";

        const trx = await contract.createArt(name,description,url,taskArgs.artistpass);

        console.log("Transaction Hash: ", trx.hash);
    });

