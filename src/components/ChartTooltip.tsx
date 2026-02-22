import { formatUSD, formatDateFull } from '@/lib/format'

interface TooltipPayload {
  value: number
  name: string
  color: string
}

interface ChartTooltipProps {
  active?: boolean
  payload?: TooltipPayload[]
  label?: string
  labelMap?: Record<string, string>
}

export function ChartTooltip({ active, payload, label, labelMap }: ChartTooltipProps) {
  if (!active || !payload?.length) return null

  return (
    <div className="rounded-lg border border-gray-700 bg-gray-900 px-4 py-3 shadow-xl">
      <p className="text-xs text-gray-400 mb-2">{label ? formatDateFull(label) : ''}</p>
      {payload.map((entry, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <span
            className="w-2 h-2 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-gray-300">
            {labelMap?.[entry.name] ?? entry.name}:
          </span>
          <span className="font-semibold text-gray-50">
            {formatUSD(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
