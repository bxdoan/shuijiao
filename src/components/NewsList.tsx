import React, { useEffect } from 'react';
import { SimpleGrid, Box, Spinner, Text, Center } from '@chakra-ui/react';
import { useNews } from '../hooks/useNews';
import NewsCard from './NewsCard';
import { NewsFilterParams } from '../types';

interface NewsListProps {
  filters: NewsFilterParams;
}

const NewsList: React.FC<NewsListProps> = ({ filters }) => {
  const { data, isLoading, isError, error } = useNews(filters);

  useEffect(() => {
    console.log('NewsList data:', data);
    if (isError) {
      console.error('NewsList error:', error);
    }
  }, [data, isError, error]);

  if (isLoading) {
    return (
      <Center py={10}>
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (isError) {
    return (
      <Center py={10}>
        <Text color="red.500">Error loading news. Please try again later.</Text>
      </Center>
    );
  }

  if (!data || !data.data || data.data.length === 0) {
    return (
      <Center py={10}>
        <Text>No news found. Try changing your filters.</Text>
      </Center>
    );
  }

  return (
    <Box py={4}>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
        {data.data.map((news) => (
          <NewsCard key={news.id} news={news} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NewsList; 