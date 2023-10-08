 

<template>
  <v-app-container :is-busy="isBusy" :is-ready="isReady">
    <app-main-layout v-if="isReady" class="no-select">
      <router-view v-slot="{ Component, route }">
          <transition :name="route.meta.transition || 'fade'" appear>
              <component :is="Component" />
          </transition>
        </router-view>
    </app-main-layout>
  </v-app-container>
</template>
<script lang="ts" setup>
import { Ref, toRef } from 'vue'
import { cubesAppControlProps as props, useTranslation, AppServiceEvent } from 'cubes-ui'
import { useAppContainer } from 'cubes-ui'
import { serviceMap } from '../service'
import { useRouter } from 'vue-router'
import { CubesEvent, IoC } from 'cubes'
import { AppContext } from './domain/def/app-context'
import type { Ti18n } from '../i18n'
import type { TGlobalTranslation } from '../i18n/index'
import type { IAppService } from 'cubes-ui'
 

defineProps(props)
const router = useRouter()
const { isReady, isBusy } = useAppContainer()
const appService = IoC.DI().resolve<IAppService>(serviceMap.AppService.key)

router.afterEach((to, from) => {
  const toDepth = to.path.split('/').length
  const fromDepth = from.path.split('/').length
  to.meta.transition = toDepth < fromDepth ? 'slide-right' : 'slide-left'
})

appService.addEventListener(new CubesEvent(AppServiceEvent.ready), () => {
  const global = toRef(useTranslation<Ti18n>(appService, []), 'tGlobal') as Ref<TGlobalTranslation>

  IoC.DI().register(AppContext, {
    default: {
      id: 'appContext',
      ctorArgs: [{ [serviceMap.AppService.key]: appService }, { global }],
      domain: 0
    }
  })
})

</script>

 