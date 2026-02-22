import type { DuneApiResponse, DuneRow, DailyStats } from './types'

const DUNE_API_BASE = 'https://api.dune.com/api/v1'
const QUERY_ID = 6724387

function getApiKey(): string {
  const key = import.meta.env.VITE_DUNE_API_KEY
  if (!key) throw new Error('VITE_DUNE_API_KEY is not set')
  return key
}

export async function getQueryResults(): Promise<DuneApiResponse> {
  const res = await fetch(`${DUNE_API_BASE}/query/${QUERY_ID}/results?limit=500`, {
    headers: {
      'X-DUNE-API-KEY': getApiKey(),
    },
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`Dune API error (${res.status}): ${text}`)
  }

  return res.json()
}

export function transformRows(rows: DuneRow[]): DailyStats[] {
  return rows.map((row) => ({
    day: row.day,
    dailyDepositVol: row.daily_deposit_volume_24h ?? 0,
    dailyWithdrawalVol: row.daily_withdrawal_volume_24h ?? 0,
    monthlyTotalDeposits: row.monthly_total_deposits ?? 0,
    monthlyTotalWithdrawals: row.monthly_total_withdrawals ?? 0,
    avgDepositPerDay30d: row.avg_deposit_per_day_30d ?? 0,
    avgWithdrawalPerDay30d: row.avg_withdrawal_per_day_30d ?? 0,
    avgDepositSizePerWallet: row.avg_deposit_size_per_wallet ?? 0,
    netFlow: (row.daily_deposit_volume_24h ?? 0) - (row.daily_withdrawal_volume_24h ?? 0),
  }))
}
