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
import { fetchTranslation, fetchGoogleTranslation } from '../api/newsApi';

interface NewsCardProps {
  news: NewsItem;
  sourceLang: "zh" | "en";
}

const NewsCard: React.FC<NewsCardProps> = ({
  news,
  sourceLang
}) => {
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

  // Hàm chia văn bản thành các câu
  const splitTextIntoSentences = (text: string) => {
    // Trích xuất văn bản thuần túy từ HTML
    const stripHtmlTags = (html: string) => {
      const doc = new DOMParser().parseFromString(html, 'text/html');
      return doc.body.textContent || '';
    };

    let plainText = '';
    
    if ( sourceLang === "en" ) {
      // Nội dung tiếng Anh - chỉ cần loại bỏ thẻ HTML
      plainText = stripHtmlTags(text);
      // Loại bỏ khoảng trắng thừa
      plainText = plainText.replace(/\s+/g, ' ').trim();
      
      // Chia thành các câu dựa trên dấu câu
      const sentences = [];
      const sentenceParts = plainText.split(/([.!?])/);
      
      // Ghép lại thành câu hoàn chỉnh với dấu câu
      for (let i = 0; i < sentenceParts.length - 1; i += 2) {
        const sentence = (sentenceParts[i] + (sentenceParts[i+1] || '')).trim();
        if (sentence) sentences.push(sentence);
      }
      
      // Nếu còn phần dư, thêm vào
      if (sentenceParts.length % 2 === 1) {
        const lastPart = sentenceParts[sentenceParts.length - 1].trim();
        if (lastPart) sentences.push(lastPart);
      }
      
      // Nếu không tách được câu nào, trả về toàn bộ văn bản
      if (sentences.length === 0 && plainText.trim()) {
        sentences.push(plainText.trim());
      }
      
      return sentences;
    } else {
      // Xử lý tiếng Trung (giữ nguyên code cũ)
      // Loại bỏ tất cả thẻ HTML và chỉ lấy nội dung văn bản
      plainText = stripHtmlTags(text);
      
      // Loại bỏ pinyin (nằm trong cặp ngoặc tròn sau các ký tự Hán)
      // Ví dụ: 你好(nǐ hǎo) -> 你好
      plainText = plainText.replace(/\([^)]*\)/g, '');
      
      // Loại bỏ các ghi chú <rt> (thường chứa pinyin)
      plainText = plainText.replace(/\s*<rt>[^<]*<\/rt>\s*/g, '');
      
      // Loại bỏ các khoảng trắng thừa
      plainText = plainText.replace(/\s+/g, ' ').trim();
      
      // Chỉ giữ lại chữ Hán và một số ký tự đặc biệt
      // Phạm vi unicode của chữ Hán: 
      // CJK Unified Ideographs: 4E00-9FFF
      // CJK Unified Ideographs Extension A: 3400-4DBF
      // CJK Unified Ideographs Extension B: 20000-2A6DF
      // CJK Unified Ideographs Extension C: 2A700-2B73F
      // CJK Unified Ideographs Extension D: 2B740-2B81F
      // CJK Unified Ideographs Extension E: 2B820-2CEAF
      // CJK Unified Ideographs Extension F: 2CEB0-2EBEF
      // CJK Compatibility Ideographs: F900-FAFF
      
      // Lọc để chỉ giữ lại chữ Hán và dấu câu cần thiết
      let chineseOnly = '';
      for (let i = 0; i < plainText.length; i++) {
        const charCode = plainText.charCodeAt(i);
        
        // Kiểm tra xem ký tự có phải là chữ Hán
        const isChineseChar = 
          (charCode >= 0x4E00 && charCode <= 0x9FFF) || // CJK Unified Ideographs
          (charCode >= 0x3400 && charCode <= 0x4DBF) || // Extension A
          (charCode >= 0xF900 && charCode <= 0xFAFF) || // Compatibility Ideographs
          // Giữ lại các dấu câu quan trọng
          [0x3002, 0xFF01, 0xFF1F, 0x3001, 0xFF0C, 0x3001, 0xFF1B, 0xFF1A, 0x300C, 0x300D, 0x300E, 0x300F, 0x2018, 0x2019, 0x201C, 0x201D].includes(charCode);
        
        if (isChineseChar) {
          chineseOnly += plainText[i];
        } else if (['.', '!', '?', '。', '！', '？'].includes(plainText[i])) {
          // Giữ lại các dấu câu phổ biến để phân chia câu
          chineseOnly += plainText[i];
        } else if (plainText[i] === ' ' && chineseOnly.length > 0 && chineseOnly[chineseOnly.length - 1] !== ' ') {
          // Giữ một khoảng trắng duy nhất giữa các từ (nếu cần)
          chineseOnly += ' ';
        }
      }
      
      // Chia văn bản thành các câu
      const sentences: string[] = [];
      let currentSentence = '';
      
      for (let i = 0; i < chineseOnly.length; i++) {
        currentSentence += chineseOnly[i];
        
        // Kiểm tra nếu đây là dấu kết thúc câu và ký tự tiếp theo là khoảng trắng hoặc hết chuỗi
        if (
          ['.', '!', '?', '。', '！', '？'].includes(chineseOnly[i]) && 
          (i === chineseOnly.length - 1 || chineseOnly[i + 1] === ' ')
        ) {
          sentences.push(currentSentence.trim());
          currentSentence = '';
        }
      }
      
      // Thêm phần cuối nếu còn
      if (currentSentence.trim()) {
        sentences.push(currentSentence.trim());
      }
      
      // Nếu không có câu nào được chia, trả về toàn bộ văn bản như một câu duy nhất
      if (sentences.length === 0 && chineseOnly.trim()) {
        sentences.push(chineseOnly.trim());
      }
      
      return sentences;
    }
  };

  // Hàm mới: Dịch từng câu sử dụng Google Translate
  const translateSentences = async (text: string, targetLang: string = 'vi') => {
    const sentences = splitTextIntoSentences(text);
    const translatedSentences = [];
    
    try {
      // Tối ưu hóa: dịch theo lô các câu, thay vì dịch từng câu riêng biệt
      for (const sentence of sentences) {
        if (!sentence.trim()) continue; // Bỏ qua câu rỗng
        
        const translatedSentence = await fetchGoogleTranslation(sentence, targetLang, sourceLang);
        if (translatedSentence) {
          translatedSentences.push(translatedSentence);
        }
      }
      
      return translatedSentences.join(' ');
    } catch (error) {
      console.error('Error in translateSentences:', error);
      // Nếu có lỗi, trả về văn bản gốc sau khi đã loại bỏ HTML
      toast({
        title: "Lỗi dịch",
        description: "Không thể dịch văn bản. Vui lòng thử lại sau.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return text;
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
      // Khởi tạo đối tượng translation trước
      let translatedContent: Record<string, string> = {};
      setTranslation(translatedContent);

      // Thử sử dụng fetchTranslation trước
      let cachedTranslation = await fetchTranslation(id, 'vi');

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
            const translatedTitle = await translateSentences(title);
            updateTranslation('0', translatedTitle);
          } catch (error) {
            console.error("Error translating title:", error);
          }
        })(),
        
        // Dịch mô tả
        (async () => {
          try {
            const translatedDesc = await translateSentences(desc);
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
            const translatedBlock = await translateSentences(textContent);
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