import { AppServiceBase, IAppService, IModalManager, TResult } from 'cubes-ui'
import { CubesEvent, Inject, Service, Singleton } from 'cubes'
import { DashboardEvent, IDashboardAppService } from '../meta/i-app-service'
import { IoCLevelsEnum, TModalMap } from '../../../control'
import { data, getCountryByIso, getFlagForIso } from '@/app/presentation/components/map/def'

import { DashboardApplication } from '../../domain/def/application'
import type { ICountryInfo } from '@/app/domain/meta/i-country-info'
import type { IHistoricalPIWithRanks } from '@/app/domain/meta/i-historical-pI-with-ranks'
import type { IHistoricalPiService } from '../meta/i-historical-pi-service'
import type { IIndexSearchArgs } from '../meta/api-args'
import type { IMetadataValueItem } from '@/app/domain/meta/i-metadata-value-item'
import type { TDashboardApplication } from '../../domain/meta/i-application'
import { countriesConfig } from '@/app/domain/def/country-config'
import { filterConfig } from '@/app/domain/def/filter-config'
import { nextTick } from 'vue'
import { serviceMap } from '../../../service'

@Service(IoCLevelsEnum.PROD_1, serviceMap.AppService.key)
@Singleton
class DashboardAppService extends AppServiceBase implements IDashboardAppService {
  public readonly id: string = serviceMap.AppService.key
  application!: TDashboardApplication
  @Inject() AppService!: IAppService
  @Inject() HistoricalPIService!: IHistoricalPiService
  @Inject() ModalManager!: IModalManager<TModalMap>
  protected createApp(config: Partial<TDashboardApplication>, state?: TDashboardApplication['state']) {
    this.application = new DashboardApplication({ config, state } as Partial<TDashboardApplication>)
  }

  listAsync(
    query: IIndexSearchArgs,
    isFiltered: boolean,
    onBeforeRequestAsync?: (...args: any[]) => Promise<any>,
    onBeforeResolveAsync?: (...args: any[]) => Promise<any>
  ): Promise<TResult<IHistoricalPIWithRanks>> {
    return new Promise<TResult<IHistoricalPIWithRanks>>(async (r, x) => {
      try {
        await onBeforeRequestAsync?.(r, x)
        const result = isFiltered
          ? await this.HistoricalPIService.searchAsync({ limit: query.limit, offset: query.offset, ...(query.indexId && { indexId: query.indexId }) }, [
              ...(query.indexId ? [] : [{ metaDataID: filterConfig.index.id, metaDataValueID: filterConfig.index.valueId }]),
              ...(query.pillar ? [query.pillar] : []),
              ...(query.kpi ? [query.kpi] : [])
            ] as any)
          : await this.HistoricalPIService.listAsync({ limit: query.limit, offset: query.offset }, [{ metaDataID: filterConfig.index.id, metaDataValueID: filterConfig.index.valueId.toString() }])
        await onBeforeResolveAsync?.(r, x)
        r(result)
      } catch (error) {
        x(error)
      }
    })
  }

  getKpiAsync(id: string) {
    return new Promise<TResult<IHistoricalPIWithRanks>>(async (r, x) => {
      try {
        r(await this.HistoricalPIService.getAsync(id))
      } catch (error) {
        x(error)
      }
    })
  }

  getPiAsync(piId: string, objectId: string) {
    return new Promise<{ currentPi?: IHistoricalPIWithRanks; ownerPi?: IHistoricalPIWithRanks }>(async (r, x) => {
      try {
        if (!piId) {
          r({ currentPi: undefined, ownerPi: undefined })
          return
        }
        // if I have a queryString in the url then I am viewing a child, else I am drilling down from a parent..
        const parentRequest = [() => this.getKpiAsync(piId)]
        objectId && parentRequest.push(() => this.getKpiAsync(objectId))
        const result = await Promise.all(parentRequest.map(x => x()))
        const ownerPi = (result[0] as TResult<IHistoricalPIWithRanks>).data as IHistoricalPIWithRanks
        const currentPi = (result[objectId ? 1 : 0] as TResult<IHistoricalPIWithRanks>).data as IHistoricalPIWithRanks
        r({ currentPi, ownerPi })
      } catch (error) {
        x(error)
      }
    })
  }
  /**
   *  three levels of interaction
   *  1- index level  -> if zooming on map no loading of emirates..
   *  2- every index has linked objects.. if a linked object is selected zoom will take to emirates level
   *  3- if emirates has no data make is disabled
   *  4- when zooming load the pi connected to the kpi, to expand it,
   *  5- you can filter on pi.type 29 == measure to filter emirates..
   *  6- from each one find the emiraates (metadata 12 ) based on their ISO to tell which has info..
   */

  prepareCountriesData(pi: IHistoricalPIWithRanks, emiratesPis: IHistoricalPIWithRanks[] = []): { global: ICountryInfo[]; uaeStates: ICountryInfo[] } {
    const record = pi?.history?.last
    if (!record?.metadata.length) return { global: [], uaeStates: [] }
    const countries: ICountryInfo[] = []
    countriesConfig.ranks.forEach((c, i) => {
      const country = record.metadata.find(m => m.id == c.id)?.values
      if (!country || !country.first?.name) {
        // if the metadata is empty one of two possibilities, either this rank is for UAE, or this is a missing rank
        countries.push({
          pi,
          id: c.id,
          rank: i + 1,
          country: { ISO: 'X', name: { en: 'Country Not Found', ar: 'الدولة غير معرفة' }, flag: 'undefined' },
          value: '-'
        })
      } else {
        const { title: name, iso_a2 } = getCountryByIso(country[0].name!)
        const value = record.metadata.find(m => m.id == c.valueId)?.values
        countries.push({
          pi,
          id: c.id,
          rank: i + 1,
          country: { ISO: iso_a2, name, flag: getFlagForIso(iso_a2) },
          value: value && value[0]?.name ? value[0].name : '-'
        })
      }
    })
    const config = window['configure']().dashboard
    const uaeRank = +record.metadata.find(m => m.id == countriesConfig.uae)?.values[0]?.name!
    const { title: uaeName, iso_a2: uaeIso } = getCountryByIso('AE')
    const uae = {
      pi,
      id: config?.countries?.uae || -1,
      rank: uaeRank,
      country: { ISO: uaeIso, name: uaeName, flag: getFlagForIso(uaeIso) },
      value: record.value ? record.value.toString() : '-'
    } as ICountryInfo

    // prepare uaeEmirates..
    // if we have emiratesPis then we need to check for the emirates that are inside..
    let found = [] as { emirate?: IMetadataValueItem; measureInfo: IHistoricalPIWithRanks }[]
    if (emiratesPis.length) {
      // at this stage get the measures
      emiratesPis.forEach(x => {
        const metas = [] as IMetadataValueItem[]
        // get metadata that represents emirates ..
        const emiratesMeta = x.metadata.filter(y => y.id == config?.countries?.emirates || 12)
        // values
        metas.push(...emiratesMeta.reduce((p, c) => [...p, ...c.values], [] as IMetadataValueItem[]))
        found.push({ emirate: metas.first, measureInfo: x })
      })
    }

    const uaeSubs = data.uaeStates.map((x: any, i: number) => {
      const state = getCountryByIso(x.properties.iso_a2, data.uaeStatesData)
      const flag = getFlagForIso(uaeIso)
      const emirate = found.find(y => y.emirate?.name == x.properties.iso_a2)
      return {
        pi: emirate ? pi : undefined,
        measure: emirate,
        id: i,
        rank: uaeRank,
        value: emirate?.measureInfo?.history.last?.value,
        country: { ISO: state.iso_a2, name: state.name, flag }
      }
    })

    if (uaeRank > countries.length) countries.push(uae)
    else countries[uaeRank - 1] = uae
    return { global: countries, uaeStates: uaeSubs }
  }

  async openKpiCardModal(pi: IHistoricalPIWithRanks) {
    this.dispatchEvent(new CubesEvent(DashboardEvent.hideTooltip))
    await nextTick()
    this.dispatchEvent(new CubesEvent(DashboardEvent.openKpiCard, pi))
  }

  async openContributingPercentageCardModal(pi: IHistoricalPIWithRanks, measure: IHistoricalPIWithRanks, iso_a2: string) {
    this.dispatchEvent(new CubesEvent(DashboardEvent.hideTooltip))
    await nextTick()
    this.dispatchEvent(new CubesEvent(DashboardEvent.openContributingPercentageCard, { pi, measure, iso_a2 }))
  }

  // async resolveAppAssetResourceAsync(path:string):Promise<any> {

  //   let p
  //   // if (process.env.NODE_ENV === 'development')
  //   // p =   `../../../../public/${path}`
  //   // else
  //   p = `${this.AppManager.store[this.application.name] ? this.AppManager.store[this.application.name]['publicPath'] : __runtime_public_path__[this.application.name]}${path}`
  //   console.log(p)
  //   const result =  await import(`${p}`)
  //   return result.default??result
  // }
}

export default DashboardAppService
