import { Box, Heading, Text } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/layout/Layout";

function HomeIndex(): JSX.Element {
	return (
		<Layout>
			<Heading as="h1" mb="8">
				DID Creation
			</Heading>
			<Box>
				<Text>TODO</Text>
			</Box>
		</Layout>
	);
}

export default HomeIndex;
