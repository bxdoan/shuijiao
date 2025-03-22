// @ts-nocheck - Skip TypeScript checking to simplify
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
  VStack,
  IconButton,
  Container,
  Heading,
  Card,
  CardBody,
  Grid,
  GridItem,
  List,
  ListItem,
  Wrap,
  WrapItem,
} from '@chakra-ui/react';
import {
  SearchIcon,
  CloseIcon,
  RepeatIcon
} from '@chakra-ui/icons';

// Import API functions
import { 
  fetchDictionary,
  fetchSuggestions,
  SearchResponse, 
  KanjiResponse,
} from '../../api/newsApi';

interface ChineseDictProps {
  targetLang?: string;
}

const ChineseDict: React.FC<ChineseDictProps> = ({
    targetLang = 'vi'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [hantuResults, setHantuResults] = useState<KanjiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHantu, setIsLoadingHantu] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [strokesKey, setStrokesKey] = useState(0);
  const skipEffectRef = useRef(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  // Suggestions state
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const suggestionsRef = useRef<HTMLDivElement>(null);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const searchBgColor = useColorModeValue('blue.50', 'gray.700');
  const suggestionBgColor = useColorModeValue('white', 'gray.700');
  const suggestionHoverBgColor = useColorModeValue('blue.50', 'gray.600');
  
  // Thêm state để quản lý số lượng kết quả hiển thị
  const [visibleResults, setVisibleResults] = useState(1);
  
  // Process suggestion item to extract word, pinyin, and meaning
  const processSuggestionItem = (item: string) => {
    if (!item) return { word: '', pinyin: '', meaning: '' };
    
    // Format is like: "she","æ²#she#shÃ©#bÃ³i lÃ¡"
    // or "社#she#shè#xã; toà/thần đất; thổ địa; thổ thần"
    const parts = item.split('#');
    
    // If format is different, just return the original item
    if (parts.length < 3) return { word: item, pinyin: '', meaning: '' };
    
    return {
      word: parts[0],
      pinyin: parts[2] || '',
      meaning: parts[3] || ''
    };
  };
  
  // Handle search
  const handleSearch = async (term = searchTerm) => {
    if (!term.trim()) return;
    
    // Hide suggestions
    setShowSuggestions(false);
    
    setIsLoading(true);
    setVisibleResults(1); // Reset về chỉ hiển thị kết quả đầu tiên
    
    try {
      // Call the search API using the function from newsApi.ts
      const data = await fetchDictionary(term, targetLang, 'word') as SearchResponse;
      
      setSearchResults(data);
      
      // Add to search history if not already present and found results
      if (data?.found) {
        setSearchHistory(prevHistory => {
          // Remove the term if it already exists
          const filteredHistory = prevHistory.filter(item => item !== term);
          // Add the term to the beginning of the array
          const newHistory = [term, ...filteredHistory];
          // Limit to 30 terms
          return newHistory.slice(0, 30);
        });
      }

      // After successful word search, call kanji data API
      if (data && data.found && data.result.length > 0) {
        handleHantuSearch(term);
      }
      
    } catch (error) {
      console.error('Error searching for word:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Handle kanji search
  const handleHantuSearch = async (term = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoadingHantu(true);
    
    try {
      // Call the kanji search API using the function from newsApi.ts
      const data = await fetchDictionary(term, targetLang, 'kanji') as KanjiResponse;
      
      setHantuResults(data);
      
    } catch (error) {
      console.error('Error searching for hantu:', error);
    } finally {
      setIsLoadingHantu(false);
    }
  };
  
  // Fetch suggestions when searchTerm changes
  useEffect(() => {
    const fetchSuggestionsData = async () => {
      if (searchTerm.trim().length < 1) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      
      setIsFetchingSuggestions(true);
      
      try {
        const suggestionsData = await fetchSuggestions(searchTerm);
        setSuggestions(suggestionsData);
        setShowSuggestions(suggestionsData.length > 0);
      } catch (error) {
        console.error('Error fetching suggestions:', error);
      } finally {
        setIsFetchingSuggestions(false);
      }
    };
    
    // If API was called from text selection, skip this time
    if (skipEffectRef.current) {
      skipEffectRef.current = false;
      return;
    }
    
    // Debounce the suggestions request
    const timer = setTimeout(() => {
      if (searchTerm.trim()) {
        fetchSuggestionsData();
      }
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  
  // Handle click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  // Focus input when component mounts
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);
  
  // Load search history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('zh_dict');
    if (savedHistory) {
      try {
        setSearchHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('Error loading search history:', e);
      }
    }
  }, []);
  
  // Save search history to localStorage
  useEffect(() => {
    if (searchHistory.length > 0) {
      localStorage.setItem('zh_dict', JSON.stringify(searchHistory));
    }
  }, [searchHistory]);
  
  // Handle select suggestion
  const handleSelectSuggestion = (suggestion: string) => {
    const { word } = processSuggestionItem(suggestion);
    setSearchTerm(word);
    setShowSuggestions(false);
    handleSearch(word);
  };
  
  // Handle key navigation in suggestions
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showSuggestions) return;
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      // TODO: Implement arrow key navigation in suggestions
      // This would require keeping track of the selected index
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };
  
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

  // HantuStrokeRenderer component
  const HantuStrokeRenderer: React.FC<{ strokesData: string, strokesKey: number }> = ({ strokesData, strokesKey }) => {
    // State to manage stroke display
    const [visibleStrokes, setVisibleStrokes] = useState<number>(0);
    // State variable to store strokes
    const [strokes, setStrokes] = useState<string[]>([]);
    
    // Parse stroke data when strokesData changes
    useEffect(() => {
      if (!strokesData) return;
      
      // Parse stroke data
      let parsedStrokes: string[] = [];
      
      try {
        // Case 1: Data is already JSON
        try {
          const strokesObj = JSON.parse(strokesData);
          if (strokesObj.strokes && Array.isArray(strokesObj.strokes)) {
            // Format { strokes: [...] }
            parsedStrokes = strokesObj.strokes;
          } else if (Array.isArray(strokesObj)) {
            // Format is directly an array
            parsedStrokes = strokesObj;
          }
        } catch (e) {
          // Not JSON, could be a string
        }
        
        // Case 2: Data is a string containing SVG path commands
        if (parsedStrokes.length === 0 && typeof strokesData === 'string') {
          // Split strokes based on "M " (move command in SVG path)
          // Use regex to find all paths starting with M
          const matches = strokesData.match(/M[^M]+/g);
          if (matches && matches.length > 0) {
            parsedStrokes = matches.map(m => m.trim());
          }
        }
        
        // Case 3: Parse from console.log format
        if (parsedStrokes.length === 0 && typeof strokesData === 'string') {
          // Handle data from console.log like: "strokes: M ... Z, M ... Z"
          // Remove "strokes: " if present
          let cleanData = strokesData;
          if (cleanData.includes('strokes:')) {
            cleanData = cleanData.split('strokes:')[1].trim();
          }
          
          // Split based on comma when encountering M at beginning of next part
          const pathsArray = [];
          let currentPath = '';
          
          // Split string by commas
          const parts = cleanData.split(',');
          
          for (let i = 0; i < parts.length; i++) {
            const part = parts[i].trim();
            
            // If this part starts with M, start a new path
            if (part.startsWith('M ')) {
              if (currentPath) {
                pathsArray.push(currentPath);
              }
              currentPath = part;
            } else if (currentPath) {
              // Otherwise, add to current path
              currentPath += ', ' + part;
            }
          }
          
          // Add the last path if exists
          if (currentPath) {
            pathsArray.push(currentPath);
          }
          
          if (pathsArray.length > 0) {
            parsedStrokes = pathsArray;
          }
        }
        
        // Save strokes to state
        setStrokes(parsedStrokes);
      } catch (error) {
        console.error('Error parsing strokes data:', error);
        setStrokes([]);
      }
    }, [strokesData]);
    
    // Effect to display each stroke when strokesKey changes
    useEffect(() => {
      if (!strokesData || strokes.length === 0) return;
      
      // Reset visible strokes count
      setVisibleStrokes(0);
      
      // Create effect to display strokes with delay
      let strokeIndex = 0;
      const intervalId = setInterval(() => {
        setVisibleStrokes(prev => {
          strokeIndex = prev + 1;
          // If all strokes are shown, stop
          if (strokeIndex >= strokes.length) {
            clearInterval(intervalId);
          }
          return strokeIndex;
        });
      }, 200); // Stroke display speed - 200ms
      
      return () => clearInterval(intervalId);
    }, [strokesKey, strokesData, strokes]);
    
    if (!strokesData || strokes.length === 0) return null;
    
    // CSS Keyframes for animation
    const keyframes = `
      @keyframes drawStroke {
        0% {
          stroke-dasharray: 2000;
          stroke-dashoffset: 2000;
        }
        100% {
          stroke-dasharray: 2000;
          stroke-dashoffset: 0;
        }
      }
    `;
    
    return (
      <Box width="100%" display="flex" flexDirection="column" alignItems="center" my={4}>
        <Box position="relative" width="200px" height="200px">
          <IconButton
            aria-label="Vẽ lại hán tự"
            icon={<RepeatIcon />}
            size="sm"
            colorScheme="blue"
            variant="ghost"
            position="absolute"
            top="0"
            right="0"
            zIndex="1"
            onClick={() => setStrokesKey(prev => prev + 1)}
          />
          <style dangerouslySetInnerHTML={{ __html: keyframes }} />
          <svg 
            viewBox="0 0 1024 1024" 
            width="200" 
            height="200"
          >
            <g transform="scale(1, -1) translate(0, -900)">
              {strokes.slice(0, visibleStrokes).map((path, index) => (
                <path
                  key={index}
                  d={path}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="30"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  style={{
                    animation: `drawStroke 0.5s ease forwards`
                  }}
                />
              ))}
            </g>
          </svg>
        </Box>
        <Text fontSize="sm" color="gray.600" mt={2}>
          {visibleStrokes}/{strokes.length} nét
        </Text>
      </Box>
    );
  };

  // Function to render SVG of kanji
  const renderHantuStroke = (strokesData: string) => {
    if (!strokesData) return null;
    
    // Use new component
    return (
      <Box width="100%" display="flex" flexDirection="column" alignItems="center" my={4}>
        <HantuStrokeRenderer strokesData={strokesData} strokesKey={strokesKey} />
      </Box>
    );
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSuggestions([]);
    setShowSuggestions(false);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  // Render search history component
  const renderSearchHistory = () => {
    if (!searchHistory.length) return null;
    
    return (
      <Box mt={4}>
        <Flex flexWrap="wrap" gap={2}>
          {searchHistory.slice(0, 20).map((term, index) => (
            <Badge 
              key={index} 
              colorScheme="blue" 
              cursor="pointer" 
              px={2} 
              py={1}
              borderRadius="full"
              onClick={() => {
                setSearchTerm(term);
                handleSearch(term);
              }}
              _hover={{ opacity: 0.8 }}
            >
              {term}
            </Badge>
          ))}
        </Flex>
      </Box>
    );
  };
  
  // Render suggestions list
  const renderSuggestions = () => {
    if (!showSuggestions || suggestions.length === 0) return null;
    
    return (
      <Box
        ref={suggestionsRef}
        position="absolute"
        top="100%"
        left="0"
        right="0"
        zIndex="10"
        mt={2}
        borderWidth="1px"
        borderColor={borderColor}
        borderRadius="md"
        bg={suggestionBgColor}
        boxShadow="md"
        maxH="300px"
        overflowY="auto"
      >
        <List spacing={0}>
          {suggestions.map((suggestion, index) => {
            const { word, pinyin, meaning } = processSuggestionItem(suggestion);
            return (
              <ListItem
                key={index}
                px={4}
                py={2}
                cursor="pointer"
                _hover={{ bg: suggestionHoverBgColor }}
                onClick={() => handleSelectSuggestion(suggestion)}
                borderBottomWidth={index < suggestions.length - 1 ? "1px" : "0"}
                borderColor={borderColor}
              >
                <Flex justify="space-between" align="center">
                  <Box>
                    <Text fontWeight="bold">{word}</Text>
                    {pinyin && (
                      <Text fontSize="sm" fontStyle="italic" color="gray.500">
                        {pinyin}
                      </Text>
                    )}
                  </Box>
                  {meaning && (
                    <Text fontSize="sm" color="blue.600" maxW="70%" textAlign="right" noOfLines={1}>
                      {meaning}
                    </Text>
                  )}
                </Flex>
              </ListItem>
            );
          })}
        </List>
      </Box>
    );
  };
  
  // Thêm hàm xử lý khi người dùng bấm xem thêm
  const handleLoadMore = () => {
    setVisibleResults(prev => prev + 5);
  };
  
  return (
    <Container maxW="container.xl" py={8}>
      <Heading as="h1" size="xl" mb={6} textAlign="center">
        Từ điển Hán Việt
      </Heading>
      
      <Flex justifyContent="center" mb={6}>
        <Box position="relative" width={{ base: "100%", md: "66%" }} mx="auto">
          <InputGroup size="lg">
            <Input
              ref={inputRef}
              placeholder="Nhập từ vựng tiếng Trung hoặc tiếng Việt..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleKeyDown}
              bg={searchBgColor}
              borderRadius="md"
              size="lg"
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
          
          {/* Suggestions dropdown */}
          {renderSuggestions()}
        </Box>
      </Flex>
      
      {/* Hiển thị spinner nếu đang loading */}
      {(isLoading || isLoadingHantu) ? (
        <Flex justify="center" py={8}>
          <Spinner size="xl" color="blue.500" thickness="4px" />
        </Flex>
      ) : searchResults ? (
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 3fr 1fr" }} 
          gap={4}
        >
          {/* Phần 1: Lịch sử tìm kiếm */}
          <GridItem>
            <Box 
              p={4} 
              borderWidth="1px" 
              borderRadius="md" 
              borderColor={borderColor}
              bg={bgColor}
              height="fit-content"
              position="sticky"
              top="4"
            >
              <Heading as="h3" size="md" mb={4}>Lịch sử tìm kiếm</Heading>
              {searchHistory.length > 0 ? (
                <Wrap spacing={2}>
                  {searchHistory.map((term, index) => (
                    <WrapItem key={index}>
                      <Badge 
                        colorScheme="blue" 
                        cursor="pointer" 
                        px={2}
                        py={1}
                        fontSize="xs"
                        borderRadius="md"
                        onClick={() => {
                          setSearchTerm(term);
                          handleSearch(term);
                        }}
                        _hover={{ bg: 'blue.100', color: 'blue.800' }}
                      >
                        {term}
                      </Badge>
                    </WrapItem>
                  ))}
                </Wrap>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  Chưa có lịch sử tìm kiếm
                </Text>
              )}
            </Box>
          </GridItem>

          {/* Phần 2, 3, 4: Dịch nghĩa (thay đổi từ 3 cột thành 1 cột) */}
          <GridItem colSpan={{ base: 1, md: 1 }}>
            {searchResults.found && searchResults.result.length > 0 ? (
              <VStack spacing={4} align="stretch">
                <Text fontSize="md" color="gray.500">
                  Tìm thấy {searchResults.total} kết quả cho "{searchResults.query}"
                </Text>
                
                {/* Thay đổi cấu trúc từ Grid thành VStack */}
                <VStack spacing={4} align="stretch">
                  {searchResults.result.slice(0, visibleResults).map((item, index) => (
                    <Card 
                      key={index}
                      borderWidth="1px"
                      borderRadius="md"
                      borderColor={borderColor}
                      bg={bgColor}
                      overflow="hidden"
                      width="100%"
                    >
                      <CardBody>
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
                                  {/* Luôn hiển thị ví dụ, không cần nút ẩn hiện */}
                                  {renderExamples(meaningItem.examples)}
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
                      </CardBody>
                    </Card>
                  ))}
                </VStack>
                
                {/* Nút xem thêm kết quả */}
                {searchResults.result.length > visibleResults && (
                  <Flex justify="center" mt={4}>
                    <Button 
                      onClick={handleLoadMore}
                      colorScheme="blue"
                      variant="outline"
                      leftIcon={<SearchIcon />}
                    >
                      Xem thêm ({Math.min(5, searchResults.result.length - visibleResults)} kết quả tiếp theo)
                    </Button>
                  </Flex>
                )}
              </VStack>
            ) : (
              <Box 
                p={8} 
                textAlign="center" 
                borderWidth="1px" 
                borderRadius="md"
                borderColor={borderColor}
              >
                <Text>Không tìm thấy kết quả nào cho "{searchResults.query}"</Text>
              </Box>
            )}
          </GridItem>

          {/* Phần 5: Hán tự */}
          <GridItem>
            {hantuResults && hantuResults.found && hantuResults.result.length > 0 ? (
              <VStack spacing={4} align="stretch">
                <Heading as="h3" size="md" textAlign="center">Hán tự</Heading>
                
                {hantuResults.result.map((item, index) => (
                  <Card
                    key={index}
                    borderWidth="1px"
                    borderRadius="md"
                    borderColor={borderColor}
                    bg={bgColor}
                    overflow="hidden"
                  >
                    <CardBody>
                      <Flex justify="space-between" align="flex-start">
                        <Box>
                          <Text fontSize="xl" fontWeight="bold">{item.word}</Text>
                          <Text fontSize="md" fontStyle="italic" color="gray.600">{item.pinyin}</Text>
                          <Text color="blue.600" fontWeight="semibold">{item.cn_vi}</Text>
                        </Box>
                        <Box>
                          {item.popular && (
                            <Badge colorScheme="green" variant="solid" borderRadius="full" px={2}>
                              {item.popular}
                            </Badge>
                          )}
                        </Box>
                      </Flex>
                      
                      {/* Stroke information */}
                      <Box mt={3}>
                        <Text fontSize="sm" fontWeight="medium">Số nét: {item.count}</Text>
                        <Text fontSize="sm">Bộ thủ: {item.sets}</Text>
                        <Text fontSize="sm">Lục thư: {item.lucthu}</Text>
                      </Box>

                      {/* Render SVG of strokes */}
                      {renderHantuStroke(item.strokes)}
                      
                      {/* Related word display (shortened for side column) */}
                      {item.content && item.content.length > 0 && (
                        <Box mt={4}>
                          <Text fontWeight="semibold" mb={2}>Nghĩa:</Text>
                          <Box pl={2} borderLeft="2px" borderColor="blue.500">
                            {item.content.map((contentItem, contentIndex) => (
                              <Box key={contentIndex} mb={3}>
                                <Text fontWeight="medium">{contentItem.key}</Text>
                                
                                {contentItem.means.tdpt && (
                                  <Text fontSize="sm">{contentItem.means.tdpt[0]}</Text>
                                )}
                                
                                {contentItem.means.tg && contentItem.means.tg.length > 0 && (
                                  <Flex wrap="wrap" gap={1} mt={1}>
                                    <Text fontSize="xs" fontWeight="medium">Từ ghép: </Text>
                                    {contentItem.means.tg.slice(0, 5).map((item, idx) => (
                                      <Badge key={idx} colorScheme="purple" fontSize="xs">
                                        {item}
                                      </Badge>
                                    ))}
                                    {contentItem.means.tg.length > 5 && (
                                      <Text fontSize="xs">...</Text>
                                    )}
                                  </Flex>
                                )}
                              </Box>
                            ))}
                          </Box>
                        </Box>
                      )}
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            ) : (
              <Box 
                p={8} 
                textAlign="center" 
                borderWidth="1px" 
                borderRadius="md"
                borderColor={borderColor}
              >
                <Text>Không tìm thấy thông tin hán tự</Text>
              </Box>
            )}
          </GridItem>
        </Grid>
      ) : (
        // Khi chưa có kết quả tìm kiếm, hiển thị lịch sử tìm kiếm
        <Grid 
          templateColumns={{ base: "1fr", md: "1fr 3fr 1fr" }} 
          gap={4}
        >
          <GridItem colSpan={{ base: 1, md: 3 }}>
            <Box p={8} textAlign="center">
              {renderSearchHistory()}
            </Box>
          </GridItem>
        </Grid>
      )}
    </Container>
  );
};

export default ChineseDict; 