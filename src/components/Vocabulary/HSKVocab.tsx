// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React, { useState, useRef } from 'react';
import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Button,
} from '@chakra-ui/react';
import { fetchDictionary } from '../../api/vocabApi';
import { useNavigate } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import WordPopover from '../Common/WordPopover';

interface HSKVocabularyBoxProps {
  levelHSK: {
    [key: string]: string[];
  };
}

interface HSKLevelConfig {
  [key: string]: { color: string; title: string };
}

// Cấu trúc dữ liệu từ vựng
interface WordData {
  word: string;
  pinyin: string;
  cn_vi: string;
  example?: {
    e: string;
    p: string;
    m: string;
  };
  isLoading: boolean;
}

// Map các cấp độ HSK sang màu sắc và tiêu đề
const hskLevelConfig: HSKLevelConfig = {
  '1': { color: 'green', title: 'HSK 1 - Sơ cấp thấp' },
  '2': { color: 'blue', title: 'HSK 2 - Sơ cấp' },
  '3': { color: 'purple', title: 'HSK 3 - Sơ cấp cao' },
  '4': { color: 'orange', title: 'HSK 4 - Trung cấp' },
  '5': { color: 'pink', title: 'HSK 5 - Trung cấp cao' },
  '6': { color: 'red', title: 'HSK 6 - Cao cấp' },
  'unknown': { color: 'gray', title: 'Không xác định' },
};

// Thứ tự hiển thị các cấp độ
const displayOrder = ['1', '2', '3', '4', '5', '6', 'unknown'];

// @ts-ignore - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
const HSKVocabularyBox: React.FC<HSKVocabularyBoxProps> = ({ levelHSK }) => {
  const navigate = useNavigate();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // State lưu trữ dữ liệu từ vựng đã tìm kiếm
  const [wordData, setWordData] = useState<Record<string, WordData>>({});
  
  // Ref để theo dõi Popover hiện tại đang mở
  const openPopoverRef = useRef<string | null>(null);
  
  // Hàm tìm kiếm từ vựng
  const handleWordClick = async (word: string) => {
    // Kiểm tra xem đã có dữ liệu từ này chưa
    if (!wordData[word]) {
      // Nếu chưa, tạo một bản ghi tạm thời với trạng thái đang tải
      setWordData(prev => ({
        ...prev,
        [word]: {
          word,
          pinyin: '',
          cn_vi: '',
          isLoading: true
        }
      }));
      
      try {
        // Gọi API để lấy thông tin từ vựng
        const data = await fetchDictionary(word, 'vi', 'word');
        
        if (data && data.found && data.result.length > 0) {
          const firstResult = data.result[0];
          
          // Xử lý để lấy ví dụ đầu tiên (nếu có)
          let example = undefined;
          if (firstResult.content && 
              firstResult.content[0] && 
              firstResult.content[0].means && 
              firstResult.content[0].means[0] && 
              firstResult.content[0].means[0].examples && 
              firstResult.content[0].means[0].examples.length > 0) {
            example = firstResult.content[0].means[0].examples[0];
          }
          
          // Cập nhật dữ liệu từ vựng
          setWordData(prev => ({
            ...prev,
            [word]: {
              word: firstResult.word,
              pinyin: firstResult.pinyin,
              cn_vi: firstResult.cn_vi,
              example,
              isLoading: false
            }
          }));
        } else {
          // Nếu không tìm thấy kết quả, cập nhật với thông tin không có dữ liệu
          setWordData(prev => ({
            ...prev,
            [word]: {
              word,
              pinyin: 'Không có dữ liệu',
              cn_vi: 'Không tìm thấy',
              isLoading: false
            }
          }));
        }
      } catch (error) {
        console.error('Lỗi khi tìm kiếm từ vựng:', error);
        setWordData(prev => ({
          ...prev,
          [word]: {
            word,
            pinyin: 'Lỗi tìm kiếm',
            cn_vi: 'Không thể tải dữ liệu',
            isLoading: false
          }
        }));
      }
    }
    
    // Lưu từ hiện tại vào ref
    openPopoverRef.current = word;
  };
  
  // Hàm xử lý khi đóng Popover
  const handlePopoverClose = () => {
    openPopoverRef.current = null;
  };
  
  // Hàm lấy tất cả từ vựng từ tất cả các cấp độ
  const getAllWords = () => {
    const allWords: string[] = [];
    Object.values(levelHSK).forEach(words => {
      allWords.push(...words);
    });
    return allWords;
  };

  // Hàm xử lý khi click nút Flashcard
  const handleFlashcardClick = () => {
    const allWords = getAllWords();
    const wordsParam = encodeURIComponent(allWords.join(','));
    navigate(`/zh/flashcard?backRoute=${window.location.pathname}&words=${wordsParam}`);
  };
  
  // Kiểm tra nếu không có dữ liệu
  if (!levelHSK || Object.keys(levelHSK).length === 0) {
    return null;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      p={4}
    >
      <HStack justify="space-between" mb={4}>
        <Heading as="h3" size="md">
          Từ vựng HSK trong bài
        </Heading>
        <Button
          leftIcon={<FaBookOpen />}
          colorScheme="blue"
          size="md"
          onClick={handleFlashcardClick}
        >
          Học với Flashcard
        </Button>
      </HStack>
      
      <Accordion allowMultiple defaultIndex={[0]}>
        {displayOrder.map((level) => {
          // Chỉ hiện thị cấp độ có từ vựng
          if (!levelHSK[level] || levelHSK[level].length === 0) {
            return null;
          }
          
          const config = hskLevelConfig[level];
          
          return (
            <AccordionItem key={level} mb={2}>
              <h2>
                <AccordionButton>
                  <HStack flex="1" justifyContent="space-between">
                    <Text fontWeight="bold">{config.title}</Text>
                    <Badge colorScheme={config.color} fontSize="0.8em">
                      {levelHSK[level].length} từ
                    </Badge>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={2}>
                  {levelHSK[level].map((word, index) => (
                    <WordPopover
                      key={`${level}-${index}`}
                      word={word}
                      trigger={
                        <Box 
                          p={2} 
                          borderWidth="1px" 
                          borderRadius="md" 
                          borderColor={`${config.color}.200`}
                          bg={`${config.color}.50`}
                          _hover={{ bg: `${config.color}.100`, cursor: 'pointer' }}
                          _dark={{
                            bg: `${config.color}.900`,
                            borderColor: `${config.color}.700`,
                            _hover: { bg: `${config.color}.800` }
                          }}
                        >
                          <Text fontSize="md" textAlign="center">{word}</Text>
                        </Box>
                      }
                      onOpen={() => handleWordClick(word)}
                      onClose={handlePopoverClose}
                      wordData={wordData[word]}
                    />
                  ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default HSKVocabularyBox; 