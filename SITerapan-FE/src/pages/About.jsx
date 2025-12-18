import { useState, useContext } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import '../styles/About.css'
import { AuthContext } from '../context/AuthContext'
import Header from '../components/Header'
import LoginModal from '../components/LoginModal'

// Import semua gambar dari folder assets/about
const images = import.meta.glob('../assets/about/*.{jpg,jpeg,JPG,JPEG,png,gif}', { eager: true })
const imageMap = Object.keys(images).reduce((acc, path) => {
  const filename = path.split('/').pop()
  acc[filename] = images[path].default
  return acc
}, {})

export default function About() {
  const navigate = useNavigate()
  const { isLoginOpen, setIsLoginOpen, handleLoginSuccess } = useContext(AuthContext)

  const teamMembers = [
    {
      id: 1,
      name: 'Dila',
      role: 'Project Manager',
      image: imageMap['dila.jpeg']
    },
    {
      id: 2,
      name: 'Aldi',
      role: 'Frontend Developer',
      image: imageMap['aldi.jpg']
    },
    {
      id: 3,
      name: 'Taufiq',
      role: 'Backend Developer',
      image: imageMap['taufiq.JPG']
    },
    {
      id: 4,
      name: 'Azam',
      role: 'UI/UX Designer',
      image: imageMap['azam.jpeg']
    }
  ]

  return (
    <div className="about-page">
      
      {/* Header */}
      <Header />

      {/* About Content */}
      <div className="about-container">
        {/* Vision Section */}
        <section className="vision-section">
          <div className="vision-content">
            <div className="vision-image">
              <img src={imageMap['rakbuku.jpg']} alt="RakBuku" />
            </div>
            <div className="vision-text">
              <h2 className="vision-title">Visi Kami</h2>
              <p className="vision-desc">
                Pustaka Digital hadir dengan misi untuk memberikan kemudahan dalam akses literasi bagi seluruh lapisan masyarakat Indonesia. Kami percaya bahwa literasi adalah kunci kemajuan bangsa. Dengan memadukan teknologi modern dan koleksi buku berkualitas, kami berupaya menjadikan ekosistem belajar yang menyenangkan dan mudah diakses.
              </p>
              {/* <div className="vision-stats">
                <div className="stat-item">
                  <div className="stat-label">5rb+</div>
                  <div className="stat-name">Koleksi Buku</div>
                </div>
                <div className="stat-item">
                  <div className="stat-label">2rb+</div>
                  <div className="stat-name">Pengunjung</div>
                </div>
              </div> */}
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="team-container">
            <h2 className="team-title">Tim Kami</h2>
            <div className="team-grid">                             
              {teamMembers.map(member => (
                <div key={member.id} className="team-card">
                  <img src={member.image} alt={member.name} className="team-avatar" />
                  <h3 className="team-name">{member.name}</h3>
                  <p className="team-role">{member.role}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
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
                    <path d="M12 0C8.74 0 8.333.015 7.053.072 5.775.132 4.905.333 4.117.6c-.779.263-1.618.68-2.228 1.289-.609.61-1.026 1.449-1.289 2.228-.267.788-.468 1.658-.528 2.936C.008 8.333 0 8.74 0 12s.015 3.667.072 4.947c.06 1.277.261 2.148.528 2.936.263.779.68 1.618 1.289 2.228.61.609 1.449 1.026 2.228 1.289.788.267 1.658.468 2.936.528C8.333 23.988 8.74 24 12 24s3.667-.015 4.947-.072c1.277-.06 2.148-.261 2.936-.528.79-.263 1.618-.68 2.228-1.289.609-.61 1.026-1.449 1.289-2.228.267-.788.468-1.658.528-2.936.06-1.28.072-1.687.072-4.947s-.015-3.667-.072-4.947c-.06-1.277-.261-2.148-.528-2.936-.263-.779-.68-1.618-1.289-2.228-.61-.609-1.449-1.026-2.228-1.289-.788-.267-1.658-.468-2.936-.528C15.667.008 15.26 0 12 0zm0 2.16c3.203 0 3.585.009 4.849.070 1.171.054 1.805.244 2.227.408.56.217 1.001.542 1.44.98.438.439.763.88.98 1.44.164.422.354 1.057.408 2.227.061 1.264.07 1.646.07 4.849s-.009 3.585-.07 4.849c-.054 1.171-.244 1.805-.408 2.227-.217.56-.542 1.001-.98 1.44-.439.438-.88.763-1.44.98-.422.164-1.057.354-2.227.408-1.264.061-1.646.07-4.849.07s-3.585-.009-4.849-.07c-1.171-.054-1.805-.244-2.227-.408-.56-.217-1.001-.542-1.44-.98-.438-.439-.763-.88-.98-1.44-.164-.422-.354-1.057-.408-2.227-.061-1.264-.07-1.646-.07-4.849s.009-3.585.07-4.849c.054-1.171.244-1.805.408-2.227.217-.56.542-1.001.98-1.44.439-.438.88-.763 1.44-.98.422-.164 1.057-.354 2.227-.408 1.264-.061 1.646-.07 4.849-.07zm0 3.678c-3.405 0-6.162 2.757-6.162 6.162 0 3.405 2.757 6.162 6.162 6.162 3.405 0 6.162-2.757 6.162-6.162 0-3.405-2.757-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4s1.791-4 4-4 4 1.79 4 4-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                </a>
              </div>
            </div>
          </div>
          <div className="footer-divider"></div>
          <div className="footer-bottom">
            <p className="footer-copyright">© 2025 Perpustakaan Digital </p>
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
    </div>
  )
}
