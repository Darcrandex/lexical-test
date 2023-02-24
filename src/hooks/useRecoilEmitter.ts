import { useRef, useEffect } from 'react'
import { atomFamily, useRecoilValue } from 'recoil'

type Subscription<T> = (val: T) => void

export class EventEmitter<T> {
  private subscriptions = new Set<Subscription<T>>()

  emit = (val: T) => {
    for (const subscription of this.subscriptions) {
      subscription(val)
    }
  }

  useSubscription = (callback: Subscription<T>) => {
    const callbackRef = useRef<Subscription<T>>()
    callbackRef.current = callback
    useEffect(() => {
      function subscription(val: T) {
        if (callbackRef.current) {
          callbackRef.current(val)
        }
      }
      this.subscriptions.add(subscription)
      return () => {
        this.subscriptions.delete(subscription)
      }
    }, [])
  }
}

export type EventPayload = { type: string; [k: string]: unknown }

const createAtom = atomFamily<EventEmitter<EventPayload>, string>({
  key: 'global-emitter',
  default: () => new EventEmitter(),
})

/**
 * @description 基于 Recoil 的事件总线
 * @author darcand
 * @param id - 用于给 emitter 绑定唯一 key
 */
export function useRecoilEmitter(id = 'global') {
  const emitter = useRecoilValue(createAtom(id))
  return emitter
}
