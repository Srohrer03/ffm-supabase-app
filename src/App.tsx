import { useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  // Keep Supabase initialized (passive), but do NOT enable auth flows during build.
  useEffect(() => {
    supabase.auth.getSession()
  }, [])

  return (
    <div style={{ padding: '40px', fontSize: '18px' }}>
      <div style={{ fontWeight: 600 }}>FFM Supabase App - Connected</div>

      <button
        disabled
        title="Login will be enabled after platform build is complete"
        style={{
          marginTop: '12px',
          opacity: 0.5,
          cursor: 'not-allowed'
        }}
      >
        Login (disabled during build)
      </button>
    </div>
  )
}
