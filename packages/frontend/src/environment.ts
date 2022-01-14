let devEnv = {}
if (process.env.NODE_ENV === 'development') {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  try { devEnv = require('./environment.dev.ts').default } catch(e) { /**/ }
}

export default {
  ETHERS_DEFAULT_PROVIDER: process.env.REACT_APP_ETHERS_DEFAULT_PROVIDER
      || 'https://rinkeby.infura.io/v3/84842078b09946638c03157f83405213',
  CHAIN_ID: process.env.REACT_APP_CHAIN_ID || '4',
  ...devEnv
}
