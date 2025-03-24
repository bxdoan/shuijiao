// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Flex,
  Badge,
  SimpleGrid,
  AspectRatio,
  Divider,
  Tag,
  useColorModeValue,
  Spinner,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverHeader,
  PopoverBody,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaYoutube, FaArrowLeft, FaBookOpen, FaExternalLinkAlt } from 'react-icons/fa';
import { ChevronRightIcon } from '@chakra-ui/icons';
import SEO from '../components/Common/SEO';

// Import hsk1.json
import hsk1Data from '../data_example/hsk1.json';
import { fetchDictionary } from '../api/newsApi';

// WordData interface
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

const HSKDetails = () => {
  const { level, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const [wordData, setWordData] = useState<Record<string, WordData>>({});
  const openPopoverRef = useRef<string | null>(null);

  // Màu sắc dựa trên theme - Di chuyển tất cả các hook useColorModeValue lên đây
  // để tránh lỗi "React Hook useColorModeValue is called conditionally"
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popoverBgColor = useColorModeValue('white', 'gray.700');
  const tagBgColor = useColorModeValue('red.50', 'red.900');
  const tagColor = useColorModeValue('red.600', 'red.200');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    // Tạo hàm để load dữ liệu bài học HSK
    const loadHSKLesson = async () => {
      try {
        setIsLoading(true);
        
        // Dựa vào level và lessonId để lấy dữ liệu bài học cụ thể
        let foundLesson = null;
        
        if (level === '1') {
          foundLesson = hsk1Data.find(l => l.id === lessonId);
        } 
        // Trong tương lai có thể thêm các cấp độ khác
        
        setLesson(foundLesson);
      } catch (error) {
        console.error('Error loading HSK lesson:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHSKLesson();
  }, [level, lessonId]);

  // Hàm trích xuất ID từ URL YouTube
  const getYoutubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

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

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minHeight="50vh">
        <Spinner size="xl" color="red.500" thickness="4px" />
      </Flex>
    );
  }

  if (!lesson) {
    return (
      <Box py={10} textAlign="center">
        <Heading size="lg" mb={4}>Không tìm thấy bài học</Heading>
        <Text mb={6}>Không tìm thấy bài học HSK {level} - ID: {lessonId}</Text>
        <Button 
          leftIcon={<FaArrowLeft />} 
          colorScheme="blue" 
          onClick={() => navigate(`/zh/vi/hsk/${level}`)}
        >
          Quay lại danh sách bài học
        </Button>
      </Box>
    );
  }

  return (
    <Box py={8} bg={pageBgColor}>
      <SEO 
        title={`${lesson.title} - HSK ${level} - Shuijiao Chinese Learning`}
        description={lesson.description}
        keywords={`HSK ${level}, ${lesson.episode}, học tiếng Trung, tiếng Hán, Shuijiao, từ vựng HSK`}
      />
      
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/zh">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to={`/zh/vi/hsk/${level}`}>HSK {level}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{lesson.episode}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          {/* Header */}
          <Box>
            <HStack spacing={2} mb={2}>
              <Badge colorScheme="red">{lesson.level}</Badge>
              <Badge colorScheme="yellow">{lesson.episode}</Badge>
            </HStack>
            <Heading 
              as="h1" 
              size="xl" 
              mb={4}
            >
              {lesson.title}
            </Heading>
          </Box>

          {/* Main content */}
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            gap={8}
          >
            {/* Left column - Video */}
            <Box flex="1" borderRadius="lg" overflow="hidden" bg={bgColor} boxShadow="base">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  title={lesson.title}
                  src={`https://www.youtube.com/embed/${getYoutubeId(lesson.youtube_url)}`}
                  allowFullScreen
                />
              </AspectRatio>
              <Box p={5}>
                <Text fontWeight="medium" mb={4}>{lesson.description}</Text>
                <Button 
                  leftIcon={<FaYoutube />}
                  colorScheme="red"
                  as="a"
                  href={lesson.youtube_url}
                  target="_blank"
                  size="md"
                  rightIcon={<FaExternalLinkAlt />}
                >
                  Xem trên YouTube
                </Button>
              </Box>
            </Box>
            
            {/* Right column - Vocabulary */}
            <Box 
              width={{ base: "100%", lg: "40%" }} 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
            >
              <Heading as="h2" size="md" mb={4}>
                Từ vựng trong bài
              </Heading>
              <Divider mb={4} />
              
              {lesson.words && lesson.words.length > 0 ? (
                <SimpleGrid columns={{ base: 2, sm: 3 }} spacing={4}>
                  {lesson.words.map((word, index) => (
                    <Popover 
                      key={index}
                      isLazy
                      placement="top"
                      onOpen={() => handleWordClick(word)}
                      onClose={handlePopoverClose}
                    >
                      <PopoverTrigger>
                        <Tag 
                          size="lg" 
                          p={2} 
                          bg={tagBgColor} 
                          color={tagColor} 
                          cursor="pointer" 
                          _hover={{ transform: 'scale(1.05)', boxShadow: 'sm' }}
                          transition="all 0.2s"
                          borderRadius="md"
                          textAlign="center"
                          justifyContent="center"
                        >
                          {word}
                        </Tag>
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
              ) : (
                <Text color="gray.500" textAlign="center">Không có từ vựng</Text>
              )}
              
              <Divider my={6} />
              
              <VStack spacing={3}>
                <Button 
                  leftIcon={<FaBookOpen />}
                  colorScheme="yellow"
                  size="md"
                  width="full"
                  as={RouterLink}
                  to="/zh/dict"
                >
                  Tra cứu từ điển
                </Button>
                
                <Button 
                  leftIcon={<FaArrowLeft />}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  width="full"
                  as={RouterLink}
                  to={`/zh/vi/hsk/${level}`}
                >
                  Quay lại danh sách bài học
                </Button>
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default HSKDetails; 