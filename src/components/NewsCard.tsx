import React, { useState } from 'react';
import {
  Box,
  Image,
  Text,
  Heading,
  Stack,
  Badge,
  Flex,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { NewsItem } from '../types';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'easy':
        return 'green';
      case 'medium':
        return 'orange';
      case 'hard':
        return 'red';
      default:
        return 'gray';
    }
  };

  // Hàm để chuyển đổi HTML thành text thuần túy
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  // Lấy mô tả ngắn từ body
  const getShortDescription = (body: string) => {
    const plainText = stripHtml(body);
    return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText;
  };

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      transition="all 0.3s"
      _hover={{ transform: 'translateY(-4px)', boxShadow: 'lg' }}
    >
      {news.value.image && (
        <Image
          src={news.value.image}
          alt={news.value.title}
          objectFit="cover"
          height="200px"
          width="100%"
        />
      )}

      <Box p={4}>
        <Stack direction="row" spacing={2} mb={2}>
          <Badge colorScheme={getTypeColor(news.value.type)}>
            {news.value.type.toUpperCase()}
          </Badge>
          <Badge colorScheme="blue">{news.value.kind}</Badge>
          <Badge colorScheme="purple">{news.value.source}</Badge>
        </Stack>

        <Heading as="h3" size="md" mb={2} dangerouslySetInnerHTML={{ __html: news.value.title }} />
        
        <Box mb={4}>
          <Text fontSize="md" mb={2} dangerouslySetInnerHTML={{ __html: news.value.desc }} />
          
          {showFullContent ? (
            <Box mt={4} dangerouslySetInnerHTML={{ __html: news.value.body }} />
          ) : (
            <Text fontSize="sm" color="gray.600" mt={2}>
              {getShortDescription(news.value.body)}
            </Text>
          )}
        </Box>

        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.500">
            {new Date(news.value.date).toLocaleDateString()}
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? 'Show Less' : 'Read More'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewsCard; 