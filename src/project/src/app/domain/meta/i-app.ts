import { CubesServiceBase } from 'cubes-ui'
import { THashMap } from 'cubes'
import { serviceMap } from '../../../service'

//DO NOT DELETE
// type TServices<T extends THashMap<{key:string, config:any}>, K extends IAppService&T> = {[key in keyof Pick<T,'key'> as  ${ T[key] & string }  ]: K[key]}
type TServiceNames = typeof serviceMap

interface IAppContext {
  services: Partial<{ [k in keyof TServiceNames]: CubesServiceBase }>
  translation: THashMap
 
}

export type { IAppContext, TServiceNames }
