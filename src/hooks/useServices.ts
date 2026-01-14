import { useQuery } from '@tanstack/react-query';
import { getServices } from '../lib/api';
import type { Service } from '../pages/booking/types';

export function useServices() {
  return useQuery<Service[], Error>({
    queryKey: ['services'],
    queryFn: getServices,
    staleTime: 1000 * 60 * 5,
  });
}
