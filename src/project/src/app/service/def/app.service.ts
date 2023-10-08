import { AppServiceBase, IModalManager } from 'cubes-ui'
import { Inject, Service, Singleton } from 'cubes'

import { Application } from '../../domain/def/application'
import type { IAppService } from '../meta/i-app-service'
import { IoCLevelsEnum } from '../../../control'
import type { TApplication } from '../../domain/meta/i-application'
import type { TModalMap } from '../../../control'
import { serviceMap } from '../../../service'

@Service(IoCLevelsEnum.PROD_1, serviceMap.AppService.key)
@Singleton
class AppService extends AppServiceBase implements IAppService {
  public readonly id: string = serviceMap.AppService.key
  application!: TApplication
 
 
  @Inject() ModalManager!: IModalManager<TModalMap>
  protected createApp(config: Partial<TApplication>, state?: TApplication['state']) {
    this.application = new Application({ config, state } as Partial<TApplication>)
  }

   
}

export default  AppService
