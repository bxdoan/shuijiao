// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Textarea,
  Button,
  Flex,
  Divider,
  useToast,
  IconButton,
  Select,
  useColorModeValue,
  Switch,
  FormControl,
  FormLabel,
  VStack,
  useClipboard,
  Tooltip,
  keyframes,
} from '@chakra-ui/react';
import { RepeatIcon, CopyIcon, CloseIcon, ArrowRightIcon } from '@chakra-ui/icons';
import { fetchGoogleTranslation } from '../api/newsApi';
import SEO from '../components/Common/SEO';
import { DonationBox } from '../components/Common/DonationBox';

// Animation keyframes
const rotateAnimation = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(180deg); }
`;

// Ngôn ngữ hỗ trợ
const LANGUAGES = [
  { code: 'zh', name: 'Tiếng Trung' },
  { code: 'en', name: 'Tiếng Anh' },
  { code: 'vi', name: 'Tiếng Việt' },
];

const TranslatePage: React.FC = () => {
  const [sourceText, setSourceText] = useState('');
  const [translatedText, setTranslatedText] = useState('');
  const [sourceLang, setSourceLang] = useState('zh');
  const [targetLang, setTargetLang] = useState('vi');
  const [isLoading, setIsLoading] = useState(false);
  const [isAutoTranslate, setIsAutoTranslate] = useState(false);
  const [translationHistory, setTranslationHistory] = useState<Array<{ source: string, target: string, sourceLang: string, targetLang: string }>>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isRotating, setIsRotating] = useState(false);
  
  // Debounce timeout reference
  const debounceTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Toast notifications
  const toast = useToast();
  
  // Colors
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textareaColor = useColorModeValue('gray.50', 'gray.700');
  const historyHoverBg = useColorModeValue('gray.50', 'gray.700');
  
  // Clipboard
  const { hasCopied, onCopy } = useClipboard(translatedText);

  // Swap languages
  const handleSwapLanguages = () => {
    setIsRotating(true);
    setTimeout(() => {
      setSourceLang(targetLang);
      setTargetLang(sourceLang);
      setSourceText(translatedText);
      setTranslatedText(sourceText);
      setTimeout(() => {
        setIsRotating(false);
      }, 300);
    }, 300);
  };

  // Clear text
  const handleClearText = () => {
    setSourceText('');
    setTranslatedText('');
    setErrorMessage('');
  };

  // Thực hiện dịch
  const handleTranslate = async () => {
    if (!sourceText.trim()) {
      setTranslatedText('');
      return;
    }

    setIsLoading(true);
    setErrorMessage('');

    try {
      const result = await fetchGoogleTranslation(sourceText, targetLang, sourceLang);
      setTranslatedText(result);
      
      // Lưu vào lịch sử dịch nếu không phải auto translate
      if (!isAutoTranslate) {
        setTranslationHistory(prev => {
          const newHistory = [{ 
            source: sourceText, 
            target: result, 
            sourceLang, 
            targetLang 
          }, ...prev.slice(0, 9)]; // Giữ tối đa 10 mục
          
          // Lưu vào localStorage
          localStorage.setItem('translationHistory', JSON.stringify(newHistory));
          
          return newHistory;
        });
      }
    } catch (error) {
      console.error('Translation error:', error);
      setErrorMessage('Không thể dịch văn bản. Vui lòng thử lại sau.');
      toast({
        title: 'Lỗi dịch',
        description: 'Không thể dịch văn bản. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Auto translate với debounce
  useEffect(() => {
    if (isAutoTranslate && sourceText.trim()) {
      // Clear previous timeout
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
      
      // Set new timeout
      debounceTimeout.current = setTimeout(() => {
        handleTranslate();
      }, 1000); // Đợi 1 giây sau khi ngừng gõ
    }
    
    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sourceText, isAutoTranslate, sourceLang, targetLang]);

  // Load translation history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('translationHistory');
    if (savedHistory) {
      try {
        setTranslationHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error parsing translation history:', e);
      }
    }
  }, []);

  // Tải lại một bản dịch từ lịch sử
  const loadFromHistory = (historyItem: any) => {
    setSourceLang(historyItem.sourceLang);
    setTargetLang(historyItem.targetLang);
    setSourceText(historyItem.source);
    setTranslatedText(historyItem.target);
  };

  return (
    <>
      <SEO 
        title="Dịch văn bản - Shuijiao"
        description="Công cụ dịch văn bản đa ngôn ngữ giữa tiếng Việt, tiếng Trung và tiếng Anh."
        keywords="dịch văn bản, dịch tiếng Trung, dịch tiếng Anh, tiếng Việt, Shuijiao"
        ogType="website"
      />
      <Container maxW="container.xl" py={8}>
        <FormControl display="flex" alignItems="center" justifyContent="center" mb={4}>
          <FormLabel htmlFor="auto-translate" mb="0" mr={4}>
            Dịch tự động
          </FormLabel>
          <Switch 
            id="auto-translate" 
            isChecked={isAutoTranslate}
            onChange={() => setIsAutoTranslate(!isAutoTranslate)}
            colorScheme="blue"
          />
        </FormControl>

        <Box position="relative">
          <Flex 
            direction={{ base: "column", md: "row" }}
            gap={{ base: 6, md: 1 }}
          >
            <Box 
              flex="1" 
              borderWidth="1px" 
              borderRadius="lg" 
              p={6}
              borderColor={borderColor}
              bg={bgColor}
              boxShadow="md"
            >
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="md" textAlign="center">
                  <Select 
                    value={sourceLang}
                    onChange={(e) => setSourceLang(e.target.value)}
                    width="100%"
                    variant="filled"
                    size="md"
                    borderRadius="md"
                    mb={2}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={`source-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Select>
                </Heading>
                
                <Box position="relative">
                  <Textarea
                    placeholder={`Nhập văn bản ${LANGUAGES.find(l => l.code === sourceLang)?.name}`}
                    value={sourceText}
                    onChange={(e) => setSourceText(e.target.value)}
                    height="300px"
                    bg={textareaColor}
                    resize="vertical"
                  />
                  
                  {sourceText && (
                    <IconButton
                      aria-label="Xóa văn bản"
                      icon={<CloseIcon />}
                      size="sm"
                      position="absolute"
                      top="2"
                      right="2"
                      onClick={handleClearText}
                    />
                  )}
                </Box>
              </VStack>
            </Box>
            
            <Box 
              flex="1" 
              borderWidth="1px" 
              borderRadius="lg" 
              p={6}
              borderColor={borderColor}
              bg={bgColor}
              boxShadow="md"
            >
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="md" textAlign="center">
                  <Select 
                    value={targetLang}
                    onChange={(e) => setTargetLang(e.target.value)}
                    width="100%"
                    variant="filled"
                    size="md"
                    borderRadius="md"
                    mb={2}
                  >
                    {LANGUAGES.map((lang) => (
                      <option key={`target-${lang.code}`} value={lang.code}>
                        {lang.name}
                      </option>
                    ))}
                  </Select>
                </Heading>
                
                <Box position="relative">
                  <Textarea
                    placeholder={`Kết quả dịch sang ${LANGUAGES.find(l => l.code === targetLang)?.name}`}
                    value={translatedText}
                    isReadOnly
                    height="300px"
                    bg={textareaColor}
                    resize="vertical"
                  />
                  
                  {translatedText && (
                    <Tooltip
                      hasArrow
                      label={hasCopied ? "Đã sao chép!" : "Sao chép"}
                      placement="top"
                    >
                      <IconButton
                        aria-label="Sao chép văn bản"
                        icon={<CopyIcon />}
                        size="sm"
                        position="absolute"
                        top="2"
                        right="2"
                        onClick={onCopy}
                      />
                    </Tooltip>
                  )}
                </Box>
                
                <Button 
                  colorScheme="blue" 
                  rightIcon={<ArrowRightIcon />}
                  onClick={handleTranslate}
                  isLoading={isLoading}
                  isDisabled={!sourceText.trim() || isAutoTranslate}
                  loadingText="Đang dịch..."
                >
                  Dịch
                </Button>
                
                {errorMessage && (
                  <Box color="red.500" mt={2}>
                    <Text>{errorMessage}</Text>
                  </Box>
                )}
              </VStack>
            </Box>
          </Flex>
          
          {/* Nút swap language nằm chính giữa, nổi trên đường biên giữa hai box */}
          <Box 
            position="absolute"
            top={{ base: "auto", md: "50%" }}
            left={{ base: "50%", md: "50%" }}
            bottom={{ base: "calc(50% + 3px)", md: "auto" }} /* Đặt ở giữa theo chiều dọc trên mobile */
            transform={{ base: "translateX(-50%)", md: "translate(-50%, -50%)" }}
            zIndex={2}
            display="block"
          >
            <IconButton
              aria-label="Đổi ngôn ngữ"
              icon={<RepeatIcon />}
              onClick={handleSwapLanguages}
              colorScheme="blue"
              size="lg"
              isRound={false}
              boxShadow="lg"
              borderRadius="40px" /* Tạo hình oval đứng */
              height="60px"
              width="40px"
              animation={isRotating ? `${rotateAnimation} 0.6s ease-in-out` : 'none'}
              transform="none" // Loại bỏ transform để chỉ xoay tại chỗ khi được trigger
            />
          </Box>
        </Box>
        
        <Box 
          mt={8}
          borderWidth="1px" 
          borderRadius="lg"
          borderColor={borderColor}
          bg={bgColor}
          boxShadow="md"
          p={6}
        >
          <Flex direction={{ base: "column", md: "row" }} gap={6}>
            <Box flex="1">
              <DonationBox 
                title="Ủng hộ Shuijiao"
                description="Giúp chúng tôi duy trì và phát triển dịch vụ này miễn phí"
              />
            </Box>
            
            <Box width={{ base: "100%", md: "40%" }}>
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="md">
                  Lịch sử dịch
                </Heading>
                
                <Divider />
                
                {translationHistory.length > 0 ? (
                  translationHistory.map((item, index) => (
                    <Box 
                      key={index} 
                      p={3} 
                      borderWidth="1px" 
                      borderRadius="md"
                      _hover={{ bg: historyHoverBg }}
                      cursor="pointer"
                      onClick={() => loadFromHistory(item)}
                    >
                      <Text noOfLines={1} fontWeight="bold">
                        {item.source.slice(0, 50)}{item.source.length > 50 ? '...' : ''}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        {LANGUAGES.find(l => l.code === item.sourceLang)?.name} → 
                        {LANGUAGES.find(l => l.code === item.targetLang)?.name}
                      </Text>
                    </Box>
                  ))
                ) : (
                  <Text color="gray.500" textAlign="center" py={4}>
                    Chưa có lịch sử dịch
                  </Text>
                )}
              </VStack>
            </Box>
          </Flex>
        </Box>
        
        <Box mt={10}>
          <Heading as="h2" size="lg" mb={4}>
            Giới thiệu về công cụ dịch
          </Heading>
          <Text>
            Công cụ dịch của Shuijiao giúp bạn dịch văn bản giữa tiếng Việt, tiếng Trung và tiếng Anh một cách nhanh chóng và chính xác. 
            Dịch vụ này sử dụng công nghệ dịch máy tự động để cung cấp kết quả dịch với chất lượng tốt nhất.
          </Text>
          <Text mt={2}>
            Bạn có thể chọn chế độ dịch tự động để nhận kết quả dịch ngay khi nhập văn bản, hoặc nhấn nút Dịch để kiểm soát khi nào thực hiện dịch.
            Hỗ trợ dịch cả đoạn văn dài và có thể dùng để học ngôn ngữ hiệu quả.
          </Text>
        </Box>
      </Container>
    </>
  );
};

export default TranslatePage;
