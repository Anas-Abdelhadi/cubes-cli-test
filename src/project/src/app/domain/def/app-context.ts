import type { IAppContext, TServiceNames } from '../meta/i-app'
import { Singleton, THashMap } from 'cubes'

import { CubesServiceBase } from 'cubes-ui'

@Singleton
export class AppContext implements IAppContext {
  services: Partial<{ [k in keyof TServiceNames]: CubesServiceBase }>
  translation: THashMap<any>
  
  constructor(_services: Partial<{ [k in keyof TServiceNames]: CubesServiceBase }> = {}, translation: THashMap<any> = {} ) {
    this.services = _services
    this.translation = translation
   
  }
}
