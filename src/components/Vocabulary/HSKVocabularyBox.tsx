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
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Spinner,
  Flex,
} from '@chakra-ui/react';
import { fetchDictionary } from '../../api/newsApi';

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
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popoverBgColor = useColorModeValue('white', 'gray.700');
  
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
      <Heading as="h3" size="md" mb={4} textAlign="center">
        Từ vựng HSK trong bài
      </Heading>
      
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
                    <Popover 
                      key={`${level}-${index}`}
                      isLazy
                      placement="top"
                      onOpen={() => handleWordClick(word)}
                      onClose={handlePopoverClose}
                    >
                      <PopoverTrigger>
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
                      </PopoverTrigger>
                      <PopoverContent 
                        bg={popoverBgColor} 
                        borderColor="gray.200" 
                        boxShadow="xl"
                        _dark={{
                          borderColor: "gray.600"
                        }}
                      >
                        <PopoverArrow />
                        <PopoverCloseButton />
                        <PopoverHeader fontWeight="semibold" borderBottomWidth="1px">
                          {word}
                        </PopoverHeader>
                        <PopoverBody p={3}>
                          {wordData[word] ? (
                            wordData[word].isLoading ? (
                              <Flex justify="center" py={2}>
                                <Spinner size="sm" color="blue.500" mr={2} />
                                <Text>Đang tải...</Text>
                              </Flex>
                            ) : (
                              <Box>
                                <Text fontStyle="italic" color="gray.600" mb={1}>
                                  {wordData[word].pinyin}
                                </Text>
                                <Text fontWeight="medium" color="blue.600" mb={2}>
                                  {wordData[word].cn_vi}
                                </Text>
                                {wordData[word].example && (
                                  <Box 
                                    mt={2} 
                                    borderLeft="2px" 
                                    borderColor="blue.500" 
                                    pl={2}
                                    fontSize="sm"
                                  >
                                    <Text fontWeight="semibold">{wordData[word].example.e}</Text>
                                    <Text fontStyle="italic">{wordData[word].example.p}</Text>
                                    <Text color="blue.600">{wordData[word].example.m}</Text>
                                  </Box>
                                )}
                              </Box>
                            )
                          ) : (
                            <Flex justify="center" py={2}>
                              <Spinner size="sm" color="blue.500" mr={2} />
                              <Text>Đang tải...</Text>
                            </Flex>
                          )}
                        </PopoverBody>
                      </PopoverContent>
                    </Popover>
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