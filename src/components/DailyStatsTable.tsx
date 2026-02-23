import { useState } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import type { DailyStats } from '@/lib/types'
import { formatUSD, formatDateFull } from '@/lib/format'

const PAGE_SIZE = 20

interface Props {
  data: DailyStats[]
}

export function DailyStatsTable({ data }: Props) {
  const [page, setPage] = useState(0)

  const totalPages = Math.ceil(data.length / PAGE_SIZE)
  const pageData = data.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE)
  const start = page * PAGE_SIZE + 1
  const end = Math.min((page + 1) * PAGE_SIZE, data.length)

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold text-gray-200">Daily Stats</h2>
          <p className="text-xs text-gray-500 mt-0.5">All recorded days, most recent first</p>
        </div>
        {totalPages > 1 && (
          <span className="text-xs text-gray-500">
            {start}–{end} of {data.length}
          </span>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-800 bg-gray-900/80">
              <th className="text-left px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Date</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Daily Deposits</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Daily Withdrawals</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Net Flow</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Mo. Deposits</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Mo. Withdrawals</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Avg Dep/Day (30d)</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Avg Wdw/Day (30d)</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Avg Dep/Wallet</th>
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Avg Wdw/Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {pageData.map((row) => (
              <tr key={row.day} className="hover:bg-gray-800/40 transition-colors">
                <td className="px-4 py-2.5 text-gray-300 whitespace-nowrap font-medium">
                  {formatDateFull(row.day)}
                </td>
                <td className="px-4 py-2.5 text-right text-emerald-400 whitespace-nowrap">
                  {formatUSD(row.dailyDepositVol)}
                </td>
                <td className="px-4 py-2.5 text-right text-red-400 whitespace-nowrap">
                  {formatUSD(row.dailyWithdrawalVol)}
                </td>
                <td className={`px-4 py-2.5 text-right whitespace-nowrap font-medium ${row.netFlow >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {row.netFlow >= 0 ? '+' : ''}{formatUSD(row.netFlow)}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-300 whitespace-nowrap">
                  {formatUSD(row.monthlyTotalDeposits)}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-300 whitespace-nowrap">
                  {formatUSD(row.monthlyTotalWithdrawals)}
                </td>
                <td className="px-4 py-2.5 text-right text-blue-400 whitespace-nowrap">
                  {formatUSD(row.avgDepositPerDay30d)}
                </td>
                <td className="px-4 py-2.5 text-right text-amber-400 whitespace-nowrap">
                  {formatUSD(row.avgWithdrawalPerDay30d)}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-300 whitespace-nowrap">
                  {formatUSD(row.avgDepositSizePerWallet)}
                </td>
                <td className="px-4 py-2.5 text-right text-gray-300 whitespace-nowrap">
                  {formatUSD(row.avgWithdrawalSizePerWallet)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {totalPages > 1 && (
        <div className="px-5 py-3 border-t border-gray-800 flex items-center justify-between">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            Previous
          </button>
          <div className="flex items-center gap-1">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-7 h-7 rounded text-xs transition-colors ${
                  i === page
                    ? 'bg-blue-500/20 text-blue-400 font-medium'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800'
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-gray-100 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            Next
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  )
}
