import { useQuery, type UseQueryResult } from '@tanstack/react-query';

export const useFetchUrls = (): UseQueryResult<any, Error> => {
  const data = useQuery({
    queryKey: ['urls'],
    queryFn: async () => {
      const res = await fetch('http://localhost:8080/urls');
      if (!res.ok) throw new Error('Failed to fetch URLs');
      return res.json();
    },
    refetchOnWindowFocus: false,
  });
  return data;
};
