import * as path from 'path'

export default {
  webpack: {
    alias: {
      '@app': path.resolve(__dirname, './src'),
      '@contracts': path.resolve(__dirname, './src/libraries/generated/artifacts/contracts'),
      '@contracts/types': path.resolve(__dirname, './src/libraries/generated/typechain-types/index.ts')
    }
  }
}
