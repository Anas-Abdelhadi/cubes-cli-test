//@ts-nocheck

import { Ti18n as TCubesAppI18n, i18nMap as cubesAppI18nMap } from 'cubes-app'
import { Ti18n as TCubesUII18n, i18nMap as cubesUiI18nMap } from 'cubes-ui'

const i18nFiles = require.context('.', true, /\.i18n.ts$/)
export { i18nFiles }

const i18nMapApp = {
}

export const i18nMap = {
  ...cubesUiI18nMap,
  ...cubesAppI18nMap,
  ...i18nMapApp
}

export type Ti18n = typeof i18nMapApp & TCubesAppI18n & TCubesUII18n
