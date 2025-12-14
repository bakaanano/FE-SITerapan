import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Catalog.css'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'

export default function Catalog() {
  const navigate = useNavigate()
  const { isLoginOpen, setIsLoginOpen, handleLoginSuccess } = useContext(AuthContext)
  const [books, setBooks] = useState([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('semua')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [selectedBook, setSelectedBook] = useState(null)
  const [isDetailOpen, setIsDetailOpen] = useState(false)

  // Fetch data dari API backend
  useEffect(() => {
    const fetchBooks = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:3000/api/catalog')
        if (!response.ok) throw new Error('Gagal mengambil data')
        const data = await response.json()
        // Sort berdasarkan buku_id
        const sortedBooks = (data.data || []).sort((a, b) => a.buku_id - b.buku_id)
        console.log('Data dari API:', data)
        console.log('Sorted Books:', sortedBooks)
        setBooks(sortedBooks)
        setError(null)
      } catch (err) {
        setError(err.message)
        console.error('Error fetching books:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchBooks()
  }, [])

  // Filter berdasarkan kategori dan search, lalu sort by buku_id
  const filteredBooks = books
    .filter(book => {
      const matchesCategory = selectedFilter === 'semua' || book.Kategori?.toLowerCase().includes(selectedFilter.toLowerCase())
      const matchesSearch = searchQuery === '' || 
        book.Judul?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        book.Penulis?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
    .sort((a, b) => a.buku_id - b.buku_id)

  const handleSearch = (e) => {
    e.preventDefault()
    console.log('Searching for:', searchQuery)
  }

  const handleDetailClick = (book) => {
    console.log('Book yang dipilih:', book)
    setSelectedBook(book)
    setIsDetailOpen(true)
  }

  return (
    <div className="catalog-page">
      {/* Header */}
      <Header />

      {/* Catalog Content */}
      <div className="catalog-container">
        {/* Catalog Header */}
        <div className="catalog-header">
          <h1 className="catalog-title">Katalog Buku</h1>
          <p className="catalog-subtitle">
            Temukan buku yang anda cari lokasi lengkap kami. Gunakan fitur pencarian atau filter berdasarkan kategori!
          </p>
        </div>

        {/* Search and Filter Section */}
        <div className="catalog-controls">
          {/* Search Bar */}
          <form className="catalog-search" onSubmit={handleSearch}>
            <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              placeholder="Cari judul buku, penulis, kategori"
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </form>

          {/* Filter Buttons */}
          <div className="filter-buttons">
            <button
              className={`filter-btn ${selectedFilter === 'semua' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('semua')}
            >
              Semua
            </button>
            <button
              className={`filter-btn ${selectedFilter === 'fiksi' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('fiksi')}
            >
              Filksi
            </button>
            <button
              className={`filter-btn ${selectedFilter === 'sejarah' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('sejarah')}
            >
              Sejarah
            </button>
            <button
              className={`filter-btn ${selectedFilter === 'remaja' ? 'active' : ''}`}
              onClick={() => setSelectedFilter('remaja')}
            >
              Remaja
            </button>
          </div>
        </div>

        {/* Books Grid */}
        <div className="catalog-grid">
          {loading && <p style={{ textAlign: 'center', padding: '2rem' }}>Memuat data...</p>}
          {error && <p style={{ textAlign: 'center', padding: '2rem', color: '#d32f2f' }}>Error: {error}</p>}
          {!loading && !error && filteredBooks.length === 0 && <p style={{ textAlign: 'center', padding: '2rem' }}>Tidak ada buku yang ditemukan</p>}
          {filteredBooks.map(book => (
            <div key={book.buku_id} className="catalog-card">
              <div className="catalog-book-image">
                <img src="/book-placeholder.jpg" alt={book.Judul} />
              </div>
              <div className="catalog-book-info">
                <h3 className="catalog-book-title">{book.Judul}</h3>
                <p className="catalog-book-author">{book.Penulis}</p>
                <button className="catalog-detail-btn" onClick={() => handleDetailClick(book)}>Lihat Detail</button>
              </div>
            </div>
          ))}
        </div>
      </div>

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
                <li><a href="/">Beranda</a></li>
                <li><a href="/catalog">Katalog</a></li>
                <li><a href="/about">Tentang</a></li>
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
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                  </svg>
                </a>
                <a href="#instagram" className="social-icon">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.263-1.618.68-2.228 1.289-.609.61-1.026 1.449-1.289 2.228-.267.788-.468 1.658-.528 2.936C.008 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.263.779.68 1.618 1.289 2.228.61.609 1.449 1.026 2.228 1.289.788.267 1.658.468 2.936.528C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.79-.263 1.618-.68 2.228-1.289.609-.61 1.026-1.449 1.289-2.228.267-.788.468-1.658.528-2.936.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.263-.779-.68-1.618-1.289-2.228-.61-.609-1.449-1.026-2.228-1.289-.788-.267-1.658-.468-2.936-.528C15.667.008 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.07 1.171.054 1.805.244 2.227.408.56.217 1.001.542 1.44.98.438.439.763.88.98 1.44.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.56-.542 1.001-.98 1.44-.439.438-.88.763-1.44.98-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.56-.217-1.001-.542-1.44-.98-.438-.439-.763-.88-.98-1.44-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.56.542-1.001.98-1.44.439-.438.88-.763 1.44-.98.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
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
      {isLoginOpen && (
        <LoginModal 
          isOpen={isLoginOpen} 
          onClose={() => setIsLoginOpen(false)}
          onLoginSuccess={handleLoginSuccess}
        />
      )}
      
      {/* Detail Modal */}
      {isDetailOpen && selectedBook && (
        <>
          {console.log('Selected Book di Modal:', selectedBook)}
          <div className="detail-modal-overlay" onClick={() => setIsDetailOpen(false)}>
            <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="detail-modal-close" onClick={() => setIsDetailOpen(false)}>×</button>
              <div className="detail-modal-body">
                <div className="detail-image">
                  <img src="/book-placeholder.jpg" alt={selectedBook.judul} />
                </div>
                <div className="detail-info">
                  {console.log('Debug - Penulis:', selectedBook.Penulis)}
                  {console.log('Debug - Jenis:', selectedBook.Jenis)}
                  {console.log('Debug - Kategori:', selectedBook.Kategori)}
                  {console.log('Debug - Sinopsis:', selectedBook.Sinopsis)}
                  {console.log('Debug - Tags:', selectedBook.Tags)}
                  {console.log('Debug - Stok:', selectedBook.Stok)}
                  <h2 className="detail-title">{selectedBook.Judul || 'No Title'}</h2>
                  <p className="detail-author"><strong>Penulis:</strong> {String(selectedBook.Penulis || '-').trim()}</p>
                  <p className="detail-jenis"><strong>Jenis:</strong> {String(selectedBook.Jenis || '-').trim()}</p>
                  <p className="detail-category"><strong>Kategori:</strong> {String(selectedBook.Kategori || '-').trim()}</p>
                  <div className="detail-synopsis">
                    <strong>Sinopsis:</strong>
                    <p className="detail-synopsis-text">{String(selectedBook.Sinopsis || '-').trim()}</p>
                  </div>
                  <div className="detail-tags">
                    <strong>Tags:</strong>
                    <div className="tags-list">
                      {selectedBook.Tags && String(selectedBook.Tags).trim() ? (
                        String(selectedBook.Tags).split(',').map((tag, idx) => (
                          <span key={idx} className="tag">{String(tag).trim()}</span>
                        ))
                      ) : (
                        <span className="tag">Tidak ada tags</span>
                      )}
                    </div>
                  </div>
                  <p className="detail-stok"><strong>Stok:</strong> {Number(selectedBook.Stok) > 0 ? `${selectedBook.Stok} tersedia` : 'Tidak tersedia'}</p>
                  <button className="detail-close-btn" onClick={() => setIsDetailOpen(false)}>Tutup</button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
