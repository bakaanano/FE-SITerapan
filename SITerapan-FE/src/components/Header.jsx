import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'

export default function Header() {
  const { user, isLoginOpen, setIsLoginOpen, isProfileOpen, setIsProfileOpen, handleLogout } = useContext(AuthContext)

  return (
    <header className="header">
      <div className="header-container">
        <a href="/" className="logo" style={{ textDecoration: 'none', color: '#0056ff', cursor: 'pointer' }}>Logo</a>
        <nav className="nav-menu">
          <a href="/" className="nav-link">Beranda</a>
          <a href="/catalog" className="nav-link">Katalog</a>
          <a href="/about" className="nav-link">Tentang</a>
        </nav>
        {user ? (
          <div className="profile-container">
            <button 
              className="profile-btn" 
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              title={user.full_name || user.email}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
            </button>
            {isProfileOpen && (
              <div className="profile-dropdown">
                <div className="profile-dropdown-header">
                  <p className="profile-name">{user.full_name || user.email}</p>
                </div>
                <button 
                  className="profile-logout-btn"
                  onClick={handleLogout}
                >
                  Keluar
                </button>
              </div>
            )}
          </div>
        ) : (
          <button className="login-btn" onClick={() => setIsLoginOpen(true)}>Masuk</button>
        )}
      </div>
    </header>
  )
}
