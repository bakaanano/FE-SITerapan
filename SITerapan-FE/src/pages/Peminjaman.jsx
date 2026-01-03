import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Peminjaman.css'

export default function Peminjaman() {
    const { user } = useContext(AuthContext)
    const navigate = useNavigate()
    const [bookings, setBookings] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [actionLoading, setActionLoading] = useState(null)

    useEffect(() => {
        if (user === null) {
            // Wait for auth check or redirect
            return
        }

        const fetchBookings = async () => {
            try {
                setLoading(true)
                const userId = user.user_id || user.id || user.userId || user._id
                const response = await fetch(`https://rozanne-duplicable-bently.ngrok-free.dev/api/booking/user/${userId}`, {
                    headers: new Headers({ 'ngrok-skip-browser-warning': 'true' })
                })

                if (!response.ok) throw new Error('Gagal mengambil data peminjaman')

                const data = await response.json()
                const userBookings = data.data || []

                const enrichedBookings = userBookings.map(booking => {
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

    const handleCancelBooking = async (bookingId) => {
        if (!confirm('Apakah anda yakin ingin membatalkan peminjaman ini?')) return

        setActionLoading(bookingId)
        try {
            const userId = user.user_id || user.id || user.userId || user._id

            const response = await fetch(`https://rozanne-duplicable-bently.ngrok-free.dev/api/booking/${bookingId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true'
                },
                body: JSON.stringify({
                    status: 'cancelled',
                    user_id: userId
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.message || 'Gagal membatalkan booking')

            setBookings(prev => prev.map(b =>
                b.booking_id === bookingId ? { ...b, status: 'cancelled' } : b
            ))

            alert('Booking berhasil dibatalkan')

        } catch (err) {
            console.error('Cancel booking error:', err)
            alert(`Gagal: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

    // Filter bookings
    const activeBookings = bookings.filter(b => ['pending', 'approved', 'borrowed', 'diproses', 'diajukan'].includes((b.status || '').toLowerCase()))
    const historyBookings = bookings.filter(b => ['returned', 'cancelled', 'rejected', 'dikembalikan', 'dibatalkan'].includes((b.status || '').toLowerCase()))

    if (!user) {
        return (
            <div className="peminjaman-page">
                <Header />
                <div className="peminjaman-container">
                    <div className="empty-state">
                        <h2>Silakan Login Terlebih Dahulu</h2>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="peminjaman-page">
            <Header />
            <div className="peminjaman-container">
                <div className="peminjaman-header">
                    <h1>Status Peminjaman</h1>
                    <p>Pantau proses peminjaman buku anda di sini</p>
                </div>

                {loading ? (
                    <p>Memuat data...</p>
                ) : error ? (
                    <p style={{ color: 'red' }}>Error: {error}</p>
                ) : (
                    <>
                        {/* Active Bookings */}
                        <section className="booking-section">
                            <h2 className="section-title">Peminjaman</h2>
                            {activeBookings.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>Tidak ada peminjaman aktif.</p>
                            ) : (
                                activeBookings.map(booking => (
                                    <div key={booking.booking_id} className="booking-card">
                                        <div className="booking-info">
                                            <img src={booking.bookCover} alt={booking.bookTitle} className="book-thumbnail-card" />
                                            <div className="booking-details">
                                                <h3>{booking.bookTitle}</h3>
                                                <div className="booking-meta">
                                                    <p>diajukan : {new Date(booking.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    <span className={`status-badge-card ${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-actions">
                                            {/* Example buttons based on image - adjust logic as needed */}
                                            {booking.status === 'pending' && (
                                                <>
                                                    <button className="btn-action btn-ajukan" onClick={() => alert('Fitur ini belum tersedia')}>Ajukan</button>
                                                    <button
                                                        className="btn-action btn-hapus"
                                                        onClick={() => handleCancelBooking(booking.booking_id)}
                                                        disabled={actionLoading === booking.booking_id}
                                                    >
                                                        {actionLoading === booking.booking_id ? '...' : 'Hapus'}
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                ))
                            )}
                        </section>

                        {/* History Bookings */}
                        <section className="booking-section">
                            <h2 className="section-title">Riwayat Peminjaman</h2>
                            {historyBookings.length === 0 ? (
                                <p style={{ color: '#666', fontStyle: 'italic' }}>Belum ada riwayat peminjaman.</p>
                            ) : (
                                historyBookings.map(booking => (
                                    <div key={booking.booking_id} className="booking-card" style={{ opacity: 0.8 }}>
                                        <div className="booking-info">
                                            <img src={booking.bookCover} alt={booking.bookTitle} className="book-thumbnail-card" />
                                            <div className="booking-details">
                                                <h3>{booking.bookTitle}</h3>
                                                <div className="booking-meta">
                                                    <p>dipinjam : {new Date(booking.tanggal_booking).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                                                    {/* Assuming return date might be available or calculated */}
                                                    {/* <p>dikembalikan : ...</p> */}
                                                    <span className={`status-badge-card ${booking.status.toLowerCase()}`}>
                                                        {booking.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="booking-actions">
                                            <button className="btn-action btn-kembali" onClick={() => navigate(`/catalog`)}>Pinjam Kembali</button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </section>
                    </>
                )}
            </div>
        </div>
    )
}
