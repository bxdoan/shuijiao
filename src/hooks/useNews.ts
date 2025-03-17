import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../api/newsApi';
import { NewsFilterParams } from '../types';

export const useNews = (params: NewsFilterParams = {}) => {
  return useQuery({
    queryKey: ['news', params],
    queryFn: () => fetchNews(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2
  });
}; 