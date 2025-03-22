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
  IconButton,
  // @ts-ignore
} from '@chakra-ui/react';
import {
  SearchIcon,
  CloseIcon,
  RepeatIcon
} from '@chakra-ui/icons';

// Import API functions
import { 
  fetchDictionary,
  SearchResponse, 
  KanjiResponse,
} from '../../api/newsApi';


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
  const [strokesKey, setStrokesKey] = useState(0);
  const skipEffectRef = useRef(false);
  
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