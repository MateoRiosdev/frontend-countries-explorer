import { useQuery } from '@tanstack/react-query'
import { fetchCountryByCode, fetchCountriesByCodes } from '../api/countries'

export function useCountryDetail(code) {
  return useQuery({
    queryKey: ['country', code],
    queryFn: () => fetchCountryByCode(code),
    enabled: !!code,
    staleTime: 1000 * 60 * 10,
  })
}

export function useBorderCountries(borders) {
  return useQuery({
    queryKey: ['borders', borders],
    queryFn: () => fetchCountriesByCodes(borders),
    enabled: !!borders && borders.length > 0,
    staleTime: 1000 * 60 * 10,
  })
}
