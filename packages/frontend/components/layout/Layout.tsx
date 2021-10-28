import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Container,
	Flex,
	Image,
	Link,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	SimpleGrid,
	Text,
	chakra,
} from "@chakra-ui/react";
import { useEthers, useNotifications } from "@usedapp/core";
import blockies from "blockies-ts";
import NextLink from "next/link";
import React from "react";
import { getErrorMessage } from "../../lib/utils";
import { Balance } from "../Balance";
import { ConnectWallet } from "../ConnectWallet";
import { Head, MetaProps } from "./Head";
import WithSubnavigation from "../navigation/Navigation";

// Extends `window` to add `ethereum`.
declare global {
	interface Window {
		ethereum: any;
	}
}

/**
 * Constants & Helpers
 */

// Title text for the various transaction notifications.
const TRANSACTION_TITLES = {
	transactionStarted: "Local Transaction Started",
	transactionSucceed: "Local Transaction Completed",
};

// Takes a long hash string and truncates it.
function truncateHash(hash: string, length = 38): string {
	return hash.replace(hash.substring(6, length), "...");
}

/**
 * Prop Types
 */
interface LayoutProps {
	children: React.ReactNode;
	customMeta?: MetaProps;
}

/**
 * Component
 */

export const Layout = ({ children, customMeta }: LayoutProps): JSX.Element => {
	const { account, deactivate, error } = useEthers();
	const { notifications } = useNotifications();

	let blockieImageSrc;
	if (typeof window !== "undefined") {
		blockieImageSrc = blockies.create({ seed: account }).toDataURL();
	}

	return (
		<Box h={"100vh"} bgGradient="linear(to-b, #0093E9, #80D0C7)" paddingTop={8}>
			<Head customMeta={customMeta} />
			<header>
				<WithSubnavigation />
			</header>
			<main>
				<Container maxWidth="container.xl">
					{error && (
						<Alert status="error" mb="8">
							<AlertIcon />
							<AlertTitle mr={2}>Error:</AlertTitle>
							<AlertDescription>{getErrorMessage(error)}</AlertDescription>
						</Alert>
					)}
					{children}
					{notifications.map((notification) => {
						if (notification.type === "walletConnected") {
							return null;
						}
						return (
							<Alert
								key={notification.id}
								status="success"
								position="fixed"
								bottom="8"
								right="8"
								width="400px"
							>
								<AlertIcon />
								<Box>
									<AlertTitle>{TRANSACTION_TITLES[notification.type]}</AlertTitle>
									<AlertDescription overflow="hidden">
										Transaction Hash: {truncateHash(notification.transaction.hash, 61)}
									</AlertDescription>
								</Box>
							</Alert>
						);
					})}
				</Container>
			</main>
			<footer>
				<Container mt="8" py="8" maxWidth="container.xl">
					<Text>Footer</Text>
				</Container>
			</footer>
		</Box>
	);
};
