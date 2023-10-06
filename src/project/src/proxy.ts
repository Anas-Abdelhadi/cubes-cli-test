import { clientMaps as cubesAppClientMaps } from 'cubes-app'
import { clientMaps as cubesUiClientMaps } from 'cubes-ui'
import { historicalPI } from './app/repository/proxy/historical-pi.proxy'
import { metadata } from './app/repository/proxy/metadata.proxy'
const clientMaps = {
  ...cubesUiClientMaps,
  ...cubesAppClientMaps,
  historicalPI,
  metadata
}
export { clientMaps }
export type TClients = typeof clientMaps
