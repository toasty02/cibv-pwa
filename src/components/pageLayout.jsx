import { useNavigate } from 'react-router-dom'

export default function PageLayout({ title, headerContent, children }) {
  const navigate = useNavigate()

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      width: '100vw',
      boxSizing: 'border-box',
      overflow: 'hidden',
      backgroundColor: '#121212',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #333',
        backgroundColor: '#1e1e1e',
        flexShrink: 0,
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <h2 style={{ margin: '0 0 0.5rem 0', color: 'white' }}>{title}</h2>
        {headerContent}
      </div>

      {/* Main Scrollable Content */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '1rem',
        boxSizing: 'border-box',
        width: '100%',
        maxWidth: '100%',
      }}>
        {children}
      </div>

      {/* Footer */}
      <div style={{
        padding: '1rem',
        borderTop: '1px solid #333',
        backgroundColor: '#1e1e1e',
        flexShrink: 0,
        textAlign: 'center',
        width: '100%',
        boxSizing: 'border-box'
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            padding: '0.75rem 1.5rem',
            backgroundColor: '#388e3c',
            color: 'white',
            border: '1px solid #2e7d32',
            borderRadius: '8px',
            fontSize: '1rem',
            cursor: 'pointer',
            width: '100%'
          }}
        >
          ⬅ Home
        </button>
      </div>
    </div>
  )
}