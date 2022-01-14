import React from 'react'
import ReactDOM from 'react-dom'
import App from './pages/index'
import './assets/main.css'
import { ChakraProvider } from '@chakra-ui/react'
import { dAppConfig } from '@app/libraries/connectors'
import { DAppProvider } from '@usedapp/core'


ReactDOM.render(
  <React.StrictMode>
    <DAppProvider config={dAppConfig}>
      <ChakraProvider>
        <App/>
      </ChakraProvider>
    </DAppProvider>
  </React.StrictMode>
  ,
  document.getElementById('root')
)


