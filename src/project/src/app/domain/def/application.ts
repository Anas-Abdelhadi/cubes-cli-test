import { Application as App } from 'cubes-ui'
import { TDashboardApplication } from '../meta/i-application'

class DashboardApplication extends App implements TDashboardApplication {
  public someExtraProp!: number

  public deserialize({ someExtraProp = 100, ...rest }: Partial<TDashboardApplication> = {}): void {
    super.deserialize(rest)
    this.someExtraProp = someExtraProp
  }
}
 
export { DashboardApplication }