import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import '../styles/Register.css'

export default function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    nama_lengkap: '',
    email: '',
    telepon: '',
    alamat: '',
    password: '',
    konfirmasi_password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showKonfirmasiPassword, setShowKonfirmasiPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    // Validasi form
    if (!formData.nama_lengkap || !formData.email || !formData.telepon || !formData.alamat || !formData.password || !formData.konfirmasi_password) {
      setError('Semua field harus diisi')
      return
    }

    if (formData.password !== formData.konfirmasi_password) {
      setError('Password dan konfirmasi password tidak cocok')
      return
    }

    if (formData.password.length < 6) {
      setError('Password minimal 6 karakter')
      return
    }

    // Send to API
    try {
      setLoading(true)
      const response = await fetch('https://rozanne-duplicable-bently.ngrok-free.dev/api/auth/register', {
        method: 'POST',
        headers: {
          'ngrok-skip-browser-warning': 'true',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          full_name: formData.nama_lengkap,
          email: formData.email,
          phone: formData.telepon,
          address: formData.alamat,
          password: formData.password,
          confirm_password: formData.konfirmasi_password
        })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Registrasi gagal')
        return
      }

      setSuccess('Registrasi berhasil! Redirecting...')
      console.log('Registrasi berhasil:', data)
      navigate('/')
      setTimeout(() => {
        window.scrollTo(0, 0)
      }, 0)
    } catch (err) {
      setError(err.message || 'Terjadi kesalahan saat registrasi')
      console.error('Error registrasi:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="register-container">
      <div className="register-card">
        <div className="register-header">
          <div className="register-avatar"></div>
          <h1 className="register-title">Buat Akun Baru</h1>
          <p className="register-subtitle">Mulailah giat literasi anda hari ini di SmartLib</p>
        </div>

        {error && <div className="register-error">{error}</div>}
        {success && <div className="register-success">{success}</div>}

        <form onSubmit={handleSubmit} className="register-form">
          {/* Nama Lengkap */}
          <div className="form-group">
            <label htmlFor="namaLengkap" className="form-label">Nama Lengkap</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              <input
                type="text"
                id="namaLengkap"
                name="nama_lengkap"
                placeholder="Nama"
                className="form-input"
                value={formData.nama_lengkap}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2"></rect>
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
              </svg>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                className="form-input"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Telepon */}
          <div className="form-group">
            <label htmlFor="telepon" className="form-label">Telepon</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
              <input
                type="tel"
                id="telepon"
                name="telepon"
                placeholder="Telepon"
                className="form-input"
                value={formData.telepon}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Alamat */}
          <div className="form-group">
            <label htmlFor="alamat" className="form-label">Alamat</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
              <input
                type="text"
                id="alamat"
                name="alamat"
                placeholder="Alamat"
                className="form-input"
                value={formData.alamat}
                onChange={handleChange}
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                placeholder="••••••••"
                className="form-input"
                value={formData.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Konfirmasi Password */}
          <div className="form-group">
            <label htmlFor="konfirmasiPassword" className="form-label">Konfirmasi Password</label>
            <div className="form-input-wrapper">
              <svg className="form-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
              </svg>
              <input
                type={showKonfirmasiPassword ? "text" : "password"}
                id="konfirmasiPassword"
                name="konfirmasi_password"
                placeholder="••••••••"
                className="form-input"
                value={formData.konfirmasi_password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowKonfirmasiPassword(!showKonfirmasiPassword)}
              >
                {showKonfirmasiPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          <button type="submit" className="register-btn" disabled={loading}>
            {loading ? 'Mendaftar...' : 'Daftar Sekarang'}
          </button>
        </form>

        <div className="register-footer">
          <span>Sudah punya akun? </span>
          <Link to="/" className="register-link">Masuk disini</Link>
        </div>
      </div>
    </div>
  )
}
