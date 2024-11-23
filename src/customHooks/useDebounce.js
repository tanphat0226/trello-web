// Custom Hooks https://usehooks.com/

import { debounce } from 'lodash'
import { useCallback } from 'react'

// https://trippingoncode.com/posts/react-debounce-hook
export default function useDebounce(fnToDebounce, delay = 500) {
  if (isNaN(delay)) {
    throw new Error('Delay must be a number')
  }

  if (!fnToDebounce || typeof fnToDebounce !== 'function') {
    throw new Error('Debounced function must be a function')
  }

  // https://lodash.com/docs/4.17.15#debounce
  // eslint-disable-next-line react-hooks/exhaustive-deps
  return useCallback(debounce(fnToDebounce, delay), [fnToDebounce, delay])
}
