// CUSTOM HOOK
import { useEffect, useRef } from 'react'

export const usePrev = (value: any) => {
  const ref = useRef<any>()
  useEffect(() => {
    ref.current = value
  })

  return ref.current
}
