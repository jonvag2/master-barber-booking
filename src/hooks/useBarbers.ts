import { useQuery } from '@tanstack/react-query';
import { getBarbers } from '../lib/api';
import type { Barber } from '../pages/booking/types';

export function useBarbers() {
  return useQuery<Barber[], Error>({
    queryKey: ['barbers'],
    queryFn: getBarbers,
    staleTime: 1000 * 60 * 5,
  });
}
