import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { messages } from '../messages';

export const useFetchUrls = (): UseQueryResult<any, Error> => {
  const data = useQuery({
    queryKey: ['urls'],
    refetchInterval: 500,
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/urls');
      if (!res.ok) throw new Error(messages.fetchError);
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
  return data;
};
