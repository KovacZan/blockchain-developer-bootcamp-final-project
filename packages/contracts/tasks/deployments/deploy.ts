import "@nomiclabs/hardhat-web3";
import { task } from "hardhat/config";
import { Contract } from "ethers";
import fs from "fs-extra";
import "@nomiclabs/hardhat-ethers";

task("deploy", "Deploy the contract")
    .addFlag("save", "Save the address to the shared file")
    .setAction(async (taskArgs, {config, run, ethers}) => {
        await run("compile");

        console.log("Deploying contract!");
        const contractFactory = await ethers.getContractFactory("ArtistPass");
        const contract = await contractFactory.deploy();
        await contract.deployed();

        console.log("Contract Address: ", contract.address);
        console.log("Contract Transaction: ", contract.deployTransaction.hash);

        if (taskArgs.save) {
            fs.removeSync(`${config.paths.root}/../frontend/src/libraries/generated/contractAddress.ts`);
            console.log("Saving addresses to shared files!");
            saveFrontendFiles(config.paths.root, contract, "contract");
        }
    });


function saveFrontendFiles(path: string, contract: Contract, contractName: string) {
    fs.appendFileSync(
        `${path}/../frontend/src/libraries/generated/contractAddress.ts`,
        `export const ${contractName} = '${contract.address}'\n`,
    );
}
