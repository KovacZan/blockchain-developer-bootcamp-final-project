import { Box, Button, Container, Heading, Icon, Stack, Text, useColorModeValue } from "@chakra-ui/react";
import React from "react";
import { Layout } from "../components/layout/Layout";

function HomeIndex(): JSX.Element {
    return (
        <Layout>
            <Box maxWidth="container.xm" p="8" background={"telegram.100"} mt={10}>
                <Stack
                    as={Box}
                    textAlign={'center'}
                    spacing={{base: 8, md: 14}}
                    py={{base: 10, md: 40}}>
                    <Heading
                        fontWeight={600}
                        fontSize={{base: '2xl', sm: '4xl', md: '6xl'}}
                        lineHeight={'110%'}>
                        DID Manager
                    </Heading>
                    <Text color={'gray.500'}>
                        Decentralized identifiers (DIDs) are a new type of identifier that enables verifiable,
                        decentralized digital identity.
                    </Text>
                    <Stack
                        direction={'column'}
                        spacing={3}
                        align={'center'}
                        alignSelf={'center'}
                        position={'relative'}>
                        <Button
                            colorScheme={'green'}
                            bg={'green.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: 'green.500',
                            }}>
                            Create DID Method
                        </Button>
                        <Button
                            colorScheme={'blue'}
                            bg={'blue.400'}
                            rounded={'full'}
                            px={6}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Create DID
                        </Button>
                    </Stack>
                </Stack>
            </Box>
        </Layout>
    );
}

export default HomeIndex;
