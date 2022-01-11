import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { Signer } from "ethers";
import { ArtistPass, ArtistPass__factory, NFTGallery, NFTGallery__factory } from "../typechain-types";
import { ethers, web3 } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect, assert } = chai;

describe("NFTGallery", function () {
    let accounts: Signer[];
    const uri = "www.placeholder.com/";

    let passContract: ArtistPass;
    let nftGallery: NFTGallery;
    it("should", async () => {
        accounts = await ethers.getSigners();

        const passFactory = (await ethers.getContractFactory("ArtistsPass", accounts[0])) as ArtistPass__factory;
        passContract = await passFactory.deploy(10, 1, uri);

        const halloweenFactory = (await ethers.getContractFactory("NFTGallery", accounts[0])) as NFTGallery__factory;
        nftGallery = await halloweenFactory.deploy(passContract.address);

        await passContract.setApprovalForAll(nftGallery.address, true);
        // await passContract.setApprovalForAll(passContract.address, true);

        await passContract.mint({ value: 1 });

        await nftGallery.createArt("zan", "zan", "zan", 0);
        console.log(accounts[0].getAddress());
        await nftGallery.createAuction(0, 10000000000000);
        console.log("hgere");
        // await nftGallery.setApprovalForAll(nftGallery.address, true);

        await nftGallery.connect(accounts[1]).buyArt(1, { value: 10000000000000 });

        console.log(web3.eth.getBalance(await accounts[1].getAddress()));
    });
});
