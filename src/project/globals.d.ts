// aliases
declare function raf(callback: FrameRequestCallback): number
declare var __runtime_public_path__: { [key: string]: string }
interface Window {
  raf(callback: FrameRequestCallback): number
  on<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  off<K extends keyof WindowEventMap>(type: K, listener: (this: Window, ev: WindowEventMap[K]) => any, options?: boolean | EventListenerOptions): void
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

interface Document {
  qs<E extends Element = Element>(selector: string): E | null
  qsa<E extends Element = Element>(selector: string): NodeListOf<E>
  on<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  off<K extends keyof DocumentEventMap>(type: K, listener: (this: Document, ev: DocumentEventMap[K]) => any, options?: boolean | EventListenerOptions): void
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
}

// extensions
interface Node {
  replace(newElement: Node): void
  attr(attr: string, val?: string): any
  empty(): void
  wrap(wrapperElement: Node): void
  remove(): void
}

interface HTMLElement {
  qs<E extends Element = Element>(selector: string): E | null
  qsa<E extends Element = Element>(selector: string): NodeListOf<E>
  on<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | AddEventListenerOptions): void
  on(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | AddEventListenerOptions): void
  off<K extends keyof HTMLElementEventMap>(type: K, listener: (this: HTMLElement, ev: HTMLElementEventMap[K]) => any, options?: boolean | EventListenerOptions): void
  off(type: string, listener: EventListenerOrEventListenerObject, options?: boolean | EventListenerOptions): void
  prepend(newElement: Node): void
}

interface String {
  capitalize(): string
  format(...replacements: any[]): string
}

interface Array<T> {
  flatMap<T, U>(mapFunc: (x: T) => U[]): U[]

  /**
   * @summary Range Safe access. imagine an array loop. after last index the first index will be available like starting over ...2,3,0,1,2,3,[0,1,2,3],0,1,2,3,0,1...
   * @param rightOrLeft the index positive if Right, negative if Left
   * @example
   *  const a = [0,1,2]
   *  a[10] // gives undefined
   *  a.carousel(10)  // gives 1
   *  a.carousel(-10)  // gives 2
   *  */
  carousel<T>(rightOrLeft: number): T

  /**
   * @summary `Durstenfeld` shuffle a optimization of `Fisher-Yates` algorithm
   */
  randomize<T>(): T[]

  /**
   * @example [0,1,2,3].breakOn([2]) = [[0,1],[2,3]]
   *
   * @summary group an array based on break indices
   * @param  `breaks` the indices to split the groups. every index represents the start of a group
   */
  breakOn<T>(breaks: number[]): T[][]

  /**
   * @example [0,1,2].breakAll() = [[0],[1],[2]]
   *
   * @summary group all items in array one per group
   */

  breakAll<T>(): T[][]

  /**
   * @example [].prefillRandNums(3,0,100) = [10,27,50]
   * @param limit number of items in the array
   * @param min the min number that can occur in the prefilled array
   * @param max the max number that can occur in the prefilled array
   * @summary returns a prefilled array of length `limit` filled with random numbers within the range `min`-`max`
   */

  prefillRandNums<T = number>(limit: number, min?: number, max?: number): T[]

  first: T | undefined
  last: T | undefined
}

interface DateConstructor {
  Period(frequency: number, base?: Date): Date
  UTCPeriod(frequency: number, base?: Date): Date
  DaysInMonth(month: number, year: number): number
}
interface Date {
  same(date: Date, frequency?: number, strict?: boolean): boolean
  sameUTC(date: Date, frequency?: number, strict?: boolean): boolean
  shiftPeriod(shift?: number, shiftFrequency?: number): number
  shiftUTCPeriod(shift?: number, shiftFrequency?: number): number
  roundPeriod(frequency: number): number
  roundUTCPeriod(frequency: number): number
  getPeriod(frequency: number): Date
  getUTCPeriod(frequency: number): Date
  getQuarter(): number
  getUTCQuarter(): number
  getSemester(): number
  getUTCSemester(): number
}

interface Function {
  /**
   * Wraps the function in a `setTimeout` then invokes it, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
   * @param thisArg The object to be used as the this object.
   * @param delay The timeout delay before excuting the provided function.
   * @param argArray A set of arguments to be passed to the function.
   */
  async(this: Function, thisArg?: any, delay?: number, ...argArray: any[]): any

  /**
   * Wraps the function in a `setTimeout` then invokes it, substituting the specified object for the this value of the function, and the specified array for the arguments of the function.
   * @param thisArg The object to be used as the this object.
   * @param delay The timeout delay before excuting the provided function.
   * @param isReady A predicate to prevent execution until a true value is returned
   * @param argArray A set of arguments to be passed to the function.
   */
  asyncWhen(this: Function, thisArg?: any, delay?: number, isReady?: () => boolean, ...argArray: any[]): any
}

interface Event {
  delegateTarget: EventTarget
}
interface EventTarget {
  closest(selector: string): HTMLElement | null
}

declare type Dir = 'ltr' | 'rtl' | 'auto'
