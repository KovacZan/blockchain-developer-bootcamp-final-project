import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { Signer } from "ethers";
import { ArtistPass, ArtistPass__factory, NFTGallery, NFTGallery__factory } from "../typechain-types";
import { ethers, web3 } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect } = chai;

describe("NFTGallery", function () {
    let accounts: Signer[];

    let artistPassContract: ArtistPass;
    const maxTokens = 5;
    const price = web3.utils.toWei("50", "finney"); // 0.05 ETH
    const uri = "https://ipfs.io/ipfs/QmeCfYm847UDEJtBgb7TtuKpCuY2qCkrtEDHX4hBH8ofMt/";

    let nftGalleryContract: NFTGallery;

    beforeEach(async () => {
        accounts = await ethers.getSigners();

        const artistPassFactory = (await ethers.getContractFactory("ArtistPass", accounts[0])) as ArtistPass__factory;
        artistPassContract = await artistPassFactory.deploy(maxTokens, price, uri);

        const nftGalleryFactory = (await ethers.getContractFactory("NFTGallery", accounts[0])) as NFTGallery__factory;
        nftGalleryContract = await nftGalleryFactory.deploy(artistPassContract.address);
    });

    describe("Test createArt", function () {
        beforeEach(async () => {
            await artistPassContract.mint({ value: price });
        });

        it("Should test if it cancels if not approved", async () => {
            await expect(nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0)).to.be.revertedWith("ArtistPass: Caller is not owner nor approved");
        });

        it("Should test if it works with approved", async () => {
            await artistPassContract.setApprovalForAll(nftGalleryContract.address, true);
            await expect(nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0)).to.be.fulfilled;

            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await expect(nftGalleryContract
                .connect(accounts[1])
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    1)).to.be.revertedWith("ArtistPass: Caller is not owner nor approved");
        });

        it("Should test empty strings", async () => {
            await expect(nftGalleryContract
                .createArt(
                    "",
                    "Description",
                    "https://via.placeholder.com/150",
                    0)).to.be.revertedWith("NFTGallery: String is empty");

            await expect(nftGalleryContract
                .createArt(
                    "Art1",
                    "",
                    "https://via.placeholder.com/150",
                    0)).to.be.revertedWith("NFTGallery: String is empty");

            await expect(nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "",
                    0)).to.be.revertedWith("NFTGallery: String is empty");
        });

        it("Should test if rejected on pause", async () => {
            await nftGalleryContract.setPaused(true);
            await expect(nftGalleryContract.createArt(
                "Art1",
                "Description",
                "https://via.placeholder.com/150",
                0)).to.be.revertedWith(
                "Pausable: paused",
            );
        });

        it("Should test that only owner can of pass can create art", async () => {
            await expect(nftGalleryContract
                .connect(accounts[1])
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0)).to.be.revertedWith("NFTGallery: ArtistPass not owned by sender");
        });
    });

    describe("Test createAuction", async () => {
        beforeEach(async () => {
            await artistPassContract.mint({ value: price });
            await artistPassContract.setApprovalForAll(nftGalleryContract.address, true);

            await nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0);
        });

        it("Should test if create auction works", async () => {
            const artPrice = web3.utils.toWei("1", "ether");

            await expect(nftGalleryContract.createAuction(0, artPrice)).to.be.fulfilled;

            expect(await nftGalleryContract.auctionIDCounter()).to.be.equal(1);

            const auction = await nftGalleryContract.getAuction(0);
            expect(auction.price).to.be.equal(artPrice);
            expect(auction.artID).to.be.equal(0);
            expect(auction.isFinished).to.be.equal(false);

            expect(await nftGalleryContract.checkIfArtOnAuction(0)).to.be.equal(true);

            await expect(nftGalleryContract.connect(accounts[1])
                .createAuction(0, artPrice))
                .to.be.revertedWith("NFTGallery: NFT Ownership required");

            await expect(nftGalleryContract
                .createAuction(0, artPrice))
                .to.be.revertedWith("NFTGallery: Art is on Auction");

            await expect(nftGalleryContract
                .transferFrom(await accounts[0].getAddress(), await accounts[1].getAddress(),0))
                .to.be.revertedWith("NFTGallery: Art is on Auction");
        });
    });

    describe("Test cancelAuction", async () => {
        beforeEach(async () => {
            await artistPassContract.mint({ value: price });
            await artistPassContract.setApprovalForAll(nftGalleryContract.address, true);

            await nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0);

            const artPrice = web3.utils.toWei("1", "ether");

            await expect(nftGalleryContract.createAuction(0, artPrice)).to.be.fulfilled;
        });

        it("Should test if cancel auction works", async () => {
            await expect(nftGalleryContract.cancelAuction(0)).to.be.fulfilled;

            const auction = await nftGalleryContract.getAuction(0);
            expect(auction.price).to.be.equal(web3.utils.toWei("1", "ether"));
            expect(auction.artID).to.be.equal(0);
            expect(auction.isFinished).to.be.equal(true);

            expect(await nftGalleryContract.checkIfArtOnAuction(0)).to.be.equal(false);

            await expect(nftGalleryContract.cancelAuction(0))
                .to.be.revertedWith("NFTGallery: Art is not on Auction");

            await expect(nftGalleryContract
                .transferFrom(await accounts[0].getAddress(), await accounts[1].getAddress(),0))
                .to.be.fulfilled;
        });
    });

    describe("Test buyArt", async () => {
        const artPrice = web3.utils.toWei("1", "ether");

        beforeEach(async () => {
            await artistPassContract.mint({ value: price });
            await artistPassContract.setApprovalForAll(nftGalleryContract.address, true);

            await nftGalleryContract
                .createArt(
                    "Art1",
                    "Description",
                    "https://via.placeholder.com/150",
                    0);

            await expect(nftGalleryContract.createAuction(0, artPrice)).to.be.fulfilled;
        });

        it("Should test if buy art works", async () => {
            const beforeTransfer = await accounts[0].getBalance();
            await expect(nftGalleryContract.connect(accounts[1])
                .buyArt(0, { value: artPrice })).to.be.fulfilled;

            expect(beforeTransfer.add(artPrice)).to.be.equal(await accounts[0].getBalance());

            const auction = await nftGalleryContract.getAuction(0);
            expect(auction.price).to.be.equal(artPrice);
            expect(auction.artID).to.be.equal(0);
            expect(auction.isFinished).to.be.equal(true);

            expect(await nftGalleryContract.checkIfArtOnAuction(0)).to.be.equal(false);

            expect(await nftGalleryContract.ownerOf(0)).to.be.equal(await accounts[1].getAddress());

            await expect(nftGalleryContract.connect(accounts[1])
                .buyArt(0, { value: artPrice }))
                .to.be.revertedWith("NFTGallery: Art is not on Auction");
        });
    });
});
