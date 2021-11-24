import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { BytesLike, Signer } from "ethers";
import { DIDManager, DIDManager__factory } from "frontend/types/typechain";
import { ethers, web3 } from "hardhat";
import { entropyToMnemonic, mnemonicToEntropy, generateMnemonic } from "bip39";
// @ts-ignore
import { sync } from "simple-sha256";
import secp256k1 from "secp256k1";
import { generateKeyPair } from "./utils";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const {expect, assert} = chai;

describe("DIDManager", function () {
    let accounts: Signer[];
    let didManager: DIDManager;

    const initialFee = ethers.utils.parseUnits("1", "ether");

    beforeEach(async function () {
        accounts = await ethers.getSigners();

        const nftTokenFactory = (await ethers.getContractFactory("DIDManager", accounts[0])) as DIDManager__factory;

        didManager = await nftTokenFactory.deploy(initialFee);
    });

    describe("DIDMethodCreationFee", function () {
        it("Should Test if Equal to Initial Fee", async function () {
            const fee = await didManager.DIDMethodCreationFee();

            expect(fee).to.equal(initialFee);
        });

        it("Should Test if Changes Fee", async function () {
            const fee = ethers.utils.parseUnits("123", "gwei");
            expect(didManager.changeDIDMethodCreationFee(fee)).to.eventually.be.fulfilled;

            const feeAfter = await didManager.DIDMethodCreationFee();
            expect(feeAfter).to.equal(fee);
        });

        it("Should Test if OnlyOwner Can Change", async function () {
            expect(didManager.connect(accounts[1]).changeDIDMethodCreationFee(123)).to.eventually.be.rejectedWith(
                "Ownable: caller is not the owner",
            );
        });
    });

    describe("createDIDMethod", function () {
        it("Should Test if Equal to Initial Fee", async function () {
            expect(didManager.createDIDMethod("zanM", 123, {
                value: initialFee,
            })).to.eventually.be.fulfilled;
        });

        it("Should Reject if Fee to low", async function () {
            expect(didManager.createDIDMethod("zanM", 123, {
                value: initialFee.sub(1),
            })).to.eventually.be.rejectedWith("DID Method Creation fee to low");
        });

        it("Should Reject if DID method already exists", async function () {
            await didManager.createDIDMethod("zanM", 123, {
                value: initialFee,
            })

            expect(didManager.createDIDMethod("zanM", 123, {
                value: initialFee,
            })).to.eventually.be.rejectedWith("DID already exits");
        });

        it("Should Reject if DID name to large", async function () {
            expect(didManager.createDIDMethod("z".repeat(11), 123, {
                value: initialFee,
            })).to.eventually.be.rejectedWith("DID Name to large");
        });

        it("Should Reject if DID name is empty", async function () {
            expect(didManager.createDIDMethod("", 123, {
                value: initialFee,
            })).to.eventually.be.rejectedWith("DID Name should not be empty");
        });

        it("Should Reject if Contract is paused", async function () {
            await didManager.pause();

            expect(didManager.createDIDMethod("zanM", 123, {
                value: initialFee,
            })).to.eventually.be.rejectedWith();
        });
    });

    describe("createDID", function () {
        beforeEach(async () => {
			await didManager.createDIDMethod("zanM", 100, {
				value: initialFee,
			});
        });

        it("Should Create DID and add right amount of fee", async function () {
			await didManager.createDID("zanM",  {
				value: 100,
			});
			const method = await didManager.getDIDMethod("zanM");

			expect(method.fee.toNumber()).to.be.equal(100);
        });

        it("Should Reject if address already has DID in this method", async function () {
            await didManager.createDID("zanM",  {
                value: 100,
            });

            expect(didManager.createDID("zanM",  {
                value: 100,
            })).to.be.eventually.rejectedWith("This address already has DID in this method");
        });

        it("Should Reject if fee is to low", async function () {
            expect(didManager.createDID("zanM",  {
                value: 99,
            })).to.be.eventually.rejectedWith("DID Fee to low");
        });

        it("Should Reject if DID method doesn't exists", async function () {
            expect(didManager.createDID("zanM2",  {
                value: 100,
            })).to.be.eventually.rejectedWith("DID doesn't exits");
        });

        it("Should Reject if contract is on pause", async function () {
            await didManager.pause();

            expect(didManager.createDID("zanM2",  {
                value: 100,
            })).to.be.eventually.rejectedWith();
        });
    });

    describe("addKey", function () {
        beforeEach(async () => {
            await didManager.createDIDMethod("zanM", 100, {
                value: initialFee,
            });

            await didManager.createDID("zanM",  {
                value: 100,
            });
        });

        it("Should Test if Equal to Initial Fee", async function () {
            const pass = generateMnemonic();

            // @ts-ignore
            await didManager.addKey("zanM", generateKeyPair(pass).publicKeyArray, 0);
        });
    });
});
