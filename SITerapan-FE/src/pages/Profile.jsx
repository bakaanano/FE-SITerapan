import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Profile.css'

export default function Profile() {
    const { user, setUser, isLoginOpen, setIsLoginOpen } = useContext(AuthContext)
    const navigate = useNavigate()
    const [isEditing, setIsEditing] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [formData, setFormData] = useState({
        full_name: '',
        address: '',
        password: ''
    })

    // Redirect if not logged in
    useEffect(() => {
        if (user === null) {
            // Wait a bit to ensure context is loaded (optional, but good practice)
        }
    }, [user, navigate])

    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || user.nama || '',
                address: user.address || user.alamat || '',
                password: '' // Don't populate password
            })
        }
    }, [user])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
    }

    const handleEditToggle = () => {
        setIsEditing(!isEditing)
        if (!isEditing && user) {
            setFormData({
                full_name: user.full_name || user.nama || '',
                address: user.address || user.alamat || '',
                password: ''
            })
        }
    }

    const handleSave = async () => {
        console.log('User object for debug:', user); // Debugging line
        // Specific check to help user identify key name if different
        if (!user) {
            alert("User belum login.")
            return;
        }

        // Attempt to find the correct ID field if user_id is missing
        const userId = user.user_id || user.id || user.Id;

        if (!userId) {
            alert(`User ID tidak ditemukan. Objekt user: ${JSON.stringify(user)}`)
            return
        }

        try {
            setIsLoading(true)
            const payload = {
                user_id: userId,
                full_name: formData.full_name,
                address: formData.address
            }
            // Only add password if it's not empty
            if (formData.password) {
                payload.password = formData.password
            }

            const response = await fetch('https://rozanne-duplicable-bently.ngrok-free.dev/api/profile', {
                method: 'PUT', // Assuming PUT for update
                headers: {
                    'ngrok-skip-browser-warning': 'true',
                    'Content-Type': 'application/json',
                    // Add auth token if needed, usually from localStorage
                    // 'Authorization': `Bearer ${localStorage.getItem('authToken')}` 
                },
                body: JSON.stringify(payload)
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || 'Gagal mengupdate profile')
            }

            // Update user in context
            const updatedUser = { ...user, ...data.updatedData }
            setUser(updatedUser)
            // Also update localStorage
            localStorage.setItem('user', JSON.stringify(updatedUser))

            alert('Profile berhasil diupdate')
            setIsEditing(false)

        } catch (err) {
            console.error('Update error:', err)
            alert(err.message || 'Terjadi kesalahan saat update profile')
        } finally {
            setIsLoading(false)
        }
    }

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
                    <div className="profile-info" style={{ flex: 1 }}>
                        {isEditing ? (
                            <div className="edit-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Nama Lengkap</label>
                                    <input
                                        type="text"
                                        name="full_name"
                                        value={formData.full_name}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Email (Tidak dapat diubah)</label>
                                    <input
                                        type="email"
                                        value={user.email}
                                        disabled
                                        className="form-input"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd', backgroundColor: '#f5f5f5', cursor: 'not-allowed' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Alamat</label>
                                    <textarea
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        className="form-input"
                                        rows="3"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div className="form-group">
                                    <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: '600' }}>Password Baru (Opsional)</label>
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Kosongkan jika tidak ingin mengubah"
                                        value={formData.password}
                                        onChange={handleChange}
                                        className="form-input"
                                        style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ddd' }}
                                    />
                                </div>
                                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                                    <button
                                        onClick={handleSave}
                                        disabled={isLoading}
                                        className="btn-primary"
                                        style={{ padding: '0.5rem 1rem', border: 'none', borderRadius: '4px', cursor: 'pointer', backgroundColor: '#28a745', color: 'white' }}
                                    >
                                        {isLoading ? 'Menyimpan...' : 'Simpan'}
                                    </button>
                                    <button
                                        onClick={handleEditToggle}
                                        className="btn-secondary"
                                        style={{ padding: '0.5rem 1rem', border: '1px solid #ccc', borderRadius: '4px', cursor: 'pointer', backgroundColor: 'white' }}
                                    >
                                        Batal
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h1>{user.full_name || user.nama || 'User'}</h1>
                                <p><strong>Email:</strong> {user.email}</p>
                                <p><strong>Phone:</strong> {user.phone || user.no_telp || '-'}</p>
                                <p><strong>Alamat:</strong> {user.address || user.alamat || '-'}</p>

                                <button
                                    onClick={handleEditToggle}
                                    style={{
                                        marginTop: '1rem',
                                        padding: '0.5rem 1rem',
                                        border: '1px solid #0056ff',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                        backgroundColor: 'transparent',
                                        color: '#0056ff',
                                        fontWeight: '600'
                                    }}
                                >
                                    Edit Profil
                                </button>
                            </>
                        )}
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
