// @ts-nocheck - Bỏ qua kiểm tra TypeScript để đơn giản hóa
import React, { useState, useRef, useEffect } from 'react';
import {
  Box,
  Button,
  Input,
  InputGroup,
  InputRightElement,
  Flex,
  Text,
  Badge,
  Spinner,
  useColorModeValue,
  useDisclosure,
  VStack,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useBreakpointValue,
  Tooltip,
  // @ts-ignore
} from '@chakra-ui/react';
import { SearchIcon, CloseIcon } from '@chakra-ui/icons';

// Import mock data for testing
import { mockSearchResponse, mockEmptySearchResponse } from '../../data_example/chinese_search_mock';

// Cấu hình để sử dụng mock data thay cho API thật
const USE_MOCK_DATA = false; // Set to true for testing with mock data

// Types
interface WordSearchResult {
  id: number;
  word: string;
  pinyin: string;
  cn_vi: string;
  kind: string[];
  content: Array<{
    kind: string;
    means: Array<{
      mean: string;
      explain: string;
      examples: Array<{
        e: string;
        p: string;
        m: string;
      }>;
    }>;
  }>;
  rank?: number;
  lv_hsk_new?: string;
  lv_tocfl?: number;
  compound?: string | null;
}

interface SearchResponse {
  total: number;
  found: boolean;
  result: WordSearchResult[];
  query: string;
}

interface ChineseSearchProps {
  useMockData?: boolean;
  targetLang?: string;
}

const ChineseSearch: React.FC<ChineseSearchProps> = ({
    useMockData = USE_MOCK_DATA,
    targetLang = 'vi'
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [isSelectionSearch, setIsSelectionSearch] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // @ts-ignore - Chakra UI types are complex
  const btnRef = useRef<HTMLButtonElement>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const searchBgColor = useColorModeValue('blue.50', 'gray.700');
  
  // Responsive settings
  const drawerSize = useBreakpointValue({ base: 'full', md: 'md' }) as string;
  
  // Handle search
  const handleSearch = async (term = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    
    // Sử dụng mock data nếu được cấu hình
    if (useMockData) {
      setTimeout(() => {
        // Mô phỏng độ trễ của mạng
        if (term === 'empty') {
          setSearchResults(mockEmptySearchResponse);
        } else {
          setSearchResults(mockSearchResponse);
        }
        setIsLoading(false);
      }, 500);
      return;
    }
    
    try {
      const response = await fetch(
        `https://api.hanzii.net/api/search/${targetLang}/${encodeURIComponent(term)}?type=word&page=1&limit=10`,
        {
          method: 'GET',
          headers: {
          'accept': 'application/json, text/plain, */*',
          'authorization': 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS',
          'origin': 'https://easychinese.io',
          'referer': 'https://easychinese.io/'
        }
      });
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const data = await response.json();
      setSearchResults(data);

      // Chỉ tự động mở drawer khi có kết quả tìm kiếm từ text selection
      if (isSelectionSearch && data.found && data.result.length > 0) {
        onOpen();
      }
      
    } catch (error) {
      setIsSelectionSearch(false);
      console.error('Error searching for word:', error);
    } finally {
      setIsLoading(false);
      setIsSelectionSearch(false);
    }
  };
  
  // Auto-search on term change (with debounce)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        handleSearch();
      }
    }, 500);
    
    return () => clearTimeout(timer);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm]);
  
  // Focus input when opened
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isOpen]);
  
  // Listener for text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return; // Không có chọn hoặc chọn trống
      
      const selectedText = selection.toString().trim();

      // Chỉ xử lý khi chọn ít hơn 20 ký tự (tránh việc chọn cả câu)
      if (selectedText && selectedText.length < 20) {
        setSearchTerm(selectedText);
        setIsSelectionSearch(true);
        handleSearch(selectedText);
      }
    };
    
    // Thêm sự kiện mouseup để bắt khi người dùng thả chuột sau khi chọn text
    document.addEventListener('mouseup', handleSelectionChange);
    
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);
  
  // Render word types
  const renderWordTypes = (types: string[] | undefined) => {
    if (!types || types.length === 0) return null;
    
    const typeMap: Record<string, string> = {
      'n': 'Danh từ',
      'v': 'Động từ',
      'adj': 'Tính từ',
      'adv': 'Trạng từ',
      'conj': 'Liên từ',
      'prep': 'Giới từ',
      'pron': 'Đại từ',
      'num': 'Số từ',
      'interj': 'Thán từ',
      'pref': 'Tiền tố',
      'suff': 'Hậu tố',
      'measure': 'Lượng từ',
    };
    
    return (
      <Flex wrap="wrap" gap={1} mt={1}>
        {types.map((type, index) => (
          <Badge key={index} colorScheme="blue" fontSize="xs">
            {typeMap[type] || type}
          </Badge>
        ))}
      </Flex>
    );
  };
  
  // Render examples
  const renderExamples = (examples: Array<{ e: string; p: string; m: string }>) => {
    if (!examples || examples.length === 0) return null;
    
    return (
      <Box mt={2} pl={2} borderLeft="2px" borderColor="blue.500">
        {examples.map((example, index) => (
          <Box key={index} mb={2}>
            <Text fontWeight="semibold">{example.e}</Text>
            <Text fontStyle="italic" fontSize="sm">{example.p}</Text>
            <Text color="blue.600">{example.m}</Text>
          </Box>
        ))}
      </Box>
    );
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseDrawer = () => {
    setSearchTerm('');
    setSearchResults(null);
    setIsSelectionSearch(false);
    onClose();
  }
  
  // Floating button for mobile and desktop
  const FloatingButton = () => (
    <Box
      position="fixed"
      bottom="24px"
      right="12px"
      zIndex={10}
      background="transparent"
      p={0}
      m={0}
      lineHeight={0}
      borderRadius={0}
    >
      <Tooltip label="Từ điển Hán - Việt" placement="left">
        <Box
          as="img" 
          src={process.env.PUBLIC_URL + "/shuijiao.png"}
          alt="Shuijiao Dictionary"
          width="40px"
          height="40px"
        display="block"
        cursor="pointer"
        onClick={onOpen}
        _hover={{ transform: 'scale(1.1)' }}
          transition="all 0.2s"
        />
      </Tooltip>    
    </Box>
  );
  
  return (
    <>
      <FloatingButton />
      
      <Drawer
        isOpen={isOpen}
        placement="bottom"
        onClose={handleCloseDrawer}
        // @ts-ignore - Chakra UI type issue
        finalFocusRef={btnRef}
        size={drawerSize}
      >
        <DrawerOverlay backdropFilter="none" bg="rgba(0, 0, 0, 0.1)" />
        <DrawerContent 
          maxHeight="50vh" 
          overflowY="auto"
          width={{ base: "100%", md: "400px" }}
          borderTopLeftRadius="lg"
          position="fixed"
          right="0"
          bottom="0"
          marginRight={{ base: "0", md: "24px" }}
          marginLeft="auto"
          left="auto"
          insetInlineEnd="24px"
          insetInlineStart="auto"
          boxShadow="lg"
          style={{ 
            marginLeft: 'auto',
            transform: 'none !important'
          }}
        >
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px" display="flex" alignItems="center">
            <Box
              as="img" 
              src={process.env.PUBLIC_URL + "/shuijiao.png"} 
              alt="Shuijiao Logo" 
              width="24px" 
              height="24px" 
              mr={2}
              display="block"
            />
            Từ điển Hán - Việt
          </DrawerHeader>
          
          <DrawerBody p={3}>
            <VStack spacing={4} align="stretch">
              <Box>
                <InputGroup size="md">
                  <Input
                    ref={inputRef}
                    placeholder="Nhập từ vựng tiếng Trung hoặc tiếng Việt..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    bg={searchBgColor}
                    borderRadius="md"
                    pr="4.5rem"
                  />
                  <InputRightElement width="4.5rem">
                    {searchTerm ? (
                      <Button 
                        h="1.75rem" 
                        size="sm" 
                        mr={1} 
                        onClick={handleClearSearch}
                        variant="ghost"
                      >
                        <CloseIcon boxSize={3} />
                      </Button>
                    ) : null}
                    <Button 
                      h="1.75rem" 
                      size="sm" 
                      onClick={() => handleSearch()}
                      colorScheme="blue"
                      isLoading={isLoading}
                      disabled={!searchTerm.trim()}
                    >
                      <SearchIcon />
                    </Button>
                  </InputRightElement>
                </InputGroup>
              </Box>
              
              {isLoading ? (
                <Flex justify="center" py={8}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                </Flex>
              ) : searchResults ? (
                <VStack spacing={4} align="stretch" mt={2} overflow="auto">
                  {searchResults.found && searchResults.result.length > 0 ? (
                    <>
                      <Text fontSize="sm" color="gray.500">
                        Tìm thấy {searchResults.total} kết quả cho "{searchResults.query}"
                      </Text>
                      
                      {searchResults.result.map((item, index) => (
                        <Box 
                          key={index}
                          p={4}
                          borderWidth="1px"
                          borderRadius="md"
                          borderColor={borderColor}
                          bg={bgColor}
                          boxShadow="sm"
                          _hover={{ boxShadow: "md" }}
                          transition="all 0.2s"
                        >
                          <Flex justify="space-between" align="flex-start">
                            <Box>
                              <Text fontSize="xl" fontWeight="bold">{item.word}</Text>
                              <Text fontSize="md" fontStyle="italic" color="gray.600">{item.pinyin}</Text>
                              <Text color="blue.600" fontWeight="semibold">{item.cn_vi}</Text>
                              {renderWordTypes(item.kind)}
                            </Box>
                            <Box>
                              {item.lv_hsk_new && (
                                <Badge colorScheme="green" variant="solid" borderRadius="full" px={2}>
                                  HSK {item.lv_hsk_new}
                                </Badge>
                              )}
                            </Box>
                          </Flex>
                          
                          <Box mt={3}>
                            {item.content.map((content, idx) => (
                              <Box key={idx} mb={3}>
                                {content.means.map((meaningItem, meaningIdx) => (
                                  <Box key={meaningIdx} mb={2}>
                                    <Text fontWeight="medium">{meaningItem.mean}</Text>
                                    {meaningItem.explain && (
                                      <Text fontSize="sm" color="gray.600" mt={1}>
                                        {meaningItem.explain}
                                      </Text>
                                    )}
                                    {isExpanded && renderExamples(meaningItem.examples)}
                                  </Box>
                                ))}
                              </Box>
                            ))}
                          </Box>
                          
                          {item.compound && (
                            <Box mt={2}>
                              <Text fontSize="sm" fontWeight="medium">Từ ghép:</Text>
                              <Text fontSize="sm">{item.compound.replace(/;/g, ', ')}</Text>
                            </Box>
                          )}
                          
                          {item.content[0]?.means[0]?.examples?.length > 0 && (
                            <Button
                              size="xs"
                              variant="ghost"
                              colorScheme="blue"
                              mt={2}
                              onClick={() => setIsExpanded(!isExpanded)}
                            >
                              {isExpanded ? "Ẩn ví dụ" : "Xem ví dụ"}
                            </Button>
                          )}
                        </Box>
                      ))}
                    </>
                  ) : (
                    <Box 
                      p={4} 
                      textAlign="center" 
                      borderWidth="1px" 
                      borderRadius="md"
                      borderColor={borderColor}
                    >
                      <Text>Không tìm thấy kết quả nào cho "{searchResults.query}"</Text>
                    </Box>
                  )}
                </VStack>
              ) : null}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChineseSearch; 