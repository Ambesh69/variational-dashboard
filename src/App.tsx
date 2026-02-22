import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Activity,
  TrendingUp,
  Wallet,
  BarChart3,
  RefreshCw,
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
  const { data, isLoading, error, refetch, dataUpdatedAt } = useDuneQuery()

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
        onRetry={() => refetch()}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gray-950">
      {/* Header */}
      <header className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <BarChart3 className="w-5 h-5 text-blue-400" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-50 tracking-tight">
                Variational Protocol
              </h1>
              <p className="text-xs text-gray-500">USDC Flow Analytics — Arbitrum</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {lastUpdated && (
              <span className="text-xs text-gray-500 hidden sm:block">
                Updated {lastUpdated}
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 hover:text-gray-100 transition-colors text-sm cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Refresh</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* KPI Row 1: Monthly totals + 30d averages */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {isLoading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <div className="animate-fade-in stagger-1">
                <KpiCard
                  label="Monthly Deposits"
                  value={formatUSD(latest?.monthlyTotalDeposits ?? 0)}
                  icon={<ArrowDownToLine className="w-4 h-4" />}
                  accentColor="emerald"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-2">
                <KpiCard
                  label="Monthly Withdrawals"
                  value={formatUSD(latest?.monthlyTotalWithdrawals ?? 0)}
                  icon={<ArrowUpFromLine className="w-4 h-4" />}
                  accentColor="red"
                  subtitle="Current month total"
                />
              </div>
              <div className="animate-fade-in stagger-3">
                <KpiCard
                  label="Avg Daily Deposit"
                  value={formatUSD(latest?.avgDepositPerDay30d ?? 0)}
                  icon={<TrendingUp className="w-4 h-4" />}
                  accentColor="blue"
                  subtitle="30-day rolling average"
                />
              </div>
              <div className="animate-fade-in stagger-4">
                <KpiCard
                  label="Avg Daily Withdrawal"
                  value={formatUSD(latest?.avgWithdrawalPerDay30d ?? 0)}
                  icon={<Activity className="w-4 h-4" />}
                  accentColor="amber"
                  subtitle="30-day rolling average"
                />
              </div>
            </>
          )}
        </div>

        {/* KPI Row 2: 24h volumes + wallet avg */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            <>
              <KpiSkeleton />
              <KpiSkeleton />
              <KpiSkeleton />
            </>
          ) : (
            <>
              <div className="animate-fade-in stagger-5">
                <KpiCard
                  label="24h Deposit Volume"
                  value={formatUSD(latest?.dailyDepositVol ?? 0)}
                  icon={<ArrowDownToLine className="w-4 h-4" />}
                  accentColor="emerald"
                  trend={(latest?.dailyDepositVol ?? 0) > (latest?.avgDepositPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-6">
                <KpiCard
                  label="24h Withdrawal Volume"
                  value={formatUSD(latest?.dailyWithdrawalVol ?? 0)}
                  icon={<ArrowUpFromLine className="w-4 h-4" />}
                  accentColor="red"
                  trend={(latest?.dailyWithdrawalVol ?? 0) > (latest?.avgWithdrawalPerDay30d ?? 0) ? 'up' : 'down'}
                  subtitle="vs 30d avg"
                />
              </div>
              <div className="animate-fade-in stagger-7 col-span-2 lg:col-span-1">
                <KpiCard
                  label="Avg Deposit / Wallet / Day"
                  value={formatUSD(latest?.avgDepositSizePerWallet ?? 0)}
                  icon={<Wallet className="w-4 h-4" />}
                  accentColor="amber"
                  subtitle="Per unique depositor today"
                />
              </div>
            </>
          )}
        </div>

        {/* Charts */}
        {isLoading ? (
          <div className="space-y-6">
            <ChartSkeleton />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ChartSkeleton />
              <ChartSkeleton />
            </div>
          </div>
        ) : data ? (
          <div className="space-y-6">
            <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
              <VolumeChart data={data} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="animate-fade-in" style={{ animationDelay: '0.4s' }}>
                <NetFlowChart data={data} />
              </div>
              <div className="animate-fade-in" style={{ animationDelay: '0.45s' }}>
                <WalletAvgChart data={data} />
              </div>
            </div>
          </div>
        ) : null}

        {/* Daily Stats Table */}
        {!isLoading && data && (
          <div className="animate-fade-in" style={{ animationDelay: '0.5s' }}>
            <DailyStatsTable data={data} />
          </div>
        )}

        {/* Footer */}
        <footer className="border-t border-gray-800 pt-4 pb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-gray-600">
            <span>
              Data source: Dune Analytics (Query #6724387)
            </span>
            <span>
              Contracts: Factory 0x84BE...6172 &middot; OLP Vault 0x74bb...f2cd
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
