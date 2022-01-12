import { task } from "hardhat/config";
import "@nomiclabs/hardhat-ethers";
import { Multicall__factory } from "../../typechain-types";

task("deploy-multicall", "Deploy Multicall contract")
    .setAction(async (taskArgs, { run, ethers}) => {
        await run("compile");

        console.log("Deploying Multicall contract!");
        const contractFactory = await ethers.getContractFactory("Multicall") as Multicall__factory;
        const contract = await contractFactory.deploy();
        await contract.deployed();

        console.log("Multicall Contract Address: ", contract.address);
        console.log("Multicall Contract Transaction: ", contract.deployTransaction.hash);
    });

