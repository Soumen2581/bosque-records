import { ref } from 'vue'
import type { Ref } from 'vue'
import type { ApiCallOptions, UseApiReturn } from '@/types'

export function useApi(): UseApiReturn {
  const loading: Ref<boolean> = ref(false)
  const error: Ref<string | null> = ref(null)
  
  const apiCall = async (endpoint: string, options: ApiCallOptions = {}): Promise<any> => {
    loading.value = true
    error.value = null
    
    try {
      // Use the Vite proxy in development, production API in production
      const apiUrl = `/api/v1${endpoint}`
      
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        },
        ...options
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      return await response.json()
    } catch (err: any) {
      error.value = err.message
      
      // In development, if the API is not available, provide a quiet warning
      if (err.message.includes('fetch') || err.message.includes('Failed to fetch')) {
        console.warn(`API endpoint ${endpoint} unavailable - using fallback data`)
      } else {
        console.error('API call failed:', err)
      }
      
      throw err
    } finally {
      loading.value = false
    }
  }
  
  const get = (endpoint: string): Promise<any> => apiCall(endpoint)
  
  const post = (endpoint: string, data: any): Promise<any> => apiCall(endpoint, {
    method: 'POST',
    body: JSON.stringify(data)
  })
  
  const put = (endpoint: string, data: any): Promise<any> => apiCall(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data)
  })
  
  const del = (endpoint: string): Promise<any> => apiCall(endpoint, {
    method: 'DELETE'
  })
  
  return { 
    loading, 
    error, 
    apiCall,
    get,
    post,
    put,
    del
  }
} 