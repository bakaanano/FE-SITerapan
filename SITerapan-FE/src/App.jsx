import { useContext, useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import { AuthProvider, AuthContext } from './context/AuthContext'
import Header from './components/Header'
import LoginModal from './components/LoginModal'
import ChatbotButton from './components/ChatbotButton'
import Chatbot from './components/Chatbot'
import Register from './pages/Register'
import Catalog from './pages/Catalog'
import About from './pages/About'

function AppContent() {
  const [searchQuery, setSearchQuery] = useState('')
  const [catalogBooks, setCatalogBooks] = useState([])
  const [popularBooks, setPopularBooks] = useState([])
  const [loadingCatalog, setLoadingCatalog] = useState(true)
  const [isChatbotOpen, setIsChatbotOpen] = useState(false)
  const { user, isLoginOpen, setIsLoginOpen, isProfileOpen, setIsProfileOpen, handleLoginSuccess, handleLogout } = useContext(AuthContext)

  // Fetch data
  useEffect(() => {
    const fetchCatalogBooks = async () => {
      try {
        setLoadingCatalog(true)
        const response = await fetch('https://noninfectious-alonzo-unshapeable.ngrok-free.dev/api/catalog',{
          headers: {
            'ngrok-skip-browser-warning':'true'
          }
        })
        if (!response.ok) throw new Error('Gagal mengambil data')
        const data = await response.json()
        const allBooks = data.data || []

        // Catalog: Sort by ID (existing logic)
        const sortedCatalog = [...allBooks].sort((a, b) => a.buku_id - b.buku_id).slice(0, 5)
        setCatalogBooks(sortedCatalog)

        // Popular: Sort by Stock Ascending (Lowest stock = Most popular)
        const sortedPopular = [...allBooks].sort((a, b) => {
          const stokA = a.stok !== undefined ? a.stok : (a.Stok !== undefined ? a.Stok : 0);
          const stokB = b.stok !== undefined ? b.stok : (b.Stok !== undefined ? b.Stok : 0);
          return Number(stokA) - Number(stokB);
        }).slice(0, 5)
        setPopularBooks(sortedPopular)

      } catch (err) {
        console.error('Error fetching catalog books:', err)
      } finally {
        setLoadingCatalog(false)
      }
    }
    fetchCatalogBooks()
  }, [])

  const handleSearch = () => {
    console.log('Search for:', searchQuery)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  return (
    <>
      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Perpustakaan <span className="hero-title-highlight">Digital</span>
          </h1>
          <p className="hero-subtitle">Temukan buku favorit anda dengan bantuan AI Chatbot</p>

          <div className="search-container">
            <div className="search-box">
              {/* <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="8" cy="8" r="6" stroke="white" strokeWidth="2"/>
                <line x1="12" y1="12" x2="18" y2="18" stroke="white" strokeWidth="2"/>
              </svg> */}
              <input
                type="text"
                placeholder="Cari judul buku, penulis, kategori"
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
            <button className="search-btn" onClick={handleSearch}>Cari</button>
          </div>
        </div>
      </section>

      {/* Popular Books Section */}
      <section className="popular-books">
        <div className="popular-books-container">
          <div className="section-header">
            <h2 className="section-title">Buku Terpopuler</h2>
            <a href="/catalog" className="lihat-semua">Lihat Semua →</a>
          </div>

          <div className="books-grid">
            {loadingCatalog ? (
              <p>Memuat buku populer...</p>
            ) : popularBooks.length === 0 ? (
              <p>Belum ada data populer.</p>
            ) : (
              popularBooks.map((book) => (
                <div key={book.buku_id} className="book-card">
                  <div className="book-image">
                    <img src={book.cover || book.Cover || "/book-placeholder.jpg"} alt={book.Judul} />
                  </div>
                  <div className="book-info">
                    <h3 className="book-title">{book.Judul}</h3>
                    <p className="book-author">{book.Penulis}</p>
                    <p className="book-stock" style={{ fontSize: '0.8rem', color: '#666' }}>
                      Sisa Stok: {book.stok !== undefined ? book.stok : book.Stok}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* PustakaBot Section */}
      <section className="pustakabot-section">
        <div className="pustakabot-container">
          <div className="pustakabot-content">
            <h2 className="pustakabot-title">
              Bingung Mau Baca Apa?<br />Tanya <span className="pustakabot-highlight">PustakaBot</span> Aja!
            </h2>
            <ul className="pustakabot-features">
              <li>Cari buku berdasarkan referensi</li>
              <li>Booking buku secara real-time</li>
              <li>Meringkas otomatis sebuah buku</li>
              <li>Cek status peminjaman</li>
              <li>Tanya informasi perpustakaan</li>
            </ul>
          </div>
          <div className="pustakabot-image">
            <div className="chat-mockup">
              <div className="chat-header">PustakaBot</div>
              <div className="chat-messages">
                <div className="chat-message bot">
                  <p>AI dapat membantu Anda menemukan buku yang tepat sesuai preferensi Anda</p>
                </div>
                <div className="chat-message user">
                  <p>Saya ingin membaca buku tentang petualangan</p>
                </div>
                <div className="chat-message bot">
                  <p>Berikut rekomendasi buku petualangan untuk Anda...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="features-container">
          <h2 className="features-title">Fitur Unggulan</h2>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="11" cy="11" r="8"></circle>
                  <path d="m21 21-4.35-4.35"></path>
                </svg>
              </div>
              <h3 className="feature-name">Pencarian Cerdas</h3>
              <p className="feature-desc">AI membantu menemukan buku sesuai preferensi Anda</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              </div>
              <h3 className="feature-name">Booking Online</h3>
              <p className="feature-desc">Pesan dan booking buku kapan saja online</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                </svg>
              </div>
              <h3 className="feature-name">Rekomendasi Personal</h3>
              <p className="feature-desc">Dapatkan rekomendasi buku yang sesuai</p>
            </div>
          </div>
        </div>
      </section>

      {/* Katalog Buku Section */}
      <section className="katalog-section">
        <div className="katalog-container">
          <div className="section-header">
            <h2 className="section-title">Katalog Buku</h2>
            <a href="/catalog" className="lihat-semua">Lihat Semua →</a>
          </div>
          <div className="katalog-grid">
            {loadingCatalog ? (
              <p style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>Memuat data...</p>
            ) : catalogBooks.length === 0 ? (
              <p style={{ textAlign: 'center', padding: '2rem', gridColumn: '1 / -1' }}>Tidak ada buku</p>
            ) : (
              catalogBooks.map((book) => (
                <div key={book.buku_id} className="katalog-card">
                  <div className="katalog-image">
                    <img src={book.cover || book.Cover || "/book-placeholder.jpg"} alt={book.Judul} />
                  </div>
                  <div className="katalog-info">
                    <h3 className="katalog-book-title">{book.Judul}</h3>
                    <p className="katalog-author">{book.Penulis}</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3 className="footer-title">Perpustakaan <span className="footer-highlight">Digital</span></h3>
              <p className="footer-desc">Jendela dunia dalam genggaman Anda. Temukan ribuan buku digital dengan teknologi AI Chatbot untuk membantu pencarian yang lebih mudah.</p>
            </div>
            <div className="footer-section">
              <h4 className="footer-section-title">Navigasi</h4>
              <ul className="footer-links">
                <li><a href="#beranda">Beranda</a></li>
                <li><a href="#katalog">Katalog</a></li>
                <li><a href="#tentang">Tentang</a></li>
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
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.263-1.618.68-2.228 1.289-.609.61-1.026 1.449-1.289 2.228-.267.788-.468 1.658-.528 2.936C.008 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.263.779.68 1.618 1.289 2.228.61.609 1.449 1.026 2.228 1.289.788.267 1.658.468 2.936.528C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.79-.263 1.618-.68 2.228-1.289.609-.61 1.026-1.449 1.289-2.228.267-.788.468-1.658.528-2.936.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.263-.779-.68-1.618-1.289-2.228-.61-.609-1.449-1.026-2.228-1.289-.788-.267-1.658-.468-2.936-.528C15.667.008 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.56.217 1.001.542 1.44.98.438.439.763.88.98 1.44.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.56-.542 1.001-.98 1.44-.439.438-.88.763-1.44.98-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.56-.217-1.001-.542-1.44-.98-.438-.439-.763-.88-.98-1.44-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.56.542-1.001.98-1.44.439-.438.88-.763 1.44-.98.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Perpustakaan Digital (Not Open Dalam Pengerjaan)</p>
          </div>
        </div>
      </footer>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      {/* Chatbot Button - Always Visible */}
      <ChatbotButton
        isOpen={isChatbotOpen}
        onClick={() => setIsChatbotOpen(!isChatbotOpen)}
      />

      {/* Chatbot */}
      <Chatbot
        isOpen={isChatbotOpen}
        onClose={() => setIsChatbotOpen(false)}
      />
    </>
  )
}

export default function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<AppContent />} />
          <Route path="/register" element={<Register />} />
          <Route path="/catalog" element={<Catalog />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthProvider>
    </Router>
  )
}
