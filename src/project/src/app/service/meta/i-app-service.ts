import { IAppService, TModal, TOpenPromise } from 'cubes-ui'
import { TModalMap, TProxyResult } from '../../../control'

import { ICountryInfo } from '@/app/domain/meta/i-country-info'
import { IHistoricalPIWithRanks } from '@/app/domain/meta/i-historical-pI-with-ranks'
import { IIndexSearchArgs } from './api-args'
import { TDashboardApplication } from '../../domain/meta/i-application'

export type TNoNext<T> = Omit<T, 'next'>

export type TModalManagerAction<T extends keyof TModalMap> = Promise<TNoNext<TOpenPromise<TModal<TModalMap, T>>>>
interface IDashboardAppService extends IAppService {
  application: TDashboardApplication
  listAsync(
    query: IIndexSearchArgs,
    isFiltered: boolean,
    onBeforeRequestAsync?: (...args: any[]) => Promise<any>,
    onBeforeResolveAsync?: (...args: any[]) => Promise<any>
  ): TProxyResult<IHistoricalPIWithRanks>

  getKpiAsync(id: string): TProxyResult<IHistoricalPIWithRanks>
  getPiAsync(piId: string, objectId: string): Promise<{ currentPi?: IHistoricalPIWithRanks; ownerPi?: IHistoricalPIWithRanks }>
  prepareCountriesData(pi: IHistoricalPIWithRanks, emiratesPis?: IHistoricalPIWithRanks[]): { global: ICountryInfo[]; uaeStates: ICountryInfo[] }
  openKpiCardModal(pi: IHistoricalPIWithRanks): any
  openContributingPercentageCardModal(pi: IHistoricalPIWithRanks, measure: IHistoricalPIWithRanks, iso_a2: string): any
  // resolveAppAssetResourceAsync(path:string):Promise<any>
}
export enum DashboardEvent {
  loadStart = 'dashboardAppService@loadStart',
  loadEnd = 'dashboardAppService@loadEnd',
  select = 'dashboardAppService@select',
  reset = 'dashboardAppService@reset',
  openKpiCard = 'dashboardAppService@openKpiCard',
  openContributingPercentageCard = 'dashboardAppService@openContributingPercentageCard',
  hideTooltip = 'dashboardAppService@hideTooltip',
  goToCountry = 'dashboardAppService@goToCountry'
}
export type { IDashboardAppService }
