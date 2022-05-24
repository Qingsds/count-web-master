import { useEffect, useState } from 'react'

export const useDebounce = (fn, ms) => {
  const [f] = useState(() => fn)
  useEffect(() => {
    const timer = setTimeout(() => {
      f()
    }, [ms])
    return () => {
      clearTimeout(timer)
    }
  }, [f, ms])
  return f
}
