// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
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
  useToast,
} from '@chakra-ui/react';
import { NewsItem } from '../types';
import { fetchTranslation } from '../api/newsApi';

interface NewsCardProps {
  news: NewsItem;
}

const NewsCard: React.FC<NewsCardProps> = ({ news }) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<Record<string, string> | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();

  // Đảm bảo news.value tồn tại để tránh lỗi
  const newsValue = news?.value || {};
  const imageUrl = typeof newsValue.image === 'string' ? newsValue.image : '';
  const title = typeof newsValue.title === 'string' ? newsValue.title : '';
  const type = typeof newsValue.type === 'string' ? newsValue.type : '';
  const kind = typeof newsValue.kind === 'string' ? newsValue.kind : '';
  const source = typeof newsValue.source === 'string' ? newsValue.source : '';
  const desc = typeof newsValue.desc === 'string' ? newsValue.desc : '';
  const body = typeof newsValue.body === 'string' ? newsValue.body : '';
  const date = newsValue.date || '';
  const id = news?.id || '';

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

  // Chuyển đổi tên độ khó sang tiếng Việt
  const getVietnameseType = (type: string) => {
    switch (type.toLowerCase()) {
      case 'easy':
        return 'DỄ';
      case 'medium':
        return 'TRUNG BÌNH';
      case 'hard':
        return 'KHÓ';
      default:
        return type.toUpperCase();
    }
  };

  // Hàm gọi API dịch
  const translateNews = async () => {
    if (!id) {
      toast({
        title: "Lỗi",
        description: "Không tìm thấy ID của bài viết",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsTranslating(true);
    setShowTranslation(true);

    try {
      // Sử dụng hàm fetchTranslation từ newsApi.ts
      const translationContent = await fetchTranslation(id, 'vi');

      if (translationContent) {
        setTranslation(translationContent);
      } else {
        toast({
          title: "Không có bản dịch",
          description: "Không tìm thấy bản dịch cho bài viết này",
          status: "info",
          duration: 3000,
          isClosable: true,
        });
      }
    } catch (error) {
      console.error("Error translating news:", error);
      toast({
        title: "Lỗi dịch",
        description: "Có lỗi xảy ra khi lấy bản dịch",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsTranslating(false);
    }
  };

  // Hàm chia văn bản thành các câu
  const splitTextIntoSentences = (text: string) => {
    // Đơn giản hóa việc chia câu, tránh regex phức tạp
    // Chia theo các dấu chấm câu phổ biến
    const sentences: string[] = [];
    let currentSentence = '';
    
    for (let i = 0; i < text.length; i++) {
      currentSentence += text[i];
      
      // Kiểm tra nếu đây là dấu kết thúc câu và ký tự tiếp theo là khoảng trắng hoặc hết chuỗi
      if (
        (text[i] === '.' || text[i] === '!' || text[i] === '?' || 
         text[i] === '。' || text[i] === '！' || text[i] === '？') && 
        (i === text.length - 1 || text[i + 1] === ' ')
      ) {
        sentences.push(currentSentence.trim());
        currentSentence = '';
      }
    }
    
    // Thêm phần cuối nếu còn
    if (currentSentence.trim()) {
      sentences.push(currentSentence.trim());
    }
    
    return sentences;
  };

  // Hàm để hiển thị nội dung xen kẽ gốc và dịch
  const renderInterleavedContent = () => {
    if (!body || !translation) return null;

    // Tách body thành các câu
    const bodySentences = splitTextIntoSentences(stripHtml(body));
    
    // Tạo mảng các cặp câu (gốc, dịch)
    const pairs = [];
    for (let i = 0; i < bodySentences.length; i++) {
      if (translation[i]) {
        pairs.push({
          original: bodySentences[i],
          translated: translation[i]
        });
      }
    }

    return (
      <Box>
        {pairs.map((pair, index) => (
          <Box key={index} mb={3}>
            <Text fontWeight="medium">{pair.original}</Text>
            <Text color="blue.600" fontStyle="italic">{pair.translated}</Text>
          </Box>
        ))}
      </Box>
    );
  };

  // Tách phần render hình ảnh thành hàm riêng
  // @ts-ignore - Union type too complex issue
  const renderNewsImage = () => {
    if (!imageUrl) return null;
    
    // @ts-ignore - Suppress complex union type error
    return (
      <Image
        src={imageUrl as string}
        alt={title as string}
        objectFit="cover"
        height="200px"
        width="100%"
      />
    );
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
      {renderNewsImage()}

      <Box p={4}>
        <Stack direction="row" spacing={2} mb={2} alignItems="center">
          <Badge colorScheme={getTypeColor(type)}>
            {getVietnameseType(type)}
          </Badge>
          <Badge colorScheme="blue">{kind}</Badge>
          <Badge colorScheme="purple">{source}</Badge>
          <Box ml="auto">
            <Button
              size="xs"
              colorScheme="teal"
              isLoading={isTranslating}
              loadingText="Đang dịch..."
              onClick={translateNews}
            >
              {showTranslation && translation ? "Đã dịch" : "Dịch"}
            </Button>
          </Box>
        </Stack>

        <Heading as="h3" size="md" mb={2} dangerouslySetInnerHTML={{ __html: title }} />
        
        <Box mb={4}>
          <Text fontSize="md" mb={2} dangerouslySetInnerHTML={{ __html: desc }} />
          
          {showFullContent ? (
            showTranslation && translation ? (
              renderInterleavedContent()
            ) : (
              <Box mt={4} dangerouslySetInnerHTML={{ __html: body }} />
            )
          ) : (
            <Text 
              fontSize="sm" 
              color="gray.600" 
              mt={2} 
              dangerouslySetInnerHTML={{ __html: getShortDescription(body) }}
            />
          )}
        </Box>

        <Flex justifyContent="space-between" alignItems="center">
          <Text fontSize="sm" color="gray.500">
            {new Date(date).toLocaleDateString()}
          </Text>
          <Button
            size="sm"
            colorScheme="blue"
            variant="outline"
            onClick={() => setShowFullContent(!showFullContent)}
          >
            {showFullContent ? 'Thu gọn' : 'Đọc thêm'}
          </Button>
        </Flex>
      </Box>
    </Box>
  );
};

export default NewsCard; 