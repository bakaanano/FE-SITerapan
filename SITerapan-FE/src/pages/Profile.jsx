import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Profile.css'

export default function Profile() {
    const { user, isLoginOpen, setIsLoginOpen } = useContext(AuthContext)
    const navigate = useNavigate()
    // Redirect if not logged in
    useEffect(() => {
        if (user === null) {
            // Wait a bit to ensure context is loaded (optional, but good practice)
        }
    }, [user, navigate])

    useEffect(() => {
        if (!user) {
            return
        }
    }, [user])

    if (!user) {
        return (
            <div className="profile-page">
                <Header />
                <div className="profile-container">
                    <div className="empty-state">
                        <h2>Silakan Login Terlebih Dahulu</h2>
                        <p>Anda perlu login untuk melihat profil dan riwayat peminjaman.</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="profile-page">
            <Header />

            <div className="user-profile-content">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                    </div>
                    <div className="profile-info">
                        <h1>{user.full_name || user.nama || 'User'}</h1>
                        <p><strong>Email:</strong> {user.email}</p>
                        <p><strong>Phone:</strong> {user.phone || user.no_telp || '-'}</p>
                    </div>
                </div>

                <div style={{ marginTop: '2rem' }}>
                    <button
                        onClick={() => navigate('/peminjaman')}
                        className="btn-primary"
                        style={{ padding: '0.75rem 1.5rem', border: 'none', borderRadius: '8px', cursor: 'pointer', backgroundColor: '#0056ff', color: 'white', fontWeight: '600' }}
                    >
                        Lihat Status Peminjaman
                    </button>
                </div>
            </div>
        </div>
    )
}
