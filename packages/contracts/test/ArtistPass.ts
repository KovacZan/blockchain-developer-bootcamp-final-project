import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { BigNumber, Signer } from "ethers";
import { ArtistPass, ArtistPass__factory } from "../typechain-types";
import { ethers, web3 } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect } = chai;

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

    describe("Test all possible mint scenarios", () => {
        it("Should test if mint works as expected", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            expect(await artistPassContract.ownerOf(0)).to.be.equal(await accounts[1].getAddress());
        });

        it("Should test if price requirement works", async () => {
            const lowPrice = web3.utils.toBN(price).subn(1).toString();

            await expect(artistPassContract.connect(accounts[1]).mint({ value: lowPrice })).to.be.revertedWith(
                "ArtistPass: ETH amount is not sufficient",
            );

            await artistPassContract.changePrice(lowPrice);
            await artistPassContract.connect(accounts[2]).mint({ value: lowPrice.toString() });
            expect(await artistPassContract.tokenOfOwnerByIndex(await accounts[2].getAddress(), 0)).to.be.equal(0);
        });

        it("Should test max tokens requirement", async () => {
            for (let i = 0; i < maxTokens; i++) {
                await artistPassContract.connect(accounts[1]).mint({ value: price });
            }
            await expect(artistPassContract.connect(accounts[1]).mint({ value: price })).to.be.revertedWith(
                "ArtistPass: Maximum amount has been reached",
            );
        });

        it("Should test if rejected on pause", async () => {
            await artistPassContract.setPaused(true);
            await expect(artistPassContract.connect(accounts[1]).mint({ value: price })).to.be.revertedWith(
                "Pausable: paused",
            );
        });
    });

    describe("Test burn scenarios", () => {
        it("Should test if burn works as expected", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).burn(0);

            await expect(artistPassContract.connect(accounts[1]).ownerOf(0)).to.be.revertedWith(
                "ERC721: owner query for nonexistent token",
            );
            expect(await artistPassContract.connect(accounts[1]).totalSupply()).to.be.equal(0);
        });

        it("Should test double burn of the same token", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).burn(0);
            await expect(artistPassContract.connect(accounts[1]).burn(0)).to.be.revertedWith(
                "ERC721: operator query for nonexistent token",
            );

            expect(artistPassContract.ownerOf(0)).to.be.rejectedWith("ERC721: owner query for nonexistent token");
        });

        it("Should test if burn works with approved address", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).approve(await accounts[2].getAddress(), 0);

            await expect(artistPassContract.connect(accounts[2]).burn(0)).to.be.fulfilled;
        });

        it("Should test if burn works with approved for all", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            await artistPassContract.connect(accounts[1]).setApprovalForAll(await accounts[2].getAddress(), true);

            await expect(artistPassContract.connect(accounts[2]).burn(0)).to.be.fulfilled;
        });
    });

    describe("Test Withdraw",  () => {
        it("Should empty contract balance when withdrawing", async () => {
            await artistPassContract.connect(accounts[1]).mint({ value: price });
            expect(
                await web3.eth.getBalance(artistPassContract.address)
            ).to.equal(price);

            const balanceBeforeWithdrawing = await web3.eth.getBalance(
                await accounts[0].getAddress()
            );
            const withdrawCall = await artistPassContract.withdraw();
            const { gasUsed } = await web3.eth.getTransactionReceipt(
                withdrawCall.hash
            );
            const txFee = withdrawCall.gasPrice!.mul(gasUsed);
            const balanceAfterWithdrawing = await web3.eth.getBalance(
                await accounts[0].getAddress()
            );

            expect(
                await web3.eth.getBalance(artistPassContract.address)
            ).to.equal("0");
            expect(BigNumber.from(price).add(balanceBeforeWithdrawing).sub(txFee)).to.equal(
                balanceAfterWithdrawing
            );
        });

        it("Should throw an error if non contract owner tries to withdraw funds", async () => {
            await artistPassContract
                .connect(accounts[1])
                .mint({ value: price });

            await expect(
                artistPassContract.connect(accounts[1]).withdraw()
            ).to.be.revertedWith("Ownable: caller is not the owner");
        });
    });

    describe("Test tokensOfOwner", async () => {
        it("Should test if returns all tokens of owner", async () => {
            for (let i = 0; i < maxTokens; i++) {
                await artistPassContract.connect(accounts[1]).mint({ value: price });
            }
            const tokens = await artistPassContract.tokensOfOwner(await accounts[1].getAddress());

            expect(tokens.map(x => x.toNumber())).to.have.same.members([...Array(maxTokens).keys()]);
        });
    });
});
