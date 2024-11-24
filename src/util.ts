type PlainObject = {
  [k: string] : any
}
/**
 * @internal
 */
export function each(obj: PlainObject, fn: (v: any, k: string) => any) {
  for(let k in obj) {
    fn(obj[k], k)
  }
}

/**
 * @category Common Utility
 */
export function nextJob(fn: Function) {
  Promise.resolve().then(() => fn())
}
/**
 * @internal
 */
export function debounce(fn: Function, delay: number) {
  let timeoutHandle: number | null
  return (...argv: any[]) => {
    if (timeoutHandle) {
      clearTimeout(timeoutHandle)
      timeoutHandle = null
    }

    timeoutHandle = window.setTimeout(() => {
      fn(...argv)
    }, delay)
  }
}
/**
 * @internal
 */
export function idleThrottle(fn: Function, timeout = 100) {
  let hasCallback: number | null
  let lastArgv : any[]
  return (...argv: any[]) => {
    if (!hasCallback) {
      hasCallback = window.requestIdleCallback(() => {
        fn(...lastArgv)
        hasCallback = null
      }, {timeout})
    }
    lastArgv = argv
  }
}
/**
 * @internal
 */
export function removeNodesBetween(start: ChildNode, endNode: ChildNode|Comment, includeEnd = false) {
  if (start.parentElement !== endNode.parentElement) {
    throw new Error('placeholder and element parentElement not same')
  }

  let pointer = start
  while(pointer !== endNode) {
    const current = pointer
    pointer = current.nextSibling!
    if(!pointer) throw new Error('can not find nextSibling')
    current.remove()
  }

  if (includeEnd) endNode.remove()
}
/**
 * @internal
 */
export const isPlainObject = (val: unknown): val is object => val?.constructor === Object

const hasOwnProperty = Object.prototype.hasOwnProperty
/**
 * @internal
 */
export const hasOwn = (
    val: object,
    key: string | symbol
) => hasOwnProperty.call(val, key)

/**
 * @internal
 */
export function assert(condition: boolean, message: string ) {
  if (!condition) {
    if (__DEV__) debugger
    throw new Error(message)
  }
}
/**
 * @internal
 */
export function mapClassNameToObject(className: string) {
  return Object.fromEntries(className.split(' ').map(c => [c, true]))
}
/**
 * @internal
 */
export function shallowEqual(a:any,b:any) {
    if (a === b) return true
    if (typeof a !== 'object' || typeof b !== 'object' || a===null || b=== null) return false

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    if (keysA.length !== keysB.length) return false
    for (let key of keysA) {
        if (a[key] !== b[key]) return false
    }
    return true
}


// TODO cancel?
/**
 * @internal
 */
export function nextFrames(fns: ((time: number) => void)[]) {
    if (!fns.length) return Promise.resolve()

    return new Promise((resolve) => {
        let i = 0
        const next = (time: number) => {
            if (i < fns.length) {
                fns[i++](time)
                requestAnimationFrame(next)
            } else {
                resolve(true)
            }
        }
        requestAnimationFrame(next)
    })
}

// export function nextFrames(fns: ((time: number) => void)[]) {
//     let i = 0
//     const next = (time: number) => {
//         if (i < fns.length) {
//             fns[i++](time)
//             setTimeout(next, 500)
//         }
//     }
//     setTimeout(next, 17)
// }
/**
 * @category Common Utility
 */
export function nextTick(fn: Function) {
    setTimeout(fn, 1)
}

// 顺序 执行返回  promise 的函数
/**
 * @category Common Utility
 */
export function sequencePromises(fns: (() => Promise<any>)[]) {
    return fns.reduce((prev, fn) => prev.then(() => fn()), Promise.resolve())
}