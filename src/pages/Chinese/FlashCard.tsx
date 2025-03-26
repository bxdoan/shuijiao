// @ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';
import { 
    useSearchParams, 
    useNavigate } from 'react-router-dom';
import {
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Button,
  IconButton,
  SimpleGrid,
  Card,
  CardBody,
  Center,
  Spinner,
  useColorModeValue,
} from '@chakra-ui/react';
import { 
    ChevronLeftIcon, 
    ChevronRightIcon, 
} from '@chakra-ui/icons';

import { 
    FaArrowLeft, 
    FaVolumeUp 
} from 'react-icons/fa';

import { fetchDictionary } from '../../api/newsApi';
import SEO from '../../components/Common/SEO';

interface WordData {
  word: string;
  pinyin: string;
  cn_vi: string;
  isLoading: boolean;
}

const ChineseFlashCard: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [words, setWords] = useState<string[]>([]);
  const [wordData, setWordData] = useState<Record<string, WordData>>({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const WORDS_PER_PAGE = 12;

  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const pinyinColor = useColorModeValue('blue.600', 'blue.300');
  const meaningColor = useColorModeValue('green.600', 'green.300');

  useEffect(() => {
    const wordsParam = searchParams.get('words');
    if (!wordsParam) {
      navigate('/zh');
      return;
    }

    try {
      const decodedWords = decodeURIComponent(wordsParam).split(',');
      setWords(decodedWords);
      setIsLoading(false);
    } catch (error) {
      console.error('Error decoding words:', error);
      navigate('/zh');
    }
  }, [searchParams, navigate]);

  const loadWordData = useCallback(async () => {
    const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
    const endIndex = startIndex + WORDS_PER_PAGE;
    const currentWords = words.slice(startIndex, endIndex);

    // Tạo mảng các promise để load song song
    const promises = currentWords.map(async (word) => {
      try {
        const data = await fetchDictionary(word, 'vi', 'word');
        if (data && data.found && data.result.length > 0) {
          const firstResult = data.result[0];
          return {
            word,
            data: {
              word: firstResult.word,
              pinyin: firstResult.pinyin,
              cn_vi: firstResult.cn_vi,
              isLoading: false
            }
          };
        }
      } catch (error) {
        console.error('Error fetching word data:', error);
      }
      return {
        word,
        data: {
          word,
          pinyin: 'Lỗi tải dữ liệu',
          cn_vi: 'Lỗi tải dữ liệu',
          isLoading: false
        }
      };
    });

    // Chờ tất cả promise hoàn thành
    const results = await Promise.all(promises);
    
    // Cập nhật state với dữ liệu mới
    setWordData(prev => {
      const newWordData = { ...prev };
      results.forEach(result => {
        newWordData[result.word] = result.data;
      });
      return newWordData;
    });
  }, [currentPage, words]);

  useEffect(() => {
    loadWordData();
  }, [loadWordData]);

  const handleNextPage = () => {
    if (currentPage * WORDS_PER_PAGE < words.length) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < words.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(false);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowMeaning(false);
    }
  };

  const toggleFlashcardMode = () => {
    setIsFlashcardMode(!isFlashcardMode);
    setCurrentIndex(0);
    setShowMeaning(false);
  };

  const playPronunciation = (word: string) => {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'zh-CN';
    window.speechSynthesis.speak(utterance);
  };

  // Hàm xử lý nút quay lại
  const handleBack = () => {
    const backRoute = searchParams.get('backRoute');
    if (backRoute) {
      navigate(`${backRoute}`);
    } else {
      navigate('/zh');
    }
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  const currentWord = words[currentIndex];
  const wordInfo = wordData[currentWord];

  return (
    <>
      <SEO
        title="Học từ vựng với Flashcard - Shuijiao"
        description="Học từ vựng tiếng Trung hiệu quả với phương pháp flashcard"
        keywords="học tiếng Trung, flashcard, từ vựng tiếng Trung"
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <HStack justify="space-between">
            <HStack>
              <IconButton
                aria-label="Quay lại"
                icon={<FaArrowLeft />}
                onClick={handleBack}
                colorScheme="blue"
                variant="ghost"
                size="sm"
              />
              <Heading size="lg">Học từ vựng với Flashcard</Heading>
            </HStack>
            <Button
              colorScheme="blue"
              variant={isFlashcardMode ? "solid" : "outline"}
              onClick={toggleFlashcardMode}
            >
              {isFlashcardMode ? "Xem danh sách" : "Chế độ Flashcard"}
            </Button>
          </HStack>

          {isFlashcardMode ? (
            // Flashcard Mode
            <Card
              bg={bgColor}
              borderWidth="1px"
              borderColor={borderColor}
              boxShadow="lg"
              cursor="pointer"
              onClick={() => setShowMeaning(!showMeaning)}
              transition="transform 0.2s"
              _hover={{ transform: 'scale(1.02)' }}
            >
              <CardBody p={8}>
                <VStack spacing={4} align="center">
                  <Text fontSize="4xl" fontWeight="bold" color={textColor}>
                    {currentWord}
                  </Text>
                  {showMeaning && wordInfo && (
                    <>
                      <Text fontSize="xl" color={pinyinColor}>
                        {wordInfo.pinyin}
                      </Text>
                      <Text fontSize="lg" color={meaningColor}>
                        {wordInfo.cn_vi}
                      </Text>
                    </>
                  )}
                  <HStack spacing={4} mt={4}>
                    <IconButton
                      aria-label="Phát âm"
                      icon={<FaVolumeUp />}
                      onClick={(e) => {
                        e.stopPropagation();
                        playPronunciation(currentWord);
                      }}
                      colorScheme="blue"
                      variant="ghost"
                    />
                    <Button
                      leftIcon={<ChevronLeftIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevWord();
                      }}
                      isDisabled={currentIndex === 0}
                    >
                      Từ trước
                    </Button>
                    <Button
                      rightIcon={<ChevronRightIcon />}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextWord();
                      }}
                      isDisabled={currentIndex === words.length - 1}
                    >
                      Từ tiếp
                    </Button>
                  </HStack>
                </VStack>
              </CardBody>
            </Card>
          ) : (
            // List Mode
            <>
              <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                {words
                  .slice((currentPage - 1) * WORDS_PER_PAGE, currentPage * WORDS_PER_PAGE)
                  .map((word, index) => {
                    const info = wordData[word];
                    return (
                      <Card
                        key={word}
                        bg={bgColor}
                        borderWidth="1px"
                        borderColor={borderColor}
                        boxShadow="md"
                      >
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <HStack width="100%" justify="space-between">
                              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                {word}
                              </Text>
                              <IconButton
                                aria-label="Phát âm"
                                icon={<FaVolumeUp />}
                                onClick={() => playPronunciation(word)}
                                colorScheme="blue"
                                variant="ghost"
                                size="sm"
                              />
                            </HStack>
                            {info ? (
                              info.isLoading ? (
                                <Spinner size="sm" color="blue.500" />
                              ) : (
                                <>
                                  <Text color={pinyinColor}>{info.pinyin}</Text>
                                  <Text color={meaningColor}>{info.cn_vi}</Text>
                                </>
                              )
                            ) : (
                              <Text color="gray.500">Đang tải...</Text>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    );
                  })}
              </SimpleGrid>

              <HStack justify="center" spacing={4}>
                <Button
                  leftIcon={<ChevronLeftIcon />}
                  onClick={handlePrevPage}
                  isDisabled={currentPage === 1}
                >
                  Trang trước
                </Button>
                <Text fontWeight="bold">Trang {currentPage}</Text>
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={handleNextPage}
                  isDisabled={currentPage * WORDS_PER_PAGE >= words.length}
                >
                  Trang sau
                </Button>
              </HStack>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default ChineseFlashCard; 