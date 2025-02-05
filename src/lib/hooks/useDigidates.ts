import { useState } from 'react'

interface DigiDatesResponse {
  convertedDate: string
  // Add other response fields based on the API
}

export function useDigidates() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const convertDate = async (date: string, format: string): Promise<DigiDatesResponse | null> => {
    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/digidates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ date, format })
      })

      if (!response.ok) {
        throw new Error('Failed to convert date')
      }

      const data = await response.json()
      return data
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    convertDate,
    loading,
    error
  }
} 