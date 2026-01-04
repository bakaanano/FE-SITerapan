import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import '../styles/Peminjaman.css'
import LoginModal from '../components/LoginModal'
import { Link } from 'react-router-dom'

export default function Peminjaman() {
    const { user, isLoginOpen, setIsLoginOpen, handleLoginSuccess } = useContext(AuthContext)
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


    const handleAjukanBooking = async (bookingId) => {
        if (!confirm('Apakah anda yakin ingin mengajukan peminjaman ini?')) return

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
                    status: 'pending',
                    user_id: userId
                })
            })

            const data = await response.json()

            if (!response.ok) throw new Error(data.message || 'Gagal mengajukan booking')

            setBookings(prev => prev.map(b =>
                b.booking_id === bookingId ? { ...b, status: 'pending' } : b
            ))

            alert('Booking berhasil diajukan! Menunggu persetujuan admin.')

        } catch (err) {
            console.error('Ajukan booking error:', err)
            alert(`Gagal: ${err.message}`)
        } finally {
            setActionLoading(null)
        }
    }

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
    const activeBookings = bookings.filter(b => ['draft', 'pending', 'approved', 'borrowed', 'diproses', 'diajukan'].includes((b.status || '').toLowerCase()))
    const historyBookings = bookings.filter(b => ['returned', 'cancelled', 'rejected', 'dikembalikan', 'dibatalkan'].includes((b.status || '').toLowerCase()))

    return (
        <div className="peminjaman-page">
            <Header />
            <div className="peminjaman-container">
                {!user ? (
                    <div className="empty-state">
                        <h2>Silakan Login Terlebih Dahulu</h2>
                    </div>
                ) : (
                    <>
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
                                                    {booking.status === 'draft' && (
                                                        <button
                                                            className="btn-action btn-ajukan"
                                                            onClick={() => handleAjukanBooking(booking.booking_id)}
                                                            disabled={actionLoading === booking.booking_id}
                                                        >
                                                            {actionLoading === booking.booking_id ? '...' : 'Ajukan'}
                                                        </button>
                                                    )}
                                                    {['draft', 'pending'].includes(booking.status) && (
                                                        <button
                                                            className="btn-action btn-hapus"
                                                            onClick={() => handleCancelBooking(booking.booking_id)}
                                                            disabled={actionLoading === booking.booking_id}
                                                        >
                                                            {actionLoading === booking.booking_id ? '...' : 'Hapus'}
                                                        </button>
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
                    </>
                )}
            </div>
            <footer className="footer">
                <div className="footer-container">
                    <div className="footer-content">
                        <div className="footer-section">
                            <h3 className="footer-title">Smart<span className="footer-highlight">Lib</span></h3>
                            <p className="footer-desc">Jendela dunia dalam genggaman Anda. Temukan ribuan buku digital dengan teknologi AI Chatbot untuk membantu pencarian yang lebih mudah.</p>
                        </div>
                        <div className="footer-section">
                            <h4 className="footer-section-title">Navigasi</h4>
                            <ul className="footer-links">
                                <li><Link to="/">Beranda</Link></li>
                                <li><Link to="/catalog">Katalog</Link></li>
                                <li><Link to="/about">Tentang</Link></li>
                            </ul>
                        </div>
                        <div className="footer-section">
                            <h4 className="footer-section-title">Kontak</h4>
                            <p className="footer-contact">Email: info@perpustakaan.com</p>
                            <p className="footer-contact">+62888666790</p>
                            <p className="footer-contact">Jl. Perpustakaan No. 10<br />Jakarta Pusat</p>
                        </div>
                        <div className="footer-section">
                            <h4 className="footer-section-title">Sosial Media</h4>
                            <div className="social-links">
                                <a href="#facebook" className="social-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                                    </svg>
                                </a>
                                <a href="#instagram" className="social-icon">
                                    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                                        <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.263-1.618.68-2.228 1.289-.609.61-1.026 1.449-1.289 2.228-.267.788-.468 1.658-.528 2.936C.008 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.263.779.68 1.618 1.289 2.228.61.609 1.449 1.026 2.228 1.289.788.267 1.658.468 2.936.528C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.79-.263 1.618-.68 2.228-1.289.609-.61 1.026-1.449 1.289-2.228.267-.788.468-1.658.528-2.936.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.263-.779-.68-1.618-1.289-2.228-.61-.609-1.449-1.026-2.228-1.289-.788-.267-1.658-.468-2.936-.528C15.667.008 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217 1.001.542 1.44.98.438.439.763.88.98 1.44.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.56-.542 1.001-.98 1.44-.439-.438-.88.763-1.44.98-.422-.164-1.057-.354-2.227-.408 1.264-.061 1.646-.07 4.849-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="footer-divider"></div>
                    <div className="footer-bottom">
                        <p className="footer-copyright">© 2025 SmartLib</p>
                    </div>
                </div>
            </footer>
            {isLoginOpen && (
                <LoginModal
                    isOpen={isLoginOpen}
                    onClose={() => setIsLoginOpen(false)}
                    onLoginSuccess={handleLoginSuccess}
                />
            )}
        </div >
    )
}
