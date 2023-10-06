<template>
  <v-app-container :is-busy="isBusy || loading" :is-ready="isReady && !loading">
    <app-main-layout v-if="isReady && !loading" hide-side-button :aside-custom-classes="{ 'app-aside-full-expand': router.currentRoute.value.matched[0].name === 'profile' }">
      <template #header>
        <app-header no-side-menu has-search>
          <template #accessories>
            <v-animated
              key="header"
              is="h2"
              :initial="{ opacity: 0, y: -80 }"
              :animate="{ y: router.currentRoute.value.matched[0].name === 'profile' ? -80 : 0, opacity: router.currentRoute.value.matched[0].name === 'profile' ? 0 : 1 }"
              :transition="{ opacity: { easing: 'linear', duration: 0.6 }, easing: spring(), delay: router.currentRoute.value.matched[0].name === 'profile' ? 0.3 : 0.7, duration: 0.8 }"
              class="text-primary m-3 mx-5"
            >
              {{ tGlobal.value.globalMap }}
            </v-animated>
          </template>
          <template #nav-account>
            <app-header-user-menu class="text-primary" />
          </template>
        </app-header>
      </template>
      <template #aside>
        <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" appear>
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </template>
      <transition name="fade" mode="out-in">
        <app-page-content hide-breadcrumb>
          <map-control />
        </app-page-content>
      </transition>
    </app-main-layout>
    <kpi-card v-model="modals.kpiCard" :kpi="modalPi.kpiCard" @update:model-value="e => !e && (modalPi.kpiCard = undefined)" />
    <contributing-card
      v-model="modals.contributingPercentageCard"
      :kpi="modalPi.contributingCard"
      :measure="modalPi.measure"
      :state-iso="stateIso_a2"
      @update:model-value="e => !e && (modalPi.contributingCard = undefined)"
    />
  </v-app-container>
</template>

<script lang="ts" setup>
import { Ref, toRef, defineAsyncComponent, ref, onMounted } from 'vue'
import { AppServiceEvent, cubesAppControlProps as props, useTranslation } from 'cubes-ui'
import { useAppContainer } from 'cubes-ui'
import { IoC, CubesEvent, TOptional, mockPromise_200 } from 'cubes'
import { IDashboardAppService } from './service/meta/i-app-service'
import { Ti18n } from '../i18n'
import { AppContext } from './domain/def/app-context'
import { serviceMap } from '../service'
import { TGlobalTranslation } from '@/i18n/index'
import { IHistoricalPiService } from './service/meta/i-historical-pi-service'
import { useRouter } from 'vue-router'
import { IMetadataService } from './service/meta/i-metadata-service'
import { spring } from 'motion'
import { IHistoricalPIWithRanks } from './domain/meta/i-historical-pI-with-ranks'
import { DashboardEvent } from './service/meta/i-app-service'
import { HistoricalPIWithRanks } from './domain/def/historical-pI-with-ranks'
import { init } from './presentation/components/map/def'
defineProps(props as any)

const { isBusy, isReady } = useAppContainer()
const appService = IoC.DI().resolve<IDashboardAppService>(serviceMap.AppService.key)
const historicalPIService = IoC.DI().resolve<IHistoricalPiService>(serviceMap.HistoricalPIService.key)
const metadataService = IoC.DI().resolve<IMetadataService>(serviceMap.MetadataService.key)
const router = useRouter()
const tGlobal = ref() as unknown as Ref<Ref<TGlobalTranslation>>
const stateIso_a2 = ref()
const modalPi = ref({}) as Ref<{ kpiCard: TOptional<IHistoricalPIWithRanks>; contributingCard: TOptional<IHistoricalPIWithRanks>; measure: TOptional<IHistoricalPIWithRanks> }>
const modals = ref({
  kpiCard: false,
  contributingPercentageCard: false
})
const loading = ref(true)

appService.addEventListener(new CubesEvent(AppServiceEvent.ready), () => {
  const global = toRef(useTranslation<Ti18n>(appService), 'tGlobal') as unknown as Ref<TGlobalTranslation>
  tGlobal.value = global
  IoC.DI().register(AppContext, {
    default: {
      id: 'appContext',
      ctorArgs: [
        {
          [serviceMap.AppService.key]: appService,
          [serviceMap.HistoricalPIService.key]: historicalPIService,
          [serviceMap.MetadataService.key]: metadataService
        },
        { global }
      ],
      domain: 0
    }
  })
})

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

appService.addEventListener(new CubesEvent(DashboardEvent.openKpiCard), (e: CubesEvent<IHistoricalPIWithRanks>) => {
  modalPi.value.kpiCard = new HistoricalPIWithRanks(e.info)
  modals.value.kpiCard = true
})

appService.addEventListener(new CubesEvent(DashboardEvent.openContributingPercentageCard), (e: CubesEvent<{ pi: IHistoricalPIWithRanks; measure: IHistoricalPIWithRanks; iso_a2: string }>) => {
  modalPi.value.contributingCard = new HistoricalPIWithRanks(e.info.pi)
  modalPi.value.measure = new HistoricalPIWithRanks(e.info.measure)
  stateIso_a2.value = e.info.iso_a2
  modals.value.contributingPercentageCard = true
})
onMounted(async () => {
  loading.value = true
  try {
    await init()
  } catch (error) {
    appService.error(ref(`Couldn't load data`), undefined, '0', 0)
  } finally {
    await mockPromise_200(200)
    loading.value = false
  }
})
const MapControl = defineAsyncComponent(() => import('./presentation/components/map/index.vue'))
const KpiCard = defineAsyncComponent(() => import('./presentation/components/kpi-card/index.vue'))
const ContributingCard = defineAsyncComponent(() => import('./presentation/components/contributing-card/index.vue'))
</script>
