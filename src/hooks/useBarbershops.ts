import { useQuery } from '@tanstack/react-query';
import { getBarbershops } from '../lib/api';
import type { Barbershop } from '../pages/booking/types';

export function useBarbershops() {
  return useQuery<Barbershop[], Error>({
    queryKey: ['barbershops'],
    queryFn: getBarbershops,
    staleTime: 1000 * 60 * 5,
  });
}
