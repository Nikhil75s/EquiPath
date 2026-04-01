import { useState, useEffect, useCallback } from 'react'
import api from '../services/api'

export function useFetch(url, options = {}) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { immediate = true, ...fetchOptions } = options

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await api.get(url, fetchOptions)
      if (response.data.success) {
        setData(response.data.data)
      } else {
        setError(response.data.error || 'Request failed')
      }
    } catch (err) {
      setError(err.response?.data?.error || err.message || 'Request failed')
    } finally {
      setLoading(false)
    }
  }, [url])

  useEffect(() => {
    if (immediate) {
      fetchData()
    }
  }, [fetchData, immediate])

  const refetch = useCallback(() => fetchData(), [fetchData])

  return { data, loading, error, refetch }
}
