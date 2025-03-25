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
  Alert,
  AlertIcon,
  List,
  ListItem,
  Icon,
  Card,
  CardBody,
  CardHeader,
  Skeleton,
} from '@chakra-ui/react';
import {
  useParams,
  Link as RouterLink,
  useNavigate } from 'react-router-dom';
import {
  FaArrowLeft,
  FaBookOpen,
  FaExternalLinkAlt,
  FaCommentAlt } from 'react-icons/fa';
import { ChevronRightIcon } from '@chakra-ui/icons';

import SEO from '../../components/Common/SEO';
import { 
    fetchDictionary, 
    translateSentences 
} from '../../api/newsApi';
import { getChinesePinyin } from '../../api/translateApi';
import { HSK_LEVEL_COLORS } from '../../constant/hsk';
import { DonationBox } from '../../components/Common/DonationBox';
import { ShareModal } from '../../components/Common/ShareModal';

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

// SentenceData interface
interface SentenceData {
  original: string;
  pinyin: string;
  translation: string;
  isLoading: boolean;
}

const HSKDetails = () => {
  const { level, lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [wordData, setWordData] = useState<Record<string, WordData>>({});
  const [sentencesData, setSentencesData] = useState<Record<string, SentenceData>>({});
  const openPopoverRef = useRef<string | null>(null);

  // Màu sắc dựa trên theme - Di chuyển tất cả các hook useColorModeValue lên đây
  // để tránh lỗi "React Hook useColorModeValue is called conditionally"
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const popoverBgColor = useColorModeValue('white', 'gray.700');
  const tagBgColor = useColorModeValue('red.50', 'red.900');
  const tagColor = useColorModeValue('red.600', 'red.200');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  const sentenceColor = useColorModeValue('gray.700', 'gray.300');
  const pinyinColor = useColorModeValue('blue.600', 'blue.300');
  const translationColor = useColorModeValue('green.600', 'green.300');
  
  // Lấy màu tương ứng với cấp độ HSK hiện tại
  const levelColor = HSK_LEVEL_COLORS[level] || 'red';

  useEffect(() => {
    // Tạo hàm để load dữ liệu bài học HSK
    const loadHSKLesson = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Sử dụng import động để tải file JSON theo cấp độ HSK
        try {
          const hskModule = await import(`../../data_example/hsk${level}.json`);
          const hskData = hskModule.default || [];
          
          // Tìm bài học theo lessonId
          const foundLesson = hskData.find(l => l.id === lessonId);
          
          if (foundLesson) {
            setLesson(foundLesson);
            
            // Khởi tạo dữ liệu câu với trạng thái loading
            if (foundLesson.sentences && foundLesson.sentences.length > 0) {
              const initialSentencesData = {};
              foundLesson.sentences.forEach(sentence => {
                initialSentencesData[sentence] = {
                  original: sentence,
                  pinyin: '',
                  translation: '',
                  isLoading: true
                };
              });
              setSentencesData(initialSentencesData);
              
              // Xử lý từng câu
              foundLesson.sentences.forEach(async sentence => {
                try {
                  // Lấy dịch nghĩa và pinyin đồng thời
                  const [translation, pinyin] = await Promise.all([
                    translateSentences(sentence, 'zh', 'vi'),
                    getChinesePinyin(sentence)
                  ]);
                  
                  setSentencesData(prev => ({
                    ...prev,
                    [sentence]: {
                      ...prev[sentence],
                      translation,
                      pinyin,
                      isLoading: false
                    }
                  }));
                } catch (error) {
                  console.error('Lỗi khi xử lý câu:', error);
                  setSentencesData(prev => ({
                    ...prev,
                    [sentence]: {
                      ...prev[sentence],
                      translation: 'Lỗi dịch',
                      pinyin: 'Lỗi lấy pinyin',
                      isLoading: false
                    }
                  }));
                }
              });
            }
          } else {
            setError(`Không tìm thấy bài học ID: ${lessonId} trong HSK ${level}`);
          }
        } catch (importError) {
          console.error(`Không thể tải file hsk${level}.json:`, importError);
          setError(`Dữ liệu HSK ${level} chưa có sẵn. Vui lòng thử cấp độ khác.`);
        }
      } catch (error) {
        console.error('Error loading HSK lesson:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu bài học. Vui lòng thử lại sau.');
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
        <Spinner size="xl" color={`${levelColor}.500`} thickness="4px" />
      </Flex>
    );
  }

  // Hiển thị thông báo lỗi nếu có
  if (error) {
    return (
      <Box py={10} textAlign="center">
        <Alert status="warning" maxW="container.md" mx="auto" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
        <Button 
          leftIcon={<FaArrowLeft />} 
          colorScheme={levelColor} 
          onClick={() => navigate(`/zh/vi/hsk/${level}`)}
        >
          Quay lại danh sách bài học
        </Button>
      </Box>
    );
  }

  if (!lesson) {
    return (
      <Box py={10} textAlign="center">
        <Heading size="lg" mb={4}>Không tìm thấy bài học</Heading>
        <Text mb={6}>Không tìm thấy bài học HSK {level} - ID: {lessonId}</Text>
        <Button 
          leftIcon={<FaArrowLeft />} 
          colorScheme={levelColor} 
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
              <Badge colorScheme={levelColor}>{lesson.level}</Badge>
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
            <Box flex="1" borderRadius="lg" overflow="hidden" bg={bgColor} boxShadow="base" position="relative">
              <AspectRatio ratio={16 / 9}>
                <iframe
                  title={lesson.title}
                  src={`https://www.youtube.com/embed/${getYoutubeId(lesson.youtube_url)}?start=10`}
                  allowFullScreen
                />
              </AspectRatio>
              <Box p={5}>
                <Text fontWeight="medium" mb={4}>{lesson.description}</Text>
                
                {/* Navigation buttons for lessons */}
                <Flex justify="space-between" w="100%" mt={4}>
                  <Button
                    leftIcon={<FaArrowLeft />}
                    colorScheme={levelColor}
                    variant="outline"
                    size="md"
                    onClick={() => {
                      const prevLessonId = parseInt(lessonId) - 1;
                      if (prevLessonId >= 1) {
                        navigate(`/zh/vi/hsk/${level}/${prevLessonId}`);
                      }
                    }}
                    isDisabled={parseInt(lessonId) <= 1}
                  >
                    Bài trước
                  </Button>
                  
                  {/* Share button */}
                  <ShareButton lesson={lesson} level={level} levelColor={levelColor}/>
                  
                  <Button
                    rightIcon={<ChevronRightIcon />}
                    colorScheme={levelColor}
                    variant="solid"
                    size="md"
                    onClick={() => {
                      const nextLessonId = parseInt(lessonId) + 1;
                      navigate(`/zh/vi/hsk/${level}/${nextLessonId}`);
                    }}
                  >
                    Bài tiếp theo
                  </Button>
                </Flex>
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
                  colorScheme={levelColor}
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
          
          {/* Phần câu ví dụ và dịch nghĩa */}
          {lesson.sentences && lesson.sentences.length > 0 && (
            <Box mt={6}>
              <Card 
                bg={cardBgColor} 
                boxShadow="md" 
                borderRadius="lg"
                borderWidth="1px"
                borderColor={borderColor}
              >
                <CardHeader pb={2}>
                  <HStack>
                    <Icon as={FaCommentAlt} color={`${levelColor}.500`} />
                    <Heading size="md">Câu ví dụ</Heading>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <List spacing={4}>
                    {lesson.sentences.map((sentence, index) => (
                      <ListItem key={index}>
                        <Card variant="outline" mb={2} borderColor={`${levelColor}.200`}>
                          <CardBody py={3}>
                            <Text fontSize="lg" fontWeight="bold" color={sentenceColor}>
                              {sentence}
                            </Text>
                            
                            {sentencesData[sentence] ? (
                              sentencesData[sentence].isLoading ? (
                                <Skeleton height="20px" mt={2} />
                              ) : (
                                <>
                                  <Text fontSize="md" fontStyle="italic" color={pinyinColor} mt={1}>
                                    {sentencesData[sentence].pinyin}
                                  </Text>
                                  <Text fontSize="md" color={translationColor} mt={1}>
                                    {sentencesData[sentence].translation}
                                  </Text>
                                </>
                              )
                            ) : (
                              <Skeleton height="20px" mt={2} />
                            )}
                          </CardBody>
                        </Card>
                      </ListItem>
                    ))}
                  </List>
                </CardBody>
              </Card>
            </Box>
          )}
          
          {/* Box ủng hộ dự án */}
          <Box mt={6}>
            <DonationBox 
              title="Ủng hộ dự án Shuijiao"
              description="Nếu bạn thấy ứng dụng hữu ích, hãy ủng hộ để chúng tôi có thể phát triển thêm nhiều tính năng mới."
              bankName="MBBANK"
              accountNumber="0904195065"
              accountHolder="Bui Xuan Doan"
              transferMessage="Ho tro Shuijiao"
            />
          </Box>
        </VStack>
      </Container>
    </Box>
  );
};

// Thêm ShareButton component ngay dưới HSKDetails component
const ShareButton = ({ lesson, level, levelColor }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);
  
  return (
    <>
      <Button
        leftIcon={<FaExternalLinkAlt />}
        colorScheme="yellow"
        variant="solid"
        size="md"
        onClick={onOpen}
      >
        Chia sẻ
      </Button>
      
      <ShareModal 
        isOpen={isOpen}
        onClose={onClose}
        title="Chia sẻ bài học này"
        shareText={`Học tiếng Trung với ${lesson.title} - HSK ${level} | Shuijiao Chinese Learning`}
      />
    </>
  );
};

export default HSKDetails; 