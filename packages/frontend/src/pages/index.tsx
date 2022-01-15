import React from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  Popover,
  PopoverTrigger,
  useColorModeValue,
} from '@chakra-ui/react'
import { Home } from '@app/pages/Home'
import { Gallery } from '@app/pages/Gallery'
import { Auctions } from '@app/pages/Auctions'
import { useEthers, useEtherBalance } from '@usedapp/core'
import { network } from '@app/libraries/connectors'
import { formatEther } from '@ethersproject/units'
import { ArtistPasses } from '@app/pages/ArtistPasses'

export default function App() {
  const { activateBrowserWallet, active, deactivate, account } = useEthers()
  const balance = useEtherBalance(account)

  const connect = async () => {
    await activateBrowserWallet()
  }
  const disconnect = async () => {
    await deactivate()
  }

  return (
    <>
      <Box>
        <Flex
          bg={useColorModeValue('white', 'gray.800')}
          color={useColorModeValue('gray.600', 'white')}
          minH={'60px'}
          py={{ base: 2 }}
          px={{ base: 4 }}
          borderBottom={1}
          borderStyle={'solid'}
          borderColor={useColorModeValue('gray.200', 'gray.900')}
          align={'center'}>
          <Flex flex={{ base: 1 }} justify={{ base: 'center', md: 'start' }}>
            <Flex display={{ base: 'none', md: 'flex' }} ml={10}>
              <Stack direction={'row'} spacing={4}>
                <Box key="home">
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={'/'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={useColorModeValue('gray.600', 'gray.200')}
                        _hover={{
                          textDecoration: 'none',
                          color: useColorModeValue('gray.800', 'white'),
                        }}>
                                                Home
                      </Link>
                    </PopoverTrigger>
                  </Popover>
                </Box>
                <Box key="ArtistPasses">
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={'passes'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={useColorModeValue('gray.600', 'gray.200')}
                        _hover={{
                          textDecoration: 'none',
                          color: useColorModeValue('gray.800', 'white'),
                        }}>
                        Artist Passes
                      </Link>
                    </PopoverTrigger>
                  </Popover>
                </Box>
                <Box key="Gallery">
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={'gallery'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={useColorModeValue('gray.600', 'gray.200')}
                        _hover={{
                          textDecoration: 'none',
                          color: useColorModeValue('gray.800', 'white'),
                        }}>
                                                Gallery
                      </Link>
                    </PopoverTrigger>
                  </Popover>
                </Box>
                <Box key="Auctions">
                  <Popover trigger={'hover'} placement={'bottom-start'}>
                    <PopoverTrigger>
                      <Link
                        p={2}
                        href={'auctions'}
                        fontSize={'sm'}
                        fontWeight={500}
                        color={useColorModeValue('gray.600', 'gray.200')}
                        _hover={{
                          textDecoration: 'none',
                          color: useColorModeValue('gray.800', 'white'),
                        }}>
                                                Auctions
                      </Link>
                    </PopoverTrigger>
                  </Popover>
                </Box>
              </Stack>
            </Flex>
          </Flex>
          <Stack
            mr={4}
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            <Text>
              {account &&
              <a target="_blank" rel="noopener noreferrer" href={network.getExplorerAddressLink(account)}>{account}</a>}
            </Text>
          </Stack>
          <Stack
            mr={2}
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>

            <Text>
              {balance && (<>{parseFloat(formatEther(balance)).toFixed(5)}ETH</>)}
            </Text>

          </Stack>
          <Stack
            flex={{ base: 1, md: 0 }}
            justify={'flex-end'}
            direction={'row'}
            spacing={6}>
            {active ?
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'red.400'}
                href={'#'}
                _hover={{
                  bg: 'red.300',
                }}
                onClick={() => disconnect()}
              >
              Disconnect
              </Button>
              :
              <Button
                display={{ base: 'none', md: 'inline-flex' }}
                fontSize={'sm'}
                fontWeight={600}
                color={'white'}
                bg={'blue.400'}
                _hover={{
                  bg: 'blue.300',
                }}
                onClick={() => connect()}
              >
                  Connect Wallet
              </Button>
            }

          </Stack>
        </Flex>
      </Box>
      <BrowserRouter>
        <Routes>
          <Route index element={<Home/>} />
          <Route path="passes" element={<ArtistPasses/>} />
          <Route path="gallery" element={<Gallery/>} />
          <Route path="auctions" element={<Auctions/>} />
        </Routes>
      </BrowserRouter>
    </>
  )
}
