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
  IconButton,
  useDisclosure
} from '@chakra-ui/react';
import {
  ChevronUpIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@chakra-ui/icons';
import { FaShare } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import {
  fetchTranslation, 
  translateSentences
} from '../../api/newsApi';
import { NewsItem } from '../../types';
import * as utils from '../../utils/utils';
import { ShareModal } from '../Common/ShareModal';


interface NewsCardProps {
  news: NewsItem;
  sourceLang: "zh" | "en";
  targetLang: "vi";
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  sourceLang,
  targetLang = "vi"
}) => {
  const [showFullContent, setShowFullContent] = useState(false);
  const [isTranslating, setIsTranslating] = useState(false);
  const [translation, setTranslation] = useState<Record<string, string> | null>(null);
  const [showTranslation, setShowTranslation] = useState(false);
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Đảm bảo news.value tồn tại để tránh lỗi
  const newsValue = news?.value || {};
  const imageUrl = typeof newsValue.image === 'string' ? newsValue.image : '';
  const title = typeof newsValue.title === 'string' ? newsValue.title : '';
  const type = typeof newsValue.type === 'string' ? newsValue.type : '';
  const kind = typeof newsValue.kind === 'string' ? newsValue.kind : '';
  const source = typeof newsValue.source === 'string' ? newsValue.source : '';
  const link = typeof newsValue.link === 'string' ? newsValue.link : '';
  const desc = typeof newsValue.desc === 'string' ? newsValue.desc : '';
  const body = typeof newsValue.body === 'string' ? newsValue.body : '';
  const date = newsValue.date || '';
  const id = news?.id || '';


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
      // Khởi tạo đối tượng translation trước
      let translatedContent: Record<string, string> = {};
      setTranslation(translatedContent);

      // Thử sử dụng fetchTranslation trước
      let cachedTranslation = await fetchTranslation(id, targetLang);

      if (cachedTranslation) {
        // Nếu có bản dịch có sẵn, sử dụng luôn
        setTranslation(cachedTranslation);
        setIsTranslating(false);
        return;
      }

      // Nếu không có bản dịch có sẵn, dịch bất đồng bộ từng phần
      
      // Phân tích nội dung HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(body, 'text/html');
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
            const translatedTitle = await translateSentences(
              title,
              sourceLang,
              targetLang
            );
            updateTranslation('0', translatedTitle);
          } catch (error) {
            console.error("Error translating title:", error);
          }
        })(),
        
        // Dịch mô tả
        (async () => {
          try {
            const translatedDesc = await translateSentences(
              desc,
              sourceLang,
              targetLang
            );
            updateTranslation('1', translatedDesc);
          } catch (error) {
            console.error("Error translating description:", error);
          }
        })()
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
            const translatedBlock = await translateSentences(
              textContent,
              sourceLang,
              targetLang
            );
            updateTranslation((index + 2).toString(), translatedBlock);
          } catch (error) {
            console.error(`Error translating block ${index}:`, error);
            updateTranslation((index + 2).toString(), '');
          }
        })(i);
      }
    } catch (error) {
      console.error("Error in translation process:", error);
      toast({
        title: "Lỗi dịch",
        description: "Có lỗi xảy ra khi lấy bản dịch",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      // Đặt isTranslating = false sau một khoảng thời gian ngắn để đảm bảo
      // người dùng thấy rằng quá trình dịch đang diễn ra
      setTimeout(() => {
        setIsTranslating(false);
      }, 1000);
    }
  };

  // Hàm để hiển thị nội dung xen kẽ gốc và dịch
  const renderInterleavedContent = () => {
    if (!body || !translation) return null;

    // Phân tích HTML thành Document để giữ nguyên cấu trúc
    const parser = new DOMParser();
    const doc = parser.parseFromString(body, 'text/html');
    
    // Tìm tất cả các phần tử cấp cao nhất (block-level elements)
    const blockElements = Array.from(doc.body.children);
    
    // Tạo mảng các phần tử đã được xử lý để hiển thị
    const processedContent = [];

    // Xử lý description (index 1)
    if (translation['1']) {
      processedContent.push(
        <Box key="desc-translation" mb={2} pl={4} borderLeft="2px" borderColor="blue.400">
          <Text color="blue.600" fontStyle="italic">
            {translation['1']}
          </Text>
        </Box>
      );
    }

    // Xử lý nội dung chính (từ index 2 trở đi)
    blockElements.forEach((element, index) => {
      // Thêm phần tử gốc vào kết quả
      processedContent.push(
        <Box key={`original-${index}`} mb={2}>
          <div dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
        </Box>
      );
      
      // Lấy index dịch tương ứng (bắt đầu từ index 2)
      const translationIndex = (index + 2).toString();
      
      // Nếu có bản dịch cho đoạn này, thêm nó vào
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

  // Hàm chuyển hướng đến trang chi tiết
  const goToNewsDetail = () => {
    if (id) {
      if (sourceLang === 'zh') {
        navigate(`/zh/r/${id}`);
      } else {
        navigate(`/en/r/${id}`);
      }
    } else {
      toast({
        title: 'Lỗi',
        description: 'Không thể xem chi tiết tin tức này.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
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
          <Badge colorScheme={utils.getTypeColor(type)}>
            {utils.getVietnameseType(type)}
          </Badge>
          <Badge colorScheme="blue">{kind}</Badge>
          <Badge 
            colorScheme="purple" 
            cursor={link ? "pointer" : "default"}
            onClick={() => link && window.open(link, "_blank")}
            _hover={link ? { opacity: 0.8 } : {}}
          >
            {utils.getSource(source)}
          </Badge>
          <Box ml="auto">
            <Flex gap={2}>
              <IconButton
                aria-label="Chia sẻ"
                icon={<FaShare />}
                size="xs"
                colorScheme="blue"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation(); // Ngăn sự kiện bubble lên khi click vào nút share
                  onOpen();
                }}
              />
              <Button
                size="xs"
                colorScheme="teal"
                isLoading={isTranslating}
                loadingText="Đang dịch..."
                onClick={translateNews}
              >
                {showTranslation && translation ? "Đã dịch" : "Dịch"}
              </Button>
            </Flex>
          </Box>
        </Stack>

        <Heading as="h3" size="md" mb={2} dangerouslySetInnerHTML={{ __html: title }} />

        {showTranslation && translation && (
          <Box key="title-translation" mb={2} pl={4} borderLeft="2px" borderColor="blue.400">
            <Text color="blue.600" fontStyle="italic" fontWeight="bold">
              {translation['0']}
            </Text>
          </Box>
        )}
        
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
          <Flex gap={2}>
            <Button
              size="sm"
              colorScheme="blue"
              variant="outline"
              onClick={() => setShowFullContent(!showFullContent)}
              leftIcon={showFullContent ? <ChevronUpIcon /> : <ChevronDownIcon />}
            >
              {showFullContent ? 'Thu gọn' : 'Đọc thêm'}
            </Button>
            
            <Button
              size="sm"
              colorScheme="blue"
              onClick={goToNewsDetail}
              rightIcon={<ChevronRightIcon />}
            >
              Xem đầy đủ
            </Button>
          </Flex>
        </Flex>
      </Box>
      
      {/* ShareModal component */}
      <ShareModal
        isOpen={isOpen}
        onClose={onClose}
        title="Chia sẻ bài viết này"
        shareText={utils.splitTextIntoSentences(title, sourceLang) || "Tin tức từ Shuijiao"}
        url={`${window.location.origin}/${sourceLang}/${id}`}
      />
    </Box>
  );
};

export default NewsCard;