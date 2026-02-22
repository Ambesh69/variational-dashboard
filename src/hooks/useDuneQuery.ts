import { useQuery } from '@tanstack/react-query'
import { getQueryResults, transformRows } from '@/lib/dune'
import type { DailyStats } from '@/lib/types'

export function useDuneQuery() {
  return useQuery<DailyStats[]>({
    queryKey: ['variational-flows'],
    queryFn: async () => {
      const response = await getQueryResults()
      const rows = response.result?.rows ?? []
      return transformRows(rows)
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchInterval: 10 * 60 * 1000, // 10 minutes
    retry: 2,
  })
}
