import { useState, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  TrendingUp,
  Wallet,
  BarChart3,
  RefreshCw,
  Sun,
  Moon,
} from 'lucide-react'
import { useDuneQuery } from '@/hooks/useDuneQuery'
import { formatUSD } from '@/lib/format'
import { KpiCard } from '@/components/KpiCard'
import { KpiSkeleton, ChartSkeleton } from '@/components/Skeleton'
import { VolumeChart } from '@/components/VolumeChart'
import { NetFlowChart } from '@/components/NetFlowChart'
import { WalletAvgChart } from '@/components/WalletAvgChart'
import { ErrorState } from '@/components/ErrorState'
import { DailyStatsTable } from '@/components/DailyStatsTable'

const queryClient = new QueryClient()

function Dashboard() {
  const { data, isLoading, error, dataUpdatedAt, isRefreshing, forceRefresh } = useDuneQuery()

  const [isDark, setIsDark] = useState<boolean>(() => {
    const stored = localStorage.getItem('theme')
    return stored ? stored === 'dark' : true
  })

  useEffect(() => {
    const root = document.documentElement
    if (isDark) {
      root.removeAttribute('data-theme')
    } else {
      root.setAttribute('data-theme', 'light')
    }
    localStorage.setItem('theme', isDark ? 'dark' : 'light')
  }, [isDark])

  const latest = data?.[0]

  const lastUpdated = dataUpdatedAt
    ? new Date(dataUpdatedAt).toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      })
    : null

  if (error && !data) {
    return (
      <ErrorState
        message={error instanceof Error ? error.message : 'Failed to load data from Dune Analytics'}
        onRetry={() => forceRefresh()}
      />
    )
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--bg-base)' }}>

      {/* ── Header ── */}
      <header
        className="sticky top-0 z-10"
        style={{
          backgroundColor: 'var(--nav-blur-bg)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          borderBottom: '1px solid var(--border-default)',
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">

          {/* Logo + title */}
          <div className="flex items-center gap-3 min-w-0">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg flex-shrink-0"
              style={{ backgroundColor: 'var(--accent-blue-bg)', border: '1px solid var(--border-default)' }}
            >
              <BarChart3 className="w-4 h-4" style={{ color: 'var(--accent-blue)' }} />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h1
                  className="text-sm font-semibold tracking-tight whitespace-nowrap"
                  style={{ color: 'var(--text-primary)' }}
                >
                  Variational Protocol
                </h1>
                <span
                  className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md tracking-wider uppercase"
                  style={{
                    backgroundColor: 'var(--accent-blue-bg)',
                    color: 'var(--accent-blue)',
                    border: '1px solid var(--accent-blue-bg)',
                  }}
                >
                  Arbitrum
                </span>
              </div>
              <p className="text-[11px] leading-none mt-0.5 hidden sm:block" style={{ color: 'var(--text-muted)' }}>
                USDC Flow Analytics
              </p>
            </div>
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2 flex-shrink-0">
            {lastUpdated && (
              <span className="text-[11px] hidden md:block" style={{ color: 'var(--text-muted)' }}>
                Updated {lastUpdated}
              </span>
            )}

            {/* Divider */}
            <div className="hidden md:block w-px h-4" style={{ backgroundColor: 'var(--border-default)' }} />

            {/* Refresh */}
            <button
              onClick={() => forceRefresh()}
              disabled={isRefreshing}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
            >
              <RefreshCw className={`w-3.5 h-3.5 flex-shrink-0 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">{isRefreshing ? 'Refreshing…' : 'Refresh'}</span>
            </button>

            {/* Theme toggle */}
            <button
              onClick={() => setIsDark(!isDark)}
              className="flex items-center justify-center w-8 h-8 rounded-lg cursor-pointer"
              style={{
                backgroundColor: 'var(--bg-input)',
                color: 'var(--text-secondary)',
                border: '1px solid var(--border-default)',
              }}
              aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            >
              {isDark
                ? <Sun className="w-3.5 h-3.5" />
                : <Moon className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </header>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-4">

        {/* Section label */}
        <div className="flex items-center gap-2 pt-1 pb-0.5">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Key Metrics
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* KPI Row 1 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoading ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <div className="animate-fade-in stagger-1">
                <KpiCard
                  label="Monthly Deposits"
                  value={formatUSD(latest?.monthlyTotalDeposits ?? 0)}
                  icon={<ArrowDownToLine className="w-3.5 h-3.5" />}
                  accentColor="emerald"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-2">
                <KpiCard
                  label="Monthly Withdrawals"
                  value={formatUSD(latest?.monthlyTotalWithdrawals ?? 0)}
                  icon={<ArrowUpFromLine className="w-3.5 h-3.5" />}
                  accentColor="red"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-3">
                <KpiCard
                  label="Avg Daily Deposit"
                  value={formatUSD(latest?.avgDepositPerDay30d ?? 0)}
                  icon={<TrendingUp className="w-3.5 h-3.5" />}
                  accentColor="blue"
                  subtitle="30-day rolling average"
                />
              </div>
              <div className="animate-fade-in stagger-4">
                <KpiCard
                  label="Avg Daily Withdrawal"
                  value={formatUSD(latest?.avgWithdrawalPerDay30d ?? 0)}
                  icon={<Activity className="w-3.5 h-3.5" />}
                  accentColor="amber"
                  subtitle="30-day rolling average"
                />
              </div>
            </>
          )}
        </div>

        {/* KPI Row 2 */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {isLoading ? (
            <><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /><KpiSkeleton /></>
          ) : (
            <>
              <div className="animate-fade-in stagger-5">
                <KpiCard
                  label="24h Deposit Volume"
                  value={formatUSD(latest?.dailyDepositVol ?? 0)}
                  icon={<ArrowDownToLine className="w-3.5 h-3.5" />}
                  accentColor="emerald"
                  trend={(latest?.dailyDepositVol ?? 0) > (latest?.avgDepositPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-6">
                <KpiCard
                  label="24h Withdrawal Volume"
                  value={formatUSD(latest?.dailyWithdrawalVol ?? 0)}
                  icon={<ArrowUpFromLine className="w-3.5 h-3.5" />}
                  accentColor="red"
                  trend={(latest?.dailyWithdrawalVol ?? 0) > (latest?.avgWithdrawalPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-7">
                <KpiCard
                  label="Avg Deposit / Wallet / Day"
                  value={formatUSD(latest?.avgDepositSizePerWallet ?? 0)}
                  icon={<Wallet className="w-3.5 h-3.5" />}
                  accentColor="amber"
                  subtitle="Per unique depositor today"
                />
              </div>
              <div className="animate-fade-in stagger-8">
                <KpiCard
                  label="Avg Withdrawal / Wallet / Day"
                  value={formatUSD(latest?.avgWithdrawalSizePerWallet ?? 0)}
                  icon={<Wallet className="w-3.5 h-3.5" />}
                  accentColor="red"
                  subtitle="Per unique withdrawer today"
                />
              </div>
            </>
          )}
        </div>

        {/* Section label */}
        <div className="flex items-center gap-2 pt-2 pb-0.5">
          <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
            Charts
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
        </div>

        {/* Charts */}
        {isLoading ? (
          <div className="space-y-4">
            <ChartSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <VolumeChart data={data} isDark={isDark} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <NetFlowChart data={data} isDark={isDark} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.45s' }}>
                <WalletAvgChart data={data} isDark={isDark} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Section label */}
        {!isLoading && data && (
          <div className="flex items-center gap-2 pt-2 pb-0.5">
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>
              Historical Data
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: 'var(--border-default)' }} />
          </div>
        )}

        {/* Daily Stats Table */}
        {!isLoading && data && (
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <DailyStatsTable data={data} />
          </div>
        )}

        {/* Footer */}
        <footer className="pt-6 pb-8" style={{ borderTop: '1px solid var(--border-default)' }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px]" style={{ color: 'var(--text-muted)' }}>
            <span>Data source: Dune Analytics · Query #6724387</span>
            <span className="font-mono text-[10px]">
              Factory 0x84BE…6172 · OLP Vault 0x74bb…f2cd
            </span>
          </div>
        </footer>
      </main>
    </div>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Dashboard />
    </QueryClientProvider>
  )
}
