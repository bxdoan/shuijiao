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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  // @ts-ignore
} from '@chakra-ui/react';
import {
  SearchIcon,
  CloseIcon,
} from '@chakra-ui/icons';
import HantuStrokeRenderer from '../Dictionary/HantuStrokeRenderer';

// Import API functions
import { 
  SearchResponse, 
  KanjiResponse,
} from '../../api/newsApi';
import {
  fetchDictionary,
} from '../../api/vocabApi';

interface ChineseSearchProps {
  targetLang?: string;
}

const ChineseSearch: React.FC<ChineseSearchProps> = ({
    targetLang = 'vi'
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResponse | null>(null);
  const [hantuResults, setHantuResults] = useState<KanjiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingHantu, setIsLoadingHantu] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [tabIndex, setTabIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const skipEffectRef = useRef(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const searchBgColor = useColorModeValue('blue.50', 'gray.700');
  
  // Responsive settings
  const drawerSize = useBreakpointValue({ base: 'full', md: 'md' }) as string;
  
  // Handle search
  const handleSearch = async (term = searchTerm) => {
    if (!term.trim()) return;
    
    setIsLoading(true);
    
    try {
      // Call the search API using the function from newsApi.ts
      const data = await fetchDictionary(term, targetLang, 'word') as SearchResponse;
      
      setSearchResults(data);

      // Open drawer when search results are found
      if (data && data.found && data.result.length > 0) {
        onOpen();
        
        // Add to search history if not already present and found results
        if (data.found) {
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
  
  // Handle text selection
  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (!selection || selection.isCollapsed) return; // No selection or empty selection
      
      const selectedText = selection.toString().trim();

      // Only process when selection is less than 20 characters (avoid selecting entire sentences)
      if (selectedText && selectedText.length < 20) {
        // Mark to skip the useEffect for searchTerm
        skipEffectRef.current = true;
        
        // Update searchTerm and call search
        setSearchTerm(selectedText);
        handleSearch(selectedText);
      }
    };
    
    // Add mouseup event to capture when user releases mouse after selecting text
    document.addEventListener('mouseup', handleSelectionChange);
    
    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [targetLang]);
  
  // Handle debounce for searchTerm
  useEffect(() => {
    // If API was called from text selection, skip this time
    if (skipEffectRef.current) {
      skipEffectRef.current = false;
      return;
    }
    
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

  // Function to render SVG of kanji
  const renderHantuStroke = (strokesData: string) => {
    if (!strokesData) return null;
    
    // Use new component
    return (
      <Box width="100%" display="flex" flexDirection="column" alignItems="center" my={4}>
        <HantuStrokeRenderer strokesData={strokesData}/>
      </Box>
    );
  };
  
  // Handle clear search
  const handleClearSearch = () => {
    setSearchTerm('');
    setSearchResults(null);
    setHantuResults(null);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const handleCloseDrawer = () => {
    setSearchTerm('');
    setSearchResults(null);
    setHantuResults(null);
    onClose();
  }

  // Handle tab change
  const handleTabChange = (index) => {
    setTabIndex(index);
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
              
              {(isLoading && tabIndex === 0) || (isLoadingHantu && tabIndex === 1) ? (
                <Flex justify="center" py={8}>
                  <Spinner size="xl" color="blue.500" thickness="4px" />
                </Flex>
              ) : searchResults ? (
                <Tabs isFitted variant="enclosed" size="sm" index={tabIndex} onChange={handleTabChange} colorScheme="blue">
                  <TabList mb="1em">
                    <Tab>Dịch</Tab>
                    <Tab>Hán tự</Tab>
                  </TabList>
                  <TabPanels>
                    {/* Translation Tab */}
                    <TabPanel p={0}>
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
                    </TabPanel>
                    
                    {/* Kanji Tab */}
                    <TabPanel p={0}>
                      <VStack spacing={4} align="stretch" mt={2} overflow="auto">
                        {hantuResults && hantuResults.found && hantuResults.result.length > 0 ? (
                          <>
                            <Text fontSize="sm" color="gray.500">
                              Tìm thấy {hantuResults.total} hán tự cho "{hantuResults.query}"
                            </Text>
                            
                            {hantuResults.result.map((item, index) => (
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
                                
                                {/* Related word display */}
                                {item.content && item.content.length > 0 && (
                                  <Box mt={4}>
                                    <Text fontWeight="semibold" mb={2}>Nghĩa của chữ {item.word}:</Text>
                                    <Box pl={2} borderLeft="2px" borderColor="blue.500">
                                      {item.content.map((contentItem, contentIndex) => (
                                        <Box key={contentIndex} mb={3}>
                                          <Text fontWeight="medium">{contentItem.key}</Text>
                                          
                                          {contentItem.means.tdtc && (
                                            <Box mt={1}>
                                              <Text fontSize="sm" fontWeight="medium">Từ điển từ chuyên:</Text>
                                              <Box pl={2}>
                                                {contentItem.means.tdtc.map((item, idx) => (
                                                  <Text key={idx} fontSize="sm">{item}</Text>
                                                ))}
                                              </Box>
                                            </Box>
                                          )}
                                          
                                          {contentItem.means.tdpt && (
                                            <Box mt={1}>
                                              <Text fontSize="sm" fontWeight="medium">Từ điển phổ thông:</Text>
                                              <Box pl={2}>
                                                {contentItem.means.tdpt.map((item, idx) => (
                                                  <Text key={idx} fontSize="sm">{item}</Text>
                                                ))}
                                              </Box>
                                            </Box>
                                          )}
                                          
                                          {contentItem.means.tdtd && (
                                            <Box mt={1}>
                                              <Text fontSize="sm" fontWeight="medium">Từ điển từ điển:</Text>
                                              <Box pl={2}>
                                                {contentItem.means.tdtd.map((item, idx) => (
                                                  <Text key={idx} fontSize="sm">{item}</Text>
                                                ))}
                                              </Box>
                                            </Box>
                                          )}
                                          
                                          {contentItem.means.tg && contentItem.means.tg.length > 0 && (
                                            <Box mt={1}>
                                              <Text fontSize="sm" fontWeight="medium">Từ ghép:</Text>
                                              <Flex wrap="wrap" gap={1}>
                                                {contentItem.means.tg.map((item, idx) => (
                                                  <Badge key={idx} colorScheme="purple" fontSize="xs">
                                                    {item}
                                                  </Badge>
                                                ))}
                                              </Flex>
                                            </Box>
                                          )}
                                        </Box>
                                      ))}
                                    </Box>
                                  </Box>
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
                            <Text>Không tìm thấy thông tin hán tự nào cho "{searchResults?.query || searchTerm}"</Text>
                          </Box>
                        )}
                      </VStack>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              ) : null}
            </VStack>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default ChineseSearch; 