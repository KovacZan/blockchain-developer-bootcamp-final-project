import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { Signer } from "ethers";
import { ArtistPass, ArtistPass__factory } from "../typechain-types";
import { ethers, web3 } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect, assert } = chai;

describe("ArtistsPass", () => {
    let accounts: Signer[];
    let artistPassContract: ArtistPass;

    const uri = "https://ipfs.io/ipfs/QmeCfYm847UDEJtBgb7TtuKpCuY2qCkrtEDHX4hBH8ofMt/";
    const maxTokens = 5;
    const price = web3.utils.toWei("50", "finney"); // 0.05 ETH

    beforeEach(async () => {
        accounts = await ethers.getSigners();
        const passFactory = (await ethers.getContractFactory("ArtistPass", accounts[0])) as ArtistPass__factory;
        artistPassContract = await passFactory.deploy(maxTokens, price, uri);
    });

    describe("test all possible mint scenarios", () => {
        it("should test if mint works as expected", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            expect(await artistPassContract.ownerOf(0)).to.be.equal(await accounts[1].getAddress());
        });

        it("should test if price requirement works", async () => {
            const lowPrice = web3.utils.toBN(price).subn(1).toString();

            expect(artistPassContract.connect(accounts[1]).mint({ value: lowPrice })).to.be.rejectedWith(
                "ETH amount is not sufficient",
            );

            await artistPassContract.changePrice(lowPrice);
            await artistPassContract.connect(accounts[2]).mint({ value: lowPrice.toString() });
            expect(await artistPassContract.tokenOfOwnerByIndex(await accounts[2].getAddress(), 0)).to.be.equal(0);
        });

        it("should test max tokens requirement", async () => {
            for (let i = 0; i < maxTokens; i++) {
                await artistPassContract.connect(accounts[1]).mint({ value: price });
            }
            expect(artistPassContract.connect(accounts[1]).mint({ value: price })).to.be.rejectedWith(
                "Maximum amount has been reached!",
            );
        });

        it("should test if rejected on pause", async () => {
            await artistPassContract.setPaused(true);
            expect(artistPassContract.connect(accounts[1]).mint({ value: price })).to.be.eventually.rejectedWith(
                "Pausable: paused",
            );
        });
    });

    describe("test burn scenarios", () => {
        it("should test if burn works as expected", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).burn(0);

            expect(artistPassContract.connect(accounts[1]).ownerOf(0)).to.be.rejectedWith(
                "ERC721: owner query for nonexistent token",
            );
            expect(await artistPassContract.connect(accounts[1]).totalSupply()).to.be.equal(0);
        });

        it("should test double burn of the same token", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).burn(0);
            expect(artistPassContract.connect(accounts[1]).burn(0)).to.be.rejectedWith(
                "ERC721: operator query for nonexistent token",
            );

            expect(artistPassContract.ownerOf(0)).to.be.rejectedWith("ERC721: owner query for nonexistent token");
        });
    });
});
