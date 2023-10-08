import { Application as App } from 'cubes-ui'
import { TApplication } from '../meta/i-application'

class Application extends App implements TApplication {
  public someExtraProp!: number

  public deserialize({ /*someExtraProp = 100,*/ ...rest }: Partial<TApplication> = {}): void {
    super.deserialize(rest)
    //this.someExtraProp = someExtraProp
  }
}
 
export { Application }