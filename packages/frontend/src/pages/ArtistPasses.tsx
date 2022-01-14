import React, { useEffect, useState } from 'react'
import { Alert, AlertIcon, Box, Center, VStack } from '@chakra-ui/react'
import { useEthers } from '@usedapp/core'
import { ethers } from 'ethers'
import { contractAddress } from '@app/libraries/connectors'
import ArtistPass from '@contracts/ArtistPass.sol/ArtistPass.json'
import { ArtistPass as ArtistPassContract } from 'contracts/typechain-types'

export const ArtistPasses = () => {
  const { active, error, library, account } = useEthers()
  const [ passes, setPasses ] = useState<{id: number, uri: string}[]>([])

  const getAllPasses = async () => {
    console.log('aa')
    if (library){
      try {
        const passContract = new ethers.Contract(
          contractAddress,
          ArtistPass.abi,
          library,
        ) as ArtistPassContract
        if (account) {
          const stateTokens = []
          const tokens = await passContract.connect(library.getSigner()).tokensOfOwner(account)
          for (const token of tokens) {
            const uri = await passContract.connect(library.getSigner()).tokenURI(token)
            stateTokens.push({ id: token.toNumber(), uri: uri })
          }
          setPasses(stateTokens)
        }

      } catch (err) {
        console.log('Error: ', err)
      }
    }
  }

  useEffect( () => {
    void getAllPasses()
  }, [ library ])

  return (
    <Center>
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
        <VStack
          spacing={4}
          align="stretch"
        >
          {passes.map(pass =>
            <Box alignContent={'center'} p={4} key={pass.id}>
              <h1>Token with ID: {pass.id}</h1>
              <img src={pass.uri} />
            </Box>
          )}
        </VStack>
      )}
    </Center>
  )
}
