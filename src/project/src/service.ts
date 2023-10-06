//@ts-nocheck
const services = require.context(
  // Look for files in the current directory
  '.',
  //  look in subdirectories
  true,
  // Only include .ts files
  /\.(service|repo)\.ts$/
)

import { serviceMap as cubesServiceMap } from 'cubes-app'

const serviceMap = {
  ...cubesServiceMap,
  HistoricalPIService: { key: 'HistoricalPIService', config: {} },
  MetadataService: { key: 'MetadataService', config: {} },
}
const repositoryMap = {
  HistoricalPiRepository: { key: 'HistoricalPiRepository', config: {} },
  MetadataRepository: { key: 'MetadataRepository', config: {} }
}
type TMOEICustomServiceMap = typeof serviceMap
export { services, serviceMap, repositoryMap }
export type { TMOEICustomServiceMap }
