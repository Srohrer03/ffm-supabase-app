export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <aside
        style={{
          width: '220px',
          backgroundColor: '#0b1f33',
          color: '#ffffff',
          padding: '20px'
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: '20px' }}>
          FFM
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <span>Dashboard</span>
          <span>Sites</span>
          <span>Work Orders</span>
          <span>Vendors</span>
        </nav>
      </aside>

      <main style={{ flex: 1, padding: '30px', backgroundColor: '#f5f7fa' }}>
        {children}
      </main>
    </div>
  )
}
