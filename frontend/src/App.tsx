import { useState } from 'react'
import { AppShell, type PageId } from './components/AppShell'
import { DashboardPage } from './pages/DashboardPage'
import { StationsPage } from './pages/StationsPage'

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  return <AppShell page={page} onNavigate={setPage}>{page === 'dashboard' ? <DashboardPage onGoToStations={() => setPage('stations')} /> : <StationsPage />}</AppShell>
}
