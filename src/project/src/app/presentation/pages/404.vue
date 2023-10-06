<template>
  <app-page-content master-details hide-breadcrumb>
    <div class="d-flex align-items-center justify-content-center page-inner-fill">
      <v-empty figure="error" :title="tGlobal.errors.pageNotFound" figureWidth="50vw">
        <template #action>
          <a v-fake-link @click="router.back">{{ tGlobal.back }}</a>
        </template>
      </v-empty>
    </div>
  </app-page-content>
</template>
<script lang="ts" setup>
import { IoC } from 'cubes'
import { IAppContext } from 'cubes-ui'
import { Ref } from 'vue'
import { TGlobalTranslation } from '../../../i18n/index'
import { useRouter } from 'vue-router'
const router = useRouter()

const appContext = IoC.DI().resolve<IAppContext>('appContext'),
  tGlobal = appContext!.translation.global as Ref<TGlobalTranslation>
</script>
 
