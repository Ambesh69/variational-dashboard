import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface VolumeChartProps {
  data: DailyStats[]
}

const LABEL_MAP: Record<string, string> = {
  dailyDepositVol: 'Deposits',
  dailyWithdrawalVol: 'Withdrawals',
}

export function VolumeChart({ data }: VolumeChartProps) {
  const chartData = [...data].reverse()

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Daily Deposit & Withdrawal Volume
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="depositGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10b981" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="withdrawGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f87171" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#f87171" stopOpacity={0} />
            </linearGradient>
          </defs>
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
          <Legend
            formatter={(value: string) => LABEL_MAP[value] ?? value}
            wrapperStyle={{ fontSize: 12, color: '#9ca3af' }}
          />
          <Area
            type="monotone"
            dataKey="dailyDepositVol"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#depositGrad)"
          />
          <Area
            type="monotone"
            dataKey="dailyWithdrawalVol"
            stroke="#f87171"
            strokeWidth={2}
            fill="url(#withdrawGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
