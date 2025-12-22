import React from 'react'

export default function BookDetailModal({ isOpen, onClose, book, onBooking, bookingLoading }) {
    if (!isOpen || !book) return null

    return (
        <>
            <div className="detail-modal-overlay" onClick={onClose}>
                <div className="detail-modal-content" onClick={(e) => e.stopPropagation()}>
                    <button className="detail-modal-close" onClick={onClose}>×</button>
                    <div className="detail-modal-body">
                        <div className="detail-image">
                            <img src={book.cover || book.Cover || "/book-placeholder.jpg"} alt={book.Judul} />
                        </div>
                        <div className="detail-info">
                            <h2 className="detail-title">{book.Judul || 'No Title'}</h2>
                            <p className="detail-author"><strong>Penulis:</strong> {String(book.Penulis || '-').trim()}</p>
                            <p className="detail-jenis"><strong>Jenis:</strong> {String(book.Jenis || '-').trim()}</p>
                            <p className="detail-category"><strong>Kategori:</strong> {String(book.Kategori || '-').trim()}</p>
                            <div className="detail-synopsis">
                                <strong>Sinopsis:</strong>
                                <p className="detail-synopsis-text">{String(book.Sinopsis || '-').trim()}</p>
                            </div>
                            <div className="detail-tags">
                                <strong>Tags:</strong>
                                <div className="tags-list">
                                    {book.Tags && String(book.Tags).trim() ? (
                                        String(book.Tags).split(',').map((tag, idx) => (
                                            <span key={idx} className="tag">{String(tag).trim()}</span>
                                        ))
                                    ) : (
                                        <span className="tag">Tidak ada tags</span>
                                    )}
                                </div>
                            </div>
                            <p className="detail-stok"><strong>Stok:</strong> {Number(book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)) > 0 ? `${book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)} tersedia` : 'Tidak tersedia'}</p>

                            <button
                                className="detail-booking-btn"
                                onClick={() => onBooking()}
                                disabled={bookingLoading || Number(book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)) <= 0}
                                style={{
                                    marginTop: '1rem',
                                    width: '100%',
                                    padding: '0.75rem',
                                    backgroundColor: Number(book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)) > 0 ? '#0056ff' : '#ccc',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: Number(book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)) > 0 ? 'pointer' : 'not-allowed',
                                    fontWeight: '600',
                                    fontSize: '1rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.5rem',
                                    marginBottom: '0.5rem'
                                }}
                            >
                                {bookingLoading ? (
                                    <>
                                        <span className="spinner" style={{
                                            width: '16px', height: '16px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 1s linear infinite'
                                        }}></span>
                                        Memproses...
                                    </>
                                ) : (
                                    <>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                                        </svg>
                                        {Number(book.stok !== undefined ? book.stok : (book.Stok !== undefined ? book.Stok : 0)) > 0 ? 'Pinjam Buku Ini' : 'Stok Habis'}
                                    </>
                                )}
                            </button>

                            <style>{`
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
              `}</style>

                            <button className="detail-close-btn" onClick={onClose}>Tutup</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
