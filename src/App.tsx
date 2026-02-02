import { useEffect } from 'react'
import { supabase } from './supabaseClient'
import AppShell from './layout/AppShell'

export default function App() {
  useEffect(() => {
    supabase.auth.getSession()
  }, [])

  return (
    <AppShell>
      <div style={{ fontSize: '18px' }}>
        Dashboard (placeholder)
      </div>

      <button
        disabled
        title="Login will be enabled after platform build is complete"
        style={{
          marginTop: '20px',
          opacity: 0.5,
          cursor: 'not-allowed'
        }}
      >
        Login (disabled during build)
      </button>
    </AppShell>
  )
}
