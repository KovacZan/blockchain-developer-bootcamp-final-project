import {
	Box,
	Button,
	Center,
	Divider,
	Heading,
	NumberDecrementStepper,
	NumberIncrementStepper,
	NumberInput,
	NumberInputField,
	NumberInputStepper,
	Text,
} from "@chakra-ui/react";
import { Link } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import { ChainId, useEthers, useSendTransaction } from "@usedapp/core";
import { ethers, providers, utils } from "ethers";
import React, { useReducer } from "react";
import { NftyPass as LOCAL_CONTRACT_ADDRESS } from "hardhat/scripts/contractAddress";
import { Layout } from "../components/layout/Layout";

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider("http://localhost:8545");

const RINKEBY_CONTRACT_ADDRESS = "0x8Ba5cE975a075Be7c170F6BA3f937Ed6E1dA0Ed2";

/**
 * Prop Types
 */
type StateType = {
	txHashValue: string;
	isLoading: boolean;
};

type ActionType =
	| {
			type: "SET_TX_HASH_VALUE";
			txHashValue: StateType["txHashValue"];
	  }
	| {
			type: "SET_LOADING";
			isLoading: StateType["isLoading"];
	  };

/**
 * Component
 */
const initialState: StateType = {
	txHashValue: "-",
	isLoading: false,
};

function reducer(state: StateType, action: ActionType): StateType {
	switch (action.type) {
		case "SET_TX_HASH_VALUE":
			return {
				...state,
				txHashValue: action.txHashValue,
			};
		case "SET_LOADING":
			return {
				...state,
				isLoading: action.isLoading,
			};
		default:
			throw new Error();
	}
}

function HomeIndex(): JSX.Element {
	const [state, dispatch] = useReducer(reducer, initialState);
	const { account, chainId, library } = useEthers();

	const isLocalChain = chainId === ChainId.Localhost || chainId === ChainId.Hardhat;

	const CONTRACT_ADDRESS = chainId === ChainId.Rinkeby ? RINKEBY_CONTRACT_ADDRESS : LOCAL_CONTRACT_ADDRESS;

	return (
		<Layout>
			<Box w={"80vh"} background={"grey"}>
				<Center>
					<Heading as="h1" mb="8">
						DID Manager
					</Heading>
					<Box>
						<Text>TODO</Text>
					</Box>
				</Center>
			</Box>
		</Layout>
	);
}

export default HomeIndex;
