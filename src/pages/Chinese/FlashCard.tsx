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
    FaVolumeUp,
    FaEye,
    FaEyeSlash
} from 'react-icons/fa';

import { fetchDictionary, fetchVocabularyItems } from '../../api/newsApi';
import SEO from '../../components/Common/SEO';
import { 
  Notebook
} from '../../types';

interface FlashCardProps {
  category?: string;
  words?: string[];
  routeBack?: string;
}

const ChineseFlashCard: React.FC<FlashCardProps> = ({ 
  category,
  words: propWords,
  routeBack,
}) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [wordsParams, setWordsParams] = useState<Notebook[]>([]);
  const [wordsShow, setWordsShow] = useState<Notebook[]>([]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [showMeaning, setShowMeaning] = useState(false);
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [autoShowMeaning, setAutoShowMeaning] = useState(false);
  const WORDS_PER_PAGE = 12;

  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const pinyinColor = useColorModeValue('blue.600', 'blue.300');
  const meaningColor = useColorModeValue('green.600', 'green.300');

  useEffect(() => {
    const loadVocabularyItems = async () => {
      if (!category) {
        const wordsParam = searchParams.get('words');
        if (!wordsParam) {
          navigate('/zh');
          return;
        }

        try {
          const decodedWords = decodeURIComponent(wordsParam).split(',');
          const buildWords = decodedWords.map(word => ({
            w: word,
            p: '',
            m: '',
            isLoading: true
          }));
          setWordsParams(buildWords);
          const startIndex = (currentPage - 1) * WORDS_PER_PAGE;
          const endIndex = startIndex + WORDS_PER_PAGE;
          const currentShowWords = buildWords.slice(startIndex, endIndex);
          setWordsShow(currentShowWords);
        } catch (error) {
          console.error('Error decoding words:', error);
          navigate('/zh');
        }
      } else {
        try {
          const response = await fetchVocabularyItems(
            category, currentPage, WORDS_PER_PAGE
          );
          setWordsShow(response.result);
          setTotalItems(response.total);
        } catch (error) {
          console.error('Error loading vocabulary items:', error);
        }
      }
      setIsLoading(false);
    };

    loadVocabularyItems();
  }, [category, currentPage, searchParams, navigate]);


  const loadWordData = useCallback(async () => {
    if (category) return;

    const promises = wordsShow.map(async (word: Notebook) => {
      try {
        const data = await fetchDictionary(
          word.w, 'vi', 'word', 1, 2
        );
        if (data && data.found && data.result.length > 0) {
          const firstResult = data.result[0];
          return {
            ...word,
            p: firstResult.pinyin,
            m: firstResult.cn_vi,
            isLoading: false
          };
        }
      } catch (error) {
        console.error('Error fetching word data:', error);
      }
      return {
        ...word,
        p: 'Lỗi tải dữ liệu',
        m: 'Lỗi tải dữ liệu',
        isLoading: false
      };
    });

    // wait for all promises to finish
    const results = await Promise.all(promises);
    
    // update for wordsShow from startIndex
    setWordsShow(prev => { 
      const newWords = [...prev];
      results.forEach((result, index) => {
        newWords[index] = result;
      });
      return newWords;
    });
  }, [category, wordsShow]);

  useEffect(() => {
    loadWordData();
  }, [loadWordData]);

  const handleNextPage = () => {
    if (currentPage * WORDS_PER_PAGE < (category ? totalItems : wordsParams.length)) {
      setCurrentPage(prev => prev + 1);
      setIsLoading(true);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
      setIsLoading(true);
    }
  };

  const handleNextWord = () => {
    if (currentIndex < wordsShow.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setShowMeaning(autoShowMeaning);
    }
  };

  const handlePrevWord = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setShowMeaning(autoShowMeaning);
    }
  };

  const toggleFlashcardMode = async () => {
    if (category) {
      // get all words from category via api
      try {
        const response = await fetchVocabularyItems(
          category, 1, totalItems
        );    
        setWordsShow(response.result);
      } catch (error) {
        console.error('Error fetching vocabulary items:', error);
      }
    } else {
      setWordsShow(wordsParams);
    }
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
    const backRouteParam = searchParams.get('backRoute');
    if (routeBack) {
      navigate(`${routeBack}`);
    } else if (backRouteParam) {
      navigate(`${backRouteParam}`);
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

  const currentWord = category ? wordsShow[currentIndex] : wordsParams[currentIndex];

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
                  <HStack width="100%" justify="space-between" mb={2}>
                    <Text fontSize="sm" color="gray.500" fontWeight="bold">
                      {currentIndex + 1} / {category ? totalItems : wordsParams.length}
                    </Text>
                    <VStack spacing={2} align="flex-end">
                      <IconButton
                        aria-label="Phát âm"
                        icon={<FaVolumeUp />}
                        onClick={(e) => {
                          e.stopPropagation();
                          playPronunciation(currentWord.w);
                        }}
                        colorScheme="blue"
                        variant="ghost"
                        size="sm"
                      />
                      <IconButton
                        aria-label={autoShowMeaning ? "Tắt tự động hiện nghĩa" : "Bật tự động hiện nghĩa"}
                        icon={autoShowMeaning ? <FaEye /> : <FaEyeSlash />}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAutoShowMeaning(!autoShowMeaning);
                          setShowMeaning(!autoShowMeaning);
                        }}
                        colorScheme={autoShowMeaning ? "green" : "gray"}
                        variant="ghost"
                        size="sm"
                      />
                    </VStack>
                  </HStack>
                  <Text fontSize="4xl" fontWeight="bold" color={textColor}>
                    {currentWord.w}
                  </Text>
                  {showMeaning && (
                    <>
                      <Text fontSize="xl" color={pinyinColor}>
                        {currentWord.p}
                      </Text>
                      <Text fontSize="lg" color={meaningColor}>
                        {currentWord.m}
                      </Text>
                    </>
                  )}
                  <HStack spacing={4} mt={4}>
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
                      isDisabled={currentIndex === wordsShow.length - 1}
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
                {wordsShow && wordsShow.map((word, index) => {
                    return (
                      <Card
                        bg={bgColor}
                        borderWidth="1px"
                        borderColor={borderColor}
                        boxShadow="md"
                      >
                        <CardBody>
                          <VStack align="start" spacing={2}>
                            <HStack width="100%" justify="space-between">
                              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                                {word.w}
                              </Text>
                              <IconButton
                                aria-label="Phát âm"
                                icon={<FaVolumeUp />}
                                onClick={() => playPronunciation(word.w)}
                                colorScheme="blue"
                                variant="ghost"
                                size="sm"
                              />
                            </HStack>
                            {
                              word.isLoading ? (
                                <Spinner size="sm" color="blue.500" />
                              ) : (
                                <>
                                  <Text color={pinyinColor}>
                                    {word.p}
                                  </Text>
                                  <Text color={meaningColor}>
                                    {word.m}
                                  </Text>
                                </>
                              )
                            }
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
                <Text fontWeight="bold">Trang {currentPage} / {Math.ceil((category ? totalItems : wordsParams.length) / WORDS_PER_PAGE)}</Text>
                <Button
                  rightIcon={<ChevronRightIcon />}
                  onClick={handleNextPage}
                  isDisabled={currentPage * WORDS_PER_PAGE >= (category ? totalItems : wordsParams.length)}
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