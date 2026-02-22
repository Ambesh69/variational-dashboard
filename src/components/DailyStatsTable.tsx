import type { DailyStats } from '@/lib/types'
import { formatUSD, formatDateFull } from '@/lib/format'

interface Props {
  data: DailyStats[]
}

export function DailyStatsTable({ data }: Props) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900/50 overflow-hidden">
      <div className="px-5 py-4 border-b border-gray-800">
        <h2 className="text-sm font-semibold text-gray-200">Daily Stats</h2>
        <p className="text-xs text-gray-500 mt-0.5">All recorded days, most recent first</p>
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
              <th className="text-right px-4 py-3 text-gray-500 font-medium whitespace-nowrap">Avg/Wallet</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-800/60">
            {data.map((row) => (
              <tr
                key={row.day}
                className="hover:bg-gray-800/40 transition-colors"
              >
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
