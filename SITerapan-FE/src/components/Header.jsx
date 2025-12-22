import { useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import { Link } from 'react-router-dom'

export default function Header() {
  const { user, isLoginOpen, setIsLoginOpen, isProfileOpen, setIsProfileOpen, handleLogout } = useContext(AuthContext)

  return (
    <header className="header">
      <div className="header-container">
        <Link to="/" className="logo" style={{ textDecoration: 'none', color: '#0056ff', cursor: 'pointer' }}>Logo</Link>
        <nav className="nav-menu">
          <Link to="/" className="nav-link">Beranda</Link>
          <Link to="/catalog" className="nav-link">Katalog</Link>
          <Link to="/about" className="nav-link">Tentang</Link>
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
                {user.role === 'admin' ? (
                  <Link
                    to="/admin"
                    className="profile-menu-item"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      textDecoration: 'none',
                      color: '#333',
                      fontSize: '1rem',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    Admin Page
                  </Link>
                ) : (
                  <Link
                    to="/profile"
                    className="profile-menu-item"
                    onClick={() => setIsProfileOpen(false)}
                    style={{
                      display: 'block',
                      padding: '0.75rem 1rem',
                      textDecoration: 'none',
                      color: '#333',
                      fontSize: '1rem',
                      borderBottom: '1px solid #f0f0f0'
                    }}
                  >
                    Profil
                  </Link>
                )}
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
