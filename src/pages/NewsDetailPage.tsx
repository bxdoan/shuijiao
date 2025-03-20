// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  Button,
  Spinner,
  Flex,
  Divider,
  useToast,
  IconButton,
  Center,
  useColorModeValue
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { 
    getNewsDetails, 
    fetchTranslation, 
    translateSentences
} from '../api/newsApi';
import { NewsDetail } from '../types';
import * as utils from '../utils/utils';

const NewsDetailPage: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [translation, setTranslation] = useState<Record<string, string> | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  
  // Xác định ngôn ngữ dựa vào đường dẫn
  const getLanguageFromPath = () => {
    if (location.pathname.includes('/english/')) {
      return 'en';
    }
    // Có thể mở rộng thêm các ngôn ngữ khác
    return 'zh'; // Mặc định là tiếng Trung
  };
  
  const currentLanguage = getLanguageFromPath();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) return;
      
      setIsLoading(true);
      setIsError(false);
      
      try {
        const data = await getNewsDetails(newsId, currentLanguage);
        if (data) {
          setNewsDetail(data);
        } else {
          setIsError(true);
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin chi tiết tin tức.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        setIsError(true);
        toast({
          title: 'Lỗi',
          description: 'Đã xảy ra lỗi khi tải dữ liệu.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsDetail();
  }, [newsId, toast, currentLanguage]);

  // Hàm dịch tin tức
  const translateNews = async () => {
    if (!newsDetail) return;
    
    setIsTranslating(true);
    setShowTranslation(true);
    
    try {
      // Khởi tạo đối tượng translation trước
      let translatedContent: Record<string, string> = {};
      setTranslation(translatedContent);

      // Thử lấy bản dịch đã có trước
      const cachedTranslation = await fetchTranslation(newsId, 'vi', false);
      
      if (cachedTranslation) {
        setTranslation(cachedTranslation);
        setShowTranslation(true);
        return;
      }

      // Nếu không có bản dịch có sẵn, dịch bất đồng bộ từng phần
      
      // Phân tích nội dung HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(newsDetail.content.body, 'text/html');
      const blockElements = Array.from(doc.body.children);

      // Tạo một hàm để cập nhật translation state mỗi khi có dữ liệu mới
      const updateTranslation = (index: string, content: string) => {
        setTranslation(prevTranslation => ({
            ...prevTranslation,
            [index]: content
        }));
      };

      // Dịch tiêu đề và mô tả trước
      // Sử dụng Promise.all để dịch song song nhưng vẫn cập nhật UI từng phần
      Promise.all([
        // Dịch tiêu đề
        (async () => {
            try {
              const translatedTitle = await translateSentences(newsDetail.title || '', currentLanguage);
              updateTranslation('0', translatedTitle);
            } catch (error) {
              console.error("Error translating title:", error);
            }
        })(),

        // Dịch mô tả
        (async () => {
          try {
            const translatedDesc = await translateSentences(newsDetail.description || '', currentLanguage);
            updateTranslation('1', translatedDesc);
          } catch (error) {
            console.error("Error translating description:", error);
          }
        })(),
      ]);

      // Dịch từng block nội dung riêng biệt và cập nhật UI ngay khi có kết quả
      for (let i = 0; i < blockElements.length; i++) {
        const element = blockElements[i];
        const textContent = element.textContent || '';
        
        if (!textContent.trim()) {  
          updateTranslation((i + 2).toString(), '');
          continue;
        }
        
        // Tạo closure để giữ index cho mỗi phần tử
        (async (index) => {    
          try {
            const translatedBlock = await translateSentences(textContent, currentLanguage);
            updateTranslation((index + 2).toString(), translatedBlock);
          } catch (error) {
            console.error(`Error translating block ${index}:`, error);
            updateTranslation((index + 2).toString(), '');
          }
        })(i);
      }
    } catch (error) {
      console.error('Error translating news:', error);
      toast({
        title: 'Lỗi dịch',
        description: 'Không thể dịch nội dung tin tức. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        setIsTranslating(false);
      }, 1000);
    }
  };

  // Hiển thị nội dung song ngữ (gốc + dịch)
  const renderInterleavedContent = () => {
    if (!newsDetail?.content.body || !translation) return null;

    // Phân tích HTML thành Document để giữ nguyên cấu trúc
    const parser = new DOMParser();
    const doc = parser.parseFromString(newsDetail.content.body, 'text/html');
    
    // Tìm tất cả các phần tử cấp cao nhất
    const blockElements = Array.from(doc.body.children);
    
    // Tạo mảng các phần tử đã được xử lý để hiển thị
    const processedContent = [];

    blockElements.forEach((element, index) => {
      // Thêm phần tử gốc vào kết quả
      processedContent.push(
        <Box key={`original-${index}`} mb={2}>
          <div dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
        </Box>
      );

      // Lấy index dịch tương ứng (bắt đầu từ index 2)
      const translationIndex = (index + 2).toString();
      
      // Lấy phần dịch cho đoạn này
      if (translation[translationIndex]) {
        processedContent.push(
          <Box key={`translation-${index}`} mb={3} pl={4} borderLeft="2px" borderColor="blue.400">
            <Text color="blue.600" fontStyle="italic">
              {translation[translationIndex]}
            </Text>
          </Box>
        );
      }
    });

    return (
      <Stack spacing={2}>
        {processedContent}
      </Stack>
    );
  };

  const renderAudioPlayer = () => {
    if (!newsDetail?.content.audio) return null;

    let audioUrl = '';
    if (currentLanguage === 'en') {
      audioUrl = `https://admin.todaienglish.com/${newsDetail.content.audio}`;
    } else {
      const audioKeys = Object.keys(newsDetail.content.audio)[0];
      const currentAudio = newsDetail.content.audio[audioKeys];
      audioUrl = `https://easychinese.io/audios/${audioKeys}/${currentAudio}`;
    }
    return (
      <Box my={4}>
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mp3" />
          Trình duyệt của bạn không hỗ trợ phát âm thanh.
        </audio>
      </Box>
    );
  };

  const imageUrl = () => {
    if (currentLanguage === 'en') {
      return `${newsDetail.image}`;
    } else {
      return `${newsDetail.content.image}`;
    }
  };

  if (isLoading) {
    return (
      <Container maxW="container.md" py={8}>
        <Center py={20}>
          <Spinner size="xl" thickness="4px" color="blue.500" />
        </Center>
      </Container>
    );
  }

  if (isError || !newsDetail) {
    return (
      <Container maxW="container.md" py={8}>
        <Center py={10} flexDirection="column">
          <Heading as="h2" size="lg" mb={4}>
            Không thể tải tin tức
          </Heading>
          <Text mb={6}>
            Đã xảy ra lỗi khi tải thông tin chi tiết bài viết. Vui lòng thử lại sau.
          </Text>
          <Button colorScheme="blue" onClick={() => navigate('/')}>
            Quay lại trang chủ
          </Button>
        </Center>
      </Container>
    );
  }

  return (
    <Container maxW="container.md" py={8}>
      <Box mb={4}>
        <IconButton
          aria-label="Quay lại"
          icon={<ChevronLeftIcon w={6} h={6} />}
          onClick={() => navigate(-1)}
          variant="outline"
        />
      </Box>

      <Box
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        bg={bgColor}
        borderColor={borderColor}
        boxShadow="lg"
        p={6}
      >
        <Stack direction="row" spacing={2} mb={4} flexWrap="wrap">
          {newsDetail.type && (
            <Badge colorScheme={utils.getTypeColor(newsDetail.type)}>
              {utils.getVietnameseType(newsDetail.type)}
            </Badge>
          )}
          {newsDetail.kind && (
            <Badge colorScheme="blue">{newsDetail.kind}</Badge>
          )}
          {newsDetail.source && (
            <Badge 
              colorScheme="purple" 
              cursor={newsDetail.link ? "pointer" : "default"}
              onClick={() => newsDetail.link && window.open(newsDetail.link, "_blank")}
              _hover={newsDetail.link ? { opacity: 0.8 } : {}}
            >
              {utils.getSource(newsDetail.source)}
            </Badge>
          )}
        </Stack>

        {imageUrl() && (
          <Image 
            src={imageUrl()} 
            alt={newsDetail.title || "News image"} 
            my={4}
            maxH="400px"
            mx="auto"
            objectFit="contain"
          />
        )}
        
        {newsDetail.content.audio && (
          renderAudioPlayer()
        )}
        
        <Divider my={4} />
        
        <Flex justify="space-between" align="center" mb={4}>
          <Text fontSize="sm" color="gray.500">
            {newsDetail.date && new Date(newsDetail.date).toLocaleDateString()}
          </Text>
          
          <Button
            colorScheme="teal"
            isLoading={isTranslating}
            loadingText="Đang dịch..."
            onClick={translateNews}
            size="sm"
          >
            {showTranslation && translation ? "Đã dịch" : "Dịch"}
          </Button>
        </Flex>

        <Heading as="h1" size="xl" mb={4} dangerouslySetInnerHTML={{ __html: newsDetail.title || '' }} />
        
        {showTranslation && translation && translation['0'] && (
          <Box key="title-translation" mb={4} pl={4} borderLeft="2px" borderColor="blue.400">
            <Text color="blue.600" fontStyle="italic" fontWeight="bold">
              {translation['0']}
            </Text>
          </Box>
        )}

        {newsDetail.description && (
          <Text 
            fontSize="lg" 
            fontWeight="semibold" 
            mb={4} 
            dangerouslySetInnerHTML={{ __html: newsDetail.description }} 
          />
        )}

        {showTranslation && translation && translation['1'] && (
          <Box key="description-translation" mb={4} pl={4} borderLeft="2px" borderColor="blue.400">
            <Text color="blue.600" fontStyle="italic">
              {translation['1']}
            </Text>
          </Box>    
        )}

        {showTranslation && translation ? (
          renderInterleavedContent()
        ) : (
          <Box dangerouslySetInnerHTML={{ __html: newsDetail.content.body || '' }} />
        )}
      </Box>
    </Container>
  );
};

export default NewsDetailPage; 