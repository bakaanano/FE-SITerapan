import { createContext, useState, useEffect } from 'react'

export const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [isLoginOpen, setIsLoginOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)

  // Check for existing user on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user')
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser))
      } catch (err) {
        console.error('Error parsing user data:', err)
      }
    }
  }, [])

  const handleLoginSuccess = (userData) => {
    setUser(userData)
    setIsLoginOpen(false)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch('https://noninfectious-alonzo-unshapeable.ngrok-free.dev/api/auth/logout', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({
          phone: user?.phone,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Logout failed:', data.error)
      }
    } catch (err) {
      console.error('Logout error:', err)
    } finally {
      // Clear user data and token regardless
      setUser(null)
      setIsProfileOpen(false)
      localStorage.removeItem('user')
      localStorage.removeItem('authToken')
    }
  }

  const value = {
    user,
    setUser,
    isLoginOpen,
    setIsLoginOpen,
    isProfileOpen,
    setIsProfileOpen,
    handleLoginSuccess,
    handleLogout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
