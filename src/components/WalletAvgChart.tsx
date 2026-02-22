import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface WalletAvgChartProps {
  data: DailyStats[]
}

const LABEL_MAP: Record<string, string> = {
  avgDepositSizePerWallet: 'Avg Deposit/Wallet',
}

export function WalletAvgChart({ data }: WalletAvgChartProps) {
  const chartData = [...data].reverse()

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Avg Deposit Size Per Wallet Per Day
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
          <XAxis
            dataKey="day"
            tickFormatter={formatDate}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatUSDCompact}
            stroke="#6b7280"
            tick={{ fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={60}
          />
          <Tooltip content={<ChartTooltip labelMap={LABEL_MAP} />} />
          <Line
            type="monotone"
            dataKey="avgDepositSizePerWallet"
            stroke="#fbbf24"
            strokeWidth={2}
            dot={false}
            activeDot={{ r: 4, fill: '#fbbf24' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
