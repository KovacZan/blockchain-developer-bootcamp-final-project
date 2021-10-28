import chai from "chai";
import chaiAsPromised from "chai-as-promised";
import { chaiEthers } from "chai-ethers";
import { Signer } from "ethers";
import { ethers, web3 } from "hardhat";

chai.use(chaiEthers);
chai.use(chaiAsPromised);
const { expect, assert } = chai;

describe("DIDManager", function () {});
