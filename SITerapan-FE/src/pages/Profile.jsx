import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Profile.css'

export default function Profile() {
    const { user, isLoginOpen, setIsLoginOpen } = useContext(AuthContext)
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Redirect if not logged in
    useEffect(() => {
        // Wait a bit to ensure context is loaded (optional, but good practice)
        // For now we rely on user state being populated or null
        if (user === null) {
            // If user is definitely null (e.g. initial load might be null too, but AuthContext handles it)
            // We might want to check if localStorage has token but context not yet updated?
            // Let's rely on the check below for now, but adding a small delay or check might be needed if AuthContext is slow
        }
    }, [user, navigate])

    useEffect(() => {
        if (!user) {
            // If eventually user is null, we can redirect or show login
            // But let's handle the "not logged in" state in render or redirect
            return
        }

        const fetchBookings = async () => {
            try {
                setLoading(true)
                // Adjust endpoint as per your plan
                // Adjust endpoint to use user-specific route
                const userId = user.user_id || user.id || user.userId || user._id
                // Use /api/profile endpoint with query param
                const response = await fetch(`https://rozanne-duplicable-bently.ngrok-free.dev/api/booking/user/${userId}`, {
                    headers: new Headers({ 'ngrok-skip-browser-warning': 'true' })
                })

                if (!response.ok) throw new Error('Gagal mengambil data peminjaman')

                const data = await response.json()
                console.log(data)
                // Backend returns { data: [...] } for /api/booking/user/:id endpoint
                const userBookings = data.data || []
                console.log(userBookings)

                const enrichedBookings = userBookings.map(booking => {
                    // Backend returns nested 'buku' object
                    const book = booking.buku || {}
                    return {
                        ...booking,
                        bookTitle: book.Judul || 'Unknown Book',
                        bookCover: book.cover || book.Cover || '/book-placeholder.jpg',
                        bookAuthor: book.Penulis || '-'
                    }
                })

                // Sort by date descending
                enrichedBookings.sort((a, b) => new Date(b.tanggal_booking) - new Date(a.tanggal_booking))

                setBookings(enrichedBookings)

            } catch (err) {
                console.error('Error fetching bookings:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchBookings()
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

            <div className="profile-container">
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

                {/* Bookings List */}
                <h2 className="section-title">Riwayat Peminjaman Buku</h2>

                <div className="bookings-list">
                    {loading ? (
                        <p style={{ padding: '2rem', textAlign: 'center' }}>Memuat data peminjaman...</p>
                    ) : error ? (
                        <p style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>Error: {error}</p>
                    ) : bookings.length === 0 ? (
                        <div className="empty-state">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" strokeWidth="2" style={{ marginBottom: '1rem' }}>
                                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                            </svg>
                            <p>Belum ada buku yang dipinjam.</p>
                        </div>
                    ) : (
                        <table className="bookings-table">
                            <thead>
                                <tr>
                                    <th>Buku</th>
                                    <th>Tanggal Pinjam</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {bookings.map((booking) => (
                                    <tr key={booking.booking_id || Math.random()}>
                                        <td>
                                            <div className="book-info-cell">
                                                <img
                                                    src={booking.bookCover}
                                                    alt={booking.bookTitle}
                                                    className="book-thumbnail"
                                                />
                                                <div>
                                                    <div style={{ fontWeight: '600' }}>{booking.bookTitle}</div>
                                                    <div style={{ fontSize: '0.85rem', color: '#666' }}>{booking.bookAuthor}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            {new Date(booking.tanggal_booking).toLocaleDateString('id-ID', {
                                                day: 'numeric', month: 'long', year: 'numeric'
                                            })}
                                        </td>
                                        <td>
                                            <span className={`status-badge status-${(booking.status || 'pending').toLowerCase()}`}>
                                                {booking.status || 'Pending'}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </div>
        </div>
    )
}
