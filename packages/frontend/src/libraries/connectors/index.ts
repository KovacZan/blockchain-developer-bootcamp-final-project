import { ethers } from 'ethers'
import { Chain, Config, Kovan, Mainnet, Rinkeby, Ropsten } from '@usedapp/core'
import { artistPassContract } from '@app/libraries/generated/contractAddresses'
import env from '@app/environment'

export const provider = ethers.providers.getDefaultProvider(env.ETHERS_DEFAULT_PROVIDER)

export const contractAddress = artistPassContract

export const network: Chain = (() => {
  switch (env.CHAIN_ID) {
    case '1': return Mainnet
    case '3': return Ropsten
    case '4': return Rinkeby
    case '42': return Kovan
    default: return Rinkeby
  }
})()

export const dAppConfig: Config = {
  networks: [ network ]
}

