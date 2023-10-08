import { IAppService as ICubesAppService, TModal, TOpenPromise } from 'cubes-ui'

import { TApplication } from '../../domain/meta/i-application'
import { TModalMap } from '../../../control'

export type TNoNext<T> = Omit<T, 'next'>

export type TModalManagerAction<T extends keyof TModalMap> = Promise<TNoNext<TOpenPromise<TModal<TModalMap, T>>>>
interface IAppService extends ICubesAppService {
  application: TApplication
}
 
export type { IAppService }
