import { useQuery } from '@tanstack/react-query'
import { fetchAllCountries } from '../api/countries'

export function useCountries() {
  return useQuery({
    queryKey: ['countries'],
    queryFn: fetchAllCountries,
    staleTime: 1000 * 60 * 10,
  })
}
