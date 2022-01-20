import React, { useEffect, useState } from 'react'
import { useEthers } from '@usedapp/core'
import { Alert, AlertIcon, Button, Center } from '@chakra-ui/react'
import { ethers } from 'ethers'
import { contractAddress, network, provider } from '@app/libraries/connectors'
import ArtistPass from '@contracts/ArtistPass.sol/ArtistPass.json'
import { ArtistPass as ArtistPassContract } from 'contracts/typechain-types'
import { formatEther } from '@ethersproject/units'
import { Spinner } from '@chakra-ui/react'

export const Home = () => {
  const { active, error, library } = useEthers()
  const [ price, setPrice ] = useState('')
  const [ isLoading, setIsLoading ] = useState(false)
  const [ transaction, setTransaction ] = useState('')
  const [ status, setStatus ] = useState('')

  const getPrice = async () => {
    try {
      const passContract = new ethers.Contract(
        contractAddress,
        ArtistPass.abi,
        provider,
      ) as ArtistPassContract

      const p = await passContract.price()
      setPrice(parseFloat(formatEther(p)).toFixed(2))
    } catch (err) {
      console.log('Error: ', err)
    }
  }

  const buyPass = async () => {
    if (library){
      try {
        const passContract = new ethers.Contract(
          contractAddress,
          ArtistPass.abi,
          library,
        ) as ArtistPassContract
        setIsLoading(true)
        const p = await passContract.price()
        const trx = await passContract.connect(library.getSigner()).mint({ value: p })
        setTransaction(network.getExplorerTransactionLink(trx.hash))
        setIsLoading(false)
        setStatus('Wait for 2 block confirmation')
        try {
          await trx.wait(2)
          setStatus('Transaction has been confirmed')
        } catch {
          setStatus('Something went wrong with transaction')
        }


      } catch (err) {
        console.log('Error: ', err)
        setIsLoading(false)
        setStatus('Something went wrong with transaction')
      }
    }
  }

  useEffect(() => {
    void getPrice()
  }, [ ])

  return (
    <>
      <Center mt={10}>
        <div>
          {!active && !error &&
          <Alert status="warning">
            <AlertIcon />
              Please connect to your wallet!
          </Alert>}
          {error &&
          <Alert status="error">
            <AlertIcon />
            {error.message}
          </Alert>
          }
          {active && !error && (
            <Button
              mb={10}
              display={{ base: 'none', md: 'inline-flex' }}
              fontSize={'sm'}
              fontWeight={600}
              color={'white'}
              bg={'blue.400'}
              _hover={{
                bg: 'blue.300',
              }}
              onClick={buyPass}
            >
                  Buy ArtistPass for {price} ETH
            </Button>
          )
          }
        </div>
      </Center>
      <Center mt={10}>
        <div>
          {isLoading && <Spinner />}
          <a target="_blank" rel="noopener noreferrer" href={transaction}>{transaction}</a>
        </div>
        <br/>
        <p>{status}</p>
      </Center>
    </>
  )
}
