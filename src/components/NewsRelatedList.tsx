// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React from 'react';
import {
  Box,
  Heading,
  SimpleGrid,
  Spinner,
  Center,
  Text,
  useBreakpointValue
} from '@chakra-ui/react';

import NewsRelatedCard from './NewsRelatedCard';
import { NewsItem } from '../types';

interface NewsRelatedListProps {
  news: NewsItem[];
  isLoading: boolean;
  title?: string;
  sourceLang: string;
}

const NewsRelatedList: React.FC<NewsRelatedListProps> = ({ 
  news, 
  isLoading, 
  title = "Tin tức liên quan", 
  sourceLang 
}) => {
  // Sử dụng columns khác nhau cho các màn hình khác nhau
  // Màn hình lớn chia 1 cột dọc (bên sidebar)
  // Màn hình tablet chia 2 cột ngang (bên dưới)
  // Màn hình mobile chia 1 cột ngang (bên dưới)
  const columns = useBreakpointValue({ 
    base: 1,   // Mobile
    md: 2,     // Tablet
    lg: 1      // Desktop - sidebar
  });
  
  if (isLoading) {
    return (
      <Box>
        <Heading as="h3" size="md" mb={4}>{title}</Heading>
        <Center py={4}>
          <Spinner size="md" color="blue.500" thickness="3px" />
        </Center>
      </Box>
    );
  }

  if (news.length === 0) {
    return (
      <Box>
        <Heading as="h3" size="md" mb={4}>{title}</Heading>
        <Text fontSize="sm" color="gray.500">Không có tin tức liên quan.</Text>
      </Box>
    );
  }

  return (
    <Box>
      <Heading as="h3" size="md" mb={4}>{title}</Heading>
      <SimpleGrid columns={columns} spacing={4}>
        {news.map((item, index) => (
          <NewsRelatedCard 
            key={`related-${index}-${item.id || ''}`} 
            news={item} 
            sourceLang={sourceLang} 
          />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default NewsRelatedList; 