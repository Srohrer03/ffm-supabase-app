import { useEffect } from 'react'
import { supabase } from './supabaseClient'

export default function App() {
  useEffect(() => {
    console.log('VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL)
    console.log('VITE_SUPABASE_ANON_KEY present:', Boolean(import.meta.env.VITE_SUPABASE_ANON_KEY))

    supabase.auth.getSession().then(({ data, error }: { data: unknown; error: unknown }) => {
      console.log('Supabase session:', data)
      console.log('Supabase error:', error)
    })
  }, [])

  return (
    <div style={{ padding: '40px', fontSize: '18px' }}>
      <div>FFM Supabase App - Connected</div>
      <button disabled style={{ marginTop: '12px' }}>
        Login (disabled)
      </button>
    </div>
  )
}
