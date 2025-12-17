import { useState, useRef, useEffect, useContext } from 'react'
import { AuthContext } from '../context/AuthContext'
import questionsData from '../utils/list_pertanyaan_FE.json'
import '../styles/Chatbot.css'

export default function Chatbot({ isOpen, onClose }) {
  const { user, setIsLoginOpen } = useContext(AuthContext)
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: 'bot',
      text: 'Halo! Saya adalah PustakaBot. Ada yang bisa saya bantu?',
    },
  ])
  const [loading, setLoading] = useState(false)
  const [showCategories, setShowCategories] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const messagesEndRef = useRef(null)
  const chatboxRef = useRef(null)

  // Extract unique categories from dataset
  const getCategories = () => {
    const categories = new Set()
    questionsData.dataset.forEach((item) => {
      if (item.category) {
        categories.add(item.category)
      }
    })
    return Array.from(categories)
  }

  const categories = getCategories()

  // Get a random question from selected category
  const getRandomQuestion = (categoryName) => {
    const matching = questionsData.dataset.filter((item) =>
      item.category === categoryName
    )
    if (matching.length === 0) return null
    const random = matching[Math.floor(Math.random() * matching.length)]
    return random.question
  }

  // Auto scroll ke pesan terbaru
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Close chatbot ketika klik di luar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (chatboxRef.current && !chatboxRef.current.contains(event.target)) {
        // Jangan tutup jika klik di chat button
        if (!event.target.closest('.chat-button')) {
          onClose()
        }
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const handleResetAndClose = () => {
    setMessages([
      {
        id: 1,
        type: 'bot',
        text: 'Halo! Saya adalah PustakaBot. Ada yang bisa saya bantu?',
      },
    ])
    setShowCategories(true)
    setSelectedCategory(null)
    onClose()
  }

  const handleSelectCategory = async (category) => {
    // Check login first
    if (!user) {
      const loginMsg = {
        id: Date.now(),
        type: 'bot',
        text: 'Silakan login terlebih dahulu untuk menggunakan layanan ini.',
      }
      setMessages((prev) => [...prev, loginMsg])
      console.log('Chatbot User Object:', user)
      setIsLoginOpen(true)
      return
    }

     // Debugging untuk user

    setShowCategories(false)
    setSelectedCategory(category)
    setLoading(true)

    // Get random question from category
    const question = getRandomQuestion(category)

    if (!question) {
      setLoading(false)
      return
    }

    // Add user message (category choice)
    const categoryMessage = {
      id: Date.now(),
      type: 'user',
      text: `Kategori: ${category}`,
    }

    setMessages((prev) => [...prev, categoryMessage])

    // Add question message
    const questionMessage = {
      id: Date.now() + 1,
      type: 'user',
      text: question,
    }

    setMessages((prev) => [...prev, questionMessage])

    try {
      // Helper function to decode JWT
      const parseJwt = (token) => {
        try {
          return JSON.parse(atob(token.split('.')[1]))
        } catch (e) {
          return null
        }
      }

      // Robust user ID check
      // Prioritize: explicit ID -> phone (since backend uses it as SID) -> email
      let userId = user.id || user.user_id || user.userId || user._id || user.phone || user.email

      // Fallback: Try to get ID from token if not in user object
      if (!userId) {
        const token = localStorage.getItem('authToken')
        if (token) {
          console.log('Attempting to decode token...')
          const decoded = parseJwt(token)
          console.log('Decoded Token:', decoded) // Log FULL decoded token
          if (decoded) {
            userId = decoded.id || decoded.user_id || decoded.sub || decoded.phone || decoded.email
            console.log('User ID retrieved from token:', userId)
          } else {
            console.warn('Failed to decode token or token is invalid')
          }
        } else {
          console.warn('No authToken found in localStorage')
        }
      }

      if (!userId) {
        console.error('User ID not found in user object or token. User Object:', user)
        throw new Error(
          'Gagal memproses data user (ID tidak ditemukan). Silakan login ulang.'
        )
      }

      console.log('Using User ID:', userId) // Debug log final ID used

      const response = await fetch('http://localhost:3000/api/chatbot/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: question,
          user_id: userId,
        }),
      })

      const contentType = response.headers.get('content-type')
      let data
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // Jika bukan JSON (misal HTML 404/500), kita lempar error spesifik
        // atau kita baca text-nya jika perlu debugging
        throw new Error('Respon server tidak valid (bukan JSON)')
      }

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          setIsLoginOpen(true)
          throw new Error('Sesi habis atau belum login. Silakan login kembali.')
        }
        throw new Error(data.error || 'Gagal mengirim pesan')
      }

      // Add bot response
      const botMessage = {
        id: Date.now() + 2,
        type: 'bot',
        text: data.bot_response,
      }

      setMessages((prev) => [...prev, botMessage])

      // Show categories again after response
      setTimeout(() => {
        setShowCategories(true)
      }, 1500)
    } catch (error) {
      console.error('Chat error:', error)

      const errorMessage = {
        id: Date.now() + 2,
        type: 'bot',
        text: 'Maaf, terjadi kesalahan saat memproses pesan Anda. Coba lagi nanti.',
      }

      setMessages((prev) => [...prev, errorMessage])
      setShowCategories(true)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="chatbot-container" ref={chatboxRef}>
      {/* Chatbot Header */}
      <div className="chatbot-header">
        <div className="chatbot-header-content">
          <h3 className="chatbot-title">PustakaBot</h3>
          <p className="chatbot-subtitle">Asisten perpustakaan 24/7</p>
        </div>
        <div className="chatbot-header-buttons">
          <button
            className="chatbot-minimize"
            onClick={onClose}
            aria-label="Minimize chatbot"
            title="Minimize"
          >
            −
          </button>
          <button
            className="chatbot-close"
            onClick={handleResetAndClose}
            aria-label="Close chatbot"
            title="Tutup"
          >
            ×
          </button>
        </div>
      </div>

      {/* Chatbot Messages */}
      <div className="chatbot-messages">
        {messages.map((msg) => (
          <div key={msg.id} className={`chatbot-message ${msg.type}`}>
            <div className="message-avatar">
              {msg.type === 'bot' ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <div className="message-content">{msg.text}</div>
          </div>
        ))}
        {loading && (
          <div className="chatbot-message bot">
            <div className="message-avatar">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z" />
              </svg>
            </div>
            <div className="message-content typing">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chatbot Input - Categories Selection */}
      {showCategories && !loading && (
        <div className="chatbot-questions">
          <div className="questions-header">
            <p className="questions-title">Pilih Kategori</p>
          </div>
          <div className="questions-list">
            {getCategories().map((category) => (
              <button
                key={category}
                className="question-btn"
                onClick={() => handleSelectCategory(category)}
                disabled={loading}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
