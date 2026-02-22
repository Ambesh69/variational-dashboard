import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { ReactNode } from 'react'

interface KpiCardProps {
  label: string
  value: string
  icon: ReactNode
  trend?: 'up' | 'down' | 'neutral'
  subtitle?: string
  accentColor?: 'emerald' | 'red' | 'blue' | 'amber'
}

const accentStyles = {
  emerald: 'text-emerald-400',
  red: 'text-red-400',
  blue: 'text-blue-400',
  amber: 'text-amber-400',
} as const

const iconBgStyles = {
  emerald: 'bg-emerald-500/10',
  red: 'bg-red-500/10',
  blue: 'bg-blue-500/10',
  amber: 'bg-amber-500/10',
} as const

export function KpiCard({
  label,
  value,
  icon,
  trend,
  subtitle,
  accentColor = 'emerald',
}: KpiCardProps) {
  return (
    <div className="rounded-xl border border-gray-800 bg-gray-900 p-5 flex flex-col gap-3 hover:border-gray-700 transition-colors">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-400">{label}</span>
        <div className={`p-2 rounded-lg ${iconBgStyles[accentColor]}`}>
          <span className={accentStyles[accentColor]}>{icon}</span>
        </div>
      </div>
      <div className="flex items-end gap-2">
        <span className="text-2xl font-bold text-gray-50 tracking-tight">{value}</span>
        {trend && (
          <span className="mb-1">
            {trend === 'up' && <TrendingUp className="w-4 h-4 text-emerald-400" />}
            {trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400" />}
            {trend === 'neutral' && <Minus className="w-4 h-4 text-gray-500" />}
          </span>
        )}
      </div>
      {subtitle && (
        <span className="text-xs text-gray-500">{subtitle}</span>
      )}
    </div>
  )
}
