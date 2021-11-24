import secp256k1 from "secp256k1";
import { ethers } from "hardhat";
// @ts-ignore
import { sync } from "simple-sha256";

export const generateKeyPair: (passphrase: string) => { privateKey: string; publicKey: string; publicKeyArray: number[] } = (passphrase: string) => {
    const privateKey: Buffer = Buffer.from(sync(passphrase), "hex");
    const publicKey = Buffer.from(secp256k1.publicKeyCreate(privateKey)).toString("hex");
    const publicKeyArray = Array.from(ethers.utils.toUtf8Bytes(publicKey));

    return {
        privateKey: privateKey.toString("hex"),
        publicKey,
        publicKeyArray
    }
}
