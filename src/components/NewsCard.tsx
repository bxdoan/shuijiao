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
    // Đơn giản hóa: Giữ nguyên HTML và chỉ giới hạn độ dài
    // Sử dụng một giới hạn lớn hơn cho HTML vì HTML có thể dài hơn văn bản thuần túy
    const maxLength = 500;
    
    if (body.length <= maxLength) return body;
    
    // Tìm vị trí an toàn để cắt (sau thẻ đóng gần nhất)
    let cutIndex = maxLength;
    
    // Tìm thẻ đóng gần nhất sau vị trí cắt
    const nextClosingTagIndex = body.indexOf('>', cutIndex);
    if (nextClosingTagIndex !== -1) {
      cutIndex = nextClosingTagIndex + 1;
    }
    
    // Tìm thẻ mở gần nhất trước vị trí cắt
    const lastOpeningTagIndex = body.lastIndexOf('<', cutIndex);
    
    // Nếu có thẻ mở nhưng không có thẻ đóng tương ứng, cắt trước thẻ mở
    if (lastOpeningTagIndex > body.lastIndexOf('>', lastOpeningTagIndex) && lastOpeningTagIndex < cutIndex) {
      cutIndex = lastOpeningTagIndex;
    }
    
    return body.substring(0, cutIndex) + '...';
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
            <Text 
              fontSize="sm" 
              color="gray.600" 
              mt={2} 
              dangerouslySetInnerHTML={{ __html: getShortDescription(news.value.body) }}
            />
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