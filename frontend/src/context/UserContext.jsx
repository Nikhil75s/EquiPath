import { createContext, useState, useCallback } from 'react'
import api from '../services/api'

export const UserContext = createContext(null)

export function UserProvider({ children }) {
  const [seekerProfile, setSeekerProfile] = useState(null)
  const [employerProfile, setEmployerProfile] = useState(null)

  const fetchSeekerProfile = useCallback(async () => {
    try {
      const res = await api.get('/seeker/profile')
      if (res.data.success) {
        setSeekerProfile(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.error('Failed to fetch seeker profile:', err)
    }
  }, [])

  const fetchEmployerProfile = useCallback(async () => {
    try {
      const res = await api.get('/employer/profile')
      if (res.data.success) {
        setEmployerProfile(res.data.data)
        return res.data.data
      }
    } catch (err) {
      console.error('Failed to fetch employer profile:', err)
    }
  }, [])

  return (
    <UserContext.Provider value={{
      seekerProfile, setSeekerProfile, fetchSeekerProfile,
      employerProfile, setEmployerProfile, fetchEmployerProfile
    }}>
      {children}
    </UserContext.Provider>
  )
}
