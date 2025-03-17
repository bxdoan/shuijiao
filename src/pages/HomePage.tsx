import React, { useState, useEffect } from 'react';
import { Box, Container, Heading, Text, Alert, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import NewsFilter from '../components/NewsFilter';
import NewsList from '../components/NewsList';
import Pagination from '../components/Pagination';
import { NewsFilterParams } from '../types';
import { useNews } from '../hooks/useNews';

const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<NewsFilterParams>({
    topic: '',
    source: '',
    type: 'easy',
    page: 1,
    limit: 9,
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString().split('T')[0],
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');

  const { data, isError, error } = useNews(filters);
  const totalPages = data && data.total ? Math.ceil(data.total / (filters.limit || 9)) : 0;

  useEffect(() => {
    if (isError && error) {
      setShowAlert(true);
      setAlertMessage('Error loading news. Please try again later.');
      console.error('HomePage error:', error);
    }
  }, [isError, error]);

  const handleFilterChange = (newFilters: NewsFilterParams) => {
    setFilters({ ...filters, ...newFilters, page: 1 });
  };

  const handlePageChange = (page: number) => {
    setFilters({ ...filters, page });
  };

  return (
    <Container maxW="container.xl" py={8}>
      {showAlert && (
        <Box bg="red.500" color="white" p={4} mb={4} borderRadius="md" position="relative">
          <Heading as="h3" size="md">Error!</Heading>
          <Text>{alertMessage}</Text>
          <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowAlert(false)} />
        </Box>
      )}

      <Box textAlign="center" mb={8}>
        <Heading as="h1" size="2xl" mb={2}>
          Kim Én Chinese
        </Heading>
        <Text fontSize="lg" color="gray.600">
          Learn Chinese with real-world news articles
        </Text>
      </Box>

      <NewsFilter filters={filters} onFilterChange={handleFilterChange} />
      <NewsList filters={filters} />
      
      {totalPages > 1 && (
        <Pagination
          currentPage={filters.page || 1}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </Container>
  );
};

export default HomePage; 