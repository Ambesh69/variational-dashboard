import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { DailyStats } from '@/lib/types'
import { formatDate, formatUSDCompact } from '@/lib/format'
import { ChartTooltip } from './ChartTooltip'

interface NetFlowChartProps {
  data: DailyStats[]
}

const LABEL_MAP: Record<string, string> = {
  cumulativeNetFlow: 'Cumulative Net Flow',
}

export function NetFlowChart({ data }: NetFlowChartProps) {
  const reversed = [...data].reverse()

  let cumulative = 0
  const chartData = reversed.map((d) => {
    cumulative += d.netFlow
    return { ...d, cumulativeNetFlow: cumulative }
  })

  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5">
      <h3 className="text-sm font-semibold text-gray-300 mb-4">
        Cumulative Net Flow (Deposits - Withdrawals)
      </h3>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={chartData} margin={{ top: 4, right: 4, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="netFlowGradPos" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
              <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
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
          <ReferenceLine y={0} stroke="#374151" strokeDasharray="3 3" />
          <Area
            type="monotone"
            dataKey="cumulativeNetFlow"
            stroke="#3b82f6"
            strokeWidth={2}
            fill="url(#netFlowGradPos)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
