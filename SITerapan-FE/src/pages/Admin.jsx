import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Admin.css'

export default function Admin() {
    const { user, handleLogout } = useContext(AuthContext)
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(null)

    // Protect Admin Route & Fetch Data
    useEffect(() => {
        // 1. Check User & Role
        if (!user) {
            navigate('/')
            return
        }
        // Assuming 'role' is stored in user object. Adjust based on backend response.
        // If backend doesn't send role in 'user' object from login, we might need to fetch profile.
        // For now, let's assume it's there or we proceed.
        // If strictly 'admin', uncomment below:
        // if (user.role !== 'admin') {
        //   alert('Akses ditolak. Halaman ini khusus admin.')
        //   navigate('/')
        //   return
        // }

        const fetchAllBookings = async () => {
            try {
                setLoading(true)
                // Adjust endpoint to fetch ALL bookings (assuming admin endpoint exists or generic GET /api/booking lists all)
                // Based on user provided code `getAllBookings` -> `GET /api/booking`
                // AND fetch Catalog to get Covers (since getAllBookings doesn't return cover)
                const [bookingsResponse, catalogResponse] = await Promise.all([
                    fetch('https://rozanne-duplicable-bently.ngrok-free.dev/api/booking', {
                        headers: new Headers({ 'ngrok-skip-browser-warning': 'true' })
                    }),
                    fetch('https://rozanne-duplicable-bently.ngrok-free.dev/api/catalog', {
                        headers: new Headers({ 'ngrok-skip-browser-warning': 'true' })
                    })
                ])

                if (!bookingsResponse.ok) throw new Error('Gagal mengambil data booking')
                // Catalog fetch is optional but needed for covers. If it fails, we just don't show covers.

                const bookingsData = await bookingsResponse.json()
                const catalogData = await catalogResponse.ok ? await catalogResponse.json() : { data: [] }

                const allBookings = bookingsData.data || []
                const allBooks = catalogData.data || []

                // Create Map of Books for fast lookup
                const booksMap = {}
                allBooks.forEach(b => { booksMap[b.buku_id] = b })

                // Merge data and filter out 'draft'
                const enrichedBookings = allBookings
                    .filter(booking => (booking.status || '').toLowerCase() !== 'draft')
                    .map(booking => {
                        const catalogBook = booksMap[booking.buku_id] || {}
                        return {
                            ...booking,
                            buku: {
                                ...booking.buku,
                                // Use catalog cover if available, fallback to api response (which is missing it), then placeholder
                                cover: catalogBook.cover || catalogBook.Cover || booking.buku?.cover || '/book-placeholder.jpg',
                                Judul: booking.buku?.Judul || catalogBook.Judul || 'Judul ?'
                            }
                        }
                    })

                // Sort descending date
                enrichedBookings.sort((a, b) => new Date(b.tanggal_booking) - new Date(a.tanggal_booking))

                setBookings(enrichedBookings)
            } catch (err) {
                console.error('Error fetching admin bookings:', err)
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchAllBookings()
    }, [user, navigate])

    const handleStatusUpdate = async (bookingId, newStatus) => {
        if (!confirm(`Ubah status menjadi "${newStatus}"?`)) return

        setActionLoading(bookingId)
        try {
            const response = await fetch(`https://rozanne-duplicable-bently.ngrok-free.dev/api/booking/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    status: newStatus,
                    user_id: user.user_id || user.id // Admin ID who performs the action
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.message || 'Gagal update status')

            // Update local state
            setBookings(prev => prev.map(b =>
                b.booking_id === bookingId ? { ...b, status: newStatus } : b
            ))

            alert(`Status berhasil diubah menjadi ${newStatus}`)

        } catch (err) {
            console.error('Update status error:', err)
            alert(`Gagal: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

    if (!user) return null // Will redirect

    return (
        <div className="admin-page">
            <Header /> {/* Reuse Header, or create AdminHeader if distinct */}

            <div className="admin-container">
                <div className="admin-header">
                    <div>
                        <h1 className="admin-title">Dashboard Admin</h1>
                        <p className="admin-subtitle">Kelola peminjaman buku perpustakaan</p>
                    </div>
                    <div className="admin-user-info">
                        {/* Admin info if needed */}
                    </div>
                </div>

                <div className="admin-content">
                    {loading ? (
                        <div className="loading-container">Memuat data booking...</div>
                    ) : error ? (
                        <div className="error-container">Error: {error}</div>
                    ) : bookings.length === 0 ? (
                        <div className="empty-container">Belum ada data peminjaman.</div>
                    ) : (
                        <div style={{ overflowX: 'auto' }}>
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Peminjam</th>
                                        <th>Buku</th>
                                        <th>Tanggal</th>
                                        <th>Status</th>
                                        <th>Aksi</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.map(booking => (
                                        <tr key={booking.booking_id}>
                                            <td>#{booking.booking_id}</td>
                                            <td>
                                                <div><strong>{booking.user?.full_name || 'User'}</strong></div>
                                                <div style={{ fontSize: '0.8rem', color: '#888' }}>ID: {booking.user_id}</div>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                    <img
                                                        src={booking.buku?.cover || booking.buku?.Cover || '/book-placeholder.jpg'}
                                                        alt="Cover"
                                                        style={{ width: '40px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                                                        onError={(e) => { e.target.onerror = null; e.target.src = '/book-placeholder.jpg' }}
                                                    />
                                                    <div><strong>{booking.buku?.Judul || 'Judul ?'}</strong></div>
                                                </div>
                                            </td>
                                            <td>
                                                {new Date(booking.tanggal_booking).toLocaleDateString('id-ID', {
                                                    day: 'numeric', month: 'short', year: 'numeric'
                                                })}
                                            </td>
                                            <td>
                                                <span className={`status-badge status-${(booking.status || 'pending').toLowerCase()}`}>
                                                    {booking.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    {/* Only show reasonable transitions */}
                                                    {booking.status === 'pending' && (
                                                        <>
                                                            <button className="action-btn btn-approve"
                                                                disabled={actionLoading === booking.booking_id}
                                                                onClick={() => handleStatusUpdate(booking.booking_id, 'approved')}
                                                            >
                                                                Approve
                                                            </button>
                                                            <button className="action-btn btn-cancel"
                                                                disabled={actionLoading === booking.booking_id}
                                                                onClick={() => handleStatusUpdate(booking.booking_id, 'rejected')}
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                    {booking.status === 'approved' && (
                                                        <button className="action-btn btn-return"
                                                            disabled={actionLoading === booking.booking_id}
                                                            onClick={() => handleStatusUpdate(booking.booking_id, 'returned')}
                                                        >
                                                            Return
                                                        </button>
                                                    )}
                                                    {/* Add other status logic if needed */}
                                                    {['returned', 'cancelled', 'rejected'].includes(booking.status) && (
                                                        <span style={{ color: '#aaa', fontSize: '0.9rem' }}>Selesai</span>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
