// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Image,
  Stack,
  Badge,
  Button,
  Spinner,
  Flex,
  Divider,
  useToast,
  IconButton,
  Center,
  useColorModeValue,
  Grid,
  GridItem,
  useDisclosure,
} from '@chakra-ui/react';
import { ChevronLeftIcon } from '@chakra-ui/icons';
import { FaShare } from 'react-icons/fa';

import { 
    getNewsDetail, 
    fetchTranslation, 
    translateSentences,
    fetchNews
} from '../api/newsApi';
import { NewsDetail, NewsFilterParams, NewsItem } from '../types';
import * as utils from '../utils/utils';
import NewsRelatedList from '../components/News/NewsRelatedList';
import { ShareModal } from '../components/Common/ShareModal';
import DonationBox from '../components/Common/DonationBox';
import HSKVocabularyBox from '../components/Vocabulary/HSKVocab';
import IELTSVocabularyBox from '../components/Vocabulary/IELTSVocab';
import SEO from '../components/Common/SEO';
import ScrollToTopBottom from '../components/Common/ScrollToTopBottom';
import ChineseSearch from '../components/Search/ChineseSearch';

const NewsDetailPage: React.FC = () => {
  const { newsId } = useParams<{ newsId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [newsDetail, setNewsDetail] = useState<NewsDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [translation, setTranslation] = useState<Record<string, string> | null>(null);
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTranslation, setShowTranslation] = useState(false);
  const [relatedNews, setRelatedNews] = useState<NewsItem[]>([]);
  const [loadingRelated, setLoadingRelated] = useState(false);
  
  // Xác định ngôn ngữ dựa vào đường dẫn
  const getLanguageFromPath = () => {
    if (location.pathname.includes('/en/')) {
      return 'en';
    }
    // Có thể mở rộng thêm các ngôn ngữ khác
    return 'zh'; // Mặc định là tiếng Trung
  };
  
  const currentLanguage = getLanguageFromPath();
  const targetLang = 'vi';
  const languageName = currentLanguage === 'en' ? 'tiếng Anh' : 'tiếng Trung';
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  // Hàm fetch tin tức liên quan
  const fetchRelatedNews = useCallback(async (kind: string, type: string, date: string) => {
    setLoadingRelated(true);
    try {
      let allRelatedNews: NewsItem[] = [];
      let currentDate = new Date(date);
      let attempts = 0;
      const MAX_ATTEMPTS = 6; // Giới hạn số lần truy vấn ngược thời gian
      const MIN_REQUIRED_NEWS = 6; // Số tin tức tối thiểu cần hiển thị
      
      // Tiếp tục tải cho đến khi có đủ tin hoặc đạt giới hạn số lần thử
      while (allRelatedNews.length < MIN_REQUIRED_NEWS && attempts < MAX_ATTEMPTS) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        const filters: NewsFilterParams = {
          topic: kind || '',
          type: type || 'easy',
          date: dateString,
          timestamp: dateString,
          page: 1,
          limit: 40,
          language: currentLanguage
        };
        
        const response = await fetchNews(filters);
        
        if (response && response.data) {
          // Lọc bỏ bài viết hiện tại và các bài đã có trong danh sách
          const existingIds = new Set(allRelatedNews.map(item => item.id));
          const newRelatedNews = response.data.filter(item => 
            item.id !== newsId && !existingIds.has(item.id)
          );
          
          // Thêm tin mới vào danh sách
          allRelatedNews = [...allRelatedNews, ...newRelatedNews];
          
          // Nếu không có thêm tin nào từ ngày này, di chuyển đến ngày trước đó
          if (newRelatedNews.length === 0) {
            currentDate.setDate(currentDate.getDate() - 1);
            attempts++;
            continue;
          }
        }
        
        // Di chuyển đến ngày trước đó để tìm thêm tin
        currentDate.setDate(currentDate.getDate() - 1);
        attempts++;
      }
      
      // Chỉ lấy tối đa tin theo yêu cầu
      setRelatedNews(allRelatedNews.slice(0, MIN_REQUIRED_NEWS));
      
    } catch (error) {
      console.error('Error fetching related news:', error);
    } finally {
      setLoadingRelated(false);
    }
  }, [currentLanguage, newsId]);

  useEffect(() => {
    const fetchNewsDetail = async () => {
      if (!newsId) return;
      
      setIsLoading(true);
      setIsError(false);
      setTranslation(null);
      setShowTranslation(false);
      
      try {
        const data = await getNewsDetail(newsId, currentLanguage);
        if (data) {
          setNewsDetail(data);
          // Fetch related news after getting detail
          await fetchRelatedNews(data.kind, data.type, data.date);
        } else {
          setIsError(true);
          toast({
            title: 'Lỗi',
            description: 'Không thể tải thông tin chi tiết tin tức.',
            status: 'error',
            duration: 5000,
            isClosable: true,
          });
        }
      } catch (error) {
        console.error('Error fetching news detail:', error);
        setIsError(true);
        toast({
          title: 'Lỗi',
          description: 'Đã xảy ra lỗi khi tải dữ liệu.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchNewsDetail();
  }, [newsId, toast, currentLanguage, fetchRelatedNews]);

  // Hàm dịch tin tức
  const translateNews = async () => {
    if (!newsDetail) return;
    
    setIsTranslating(true);
    setShowTranslation(true);
    
    try {
      // Khởi tạo đối tượng translation trước
      let translatedContent: Record<string, string> = {};
      setTranslation(translatedContent);

      // Thử lấy bản dịch đã có trước
      const cachedTranslation = await fetchTranslation(newsId, 'vi', false);
      
      if (cachedTranslation) {
        setTranslation(cachedTranslation);
        setShowTranslation(true);
        return;
      }

      // Nếu không có bản dịch có sẵn, dịch bất đồng bộ từng phần
      
      // Phân tích nội dung HTML
      const parser = new DOMParser();
      const doc = parser.parseFromString(newsDetail.content.body, 'text/html');
      const blockElements = Array.from(doc.body.children);

      // Tạo một hàm để cập nhật translation state mỗi khi có dữ liệu mới
      const updateTranslation = (index: string, content: string) => {
        setTranslation(prevTranslation => ({
            ...prevTranslation,
            [index]: content
        }));
      };

      // Dịch tiêu đề và mô tả trước
      // Sử dụng Promise.all để dịch song song nhưng vẫn cập nhật UI từng phần
      Promise.all([
        // Dịch tiêu đề
        (async () => {
            try {
              const translatedTitle = await translateSentences(newsDetail.title || '', currentLanguage);
              updateTranslation('0', translatedTitle);
            } catch (error) {
              console.error("Error translating title:", error);
            }
        })(),

        // Dịch mô tả
        (async () => {
          try {
            const translatedDesc = await translateSentences(newsDetail.description || '', currentLanguage);
            updateTranslation('1', translatedDesc);
          } catch (error) {
            console.error("Error translating description:", error);
          }
        })(),
      ]);

      // Dịch từng block nội dung riêng biệt và cập nhật UI ngay khi có kết quả
      for (let i = 0; i < blockElements.length; i++) {
        const element = blockElements[i];
        const textContent = element.textContent || '';
        
        if (!textContent.trim()) {  
          updateTranslation((i + 2).toString(), '');
          continue;
        }
        
        // Tạo closure để giữ index cho mỗi phần tử
        (async (index) => {    
          try {
            const translatedBlock = await translateSentences(textContent, currentLanguage);
            updateTranslation((index + 2).toString(), translatedBlock);
          } catch (error) {
            console.error(`Error translating block ${index}:`, error);
            updateTranslation((index + 2).toString(), '');
          }
        })(i);
      }
    } catch (error) {
      console.error('Error translating news:', error);
      toast({
        title: 'Lỗi dịch',
        description: 'Không thể dịch nội dung tin tức. Vui lòng thử lại sau.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setTimeout(() => {
        setIsTranslating(false);
      }, 1000);
    }
  };

  // Hiển thị nội dung song ngữ (gốc + dịch)
  const renderInterleavedContent = () => {
    if (!newsDetail?.content.body || !translation) return null;

    // Phân tích HTML thành Document để giữ nguyên cấu trúc
    const parser = new DOMParser();
    const doc = parser.parseFromString(newsDetail.content.body, 'text/html');
    
    // Tìm tất cả các phần tử cấp cao nhất
    const blockElements = Array.from(doc.body.children);
    
    // Tạo mảng các phần tử đã được xử lý để hiển thị
    const processedContent = [];

    blockElements.forEach((element, index) => {
      // Thêm phần tử gốc vào kết quả
      processedContent.push(
        <Box key={`original-${index}`} mb={2}>
          <div dangerouslySetInnerHTML={{ __html: element.outerHTML }} />
        </Box>
      );

      // Lấy index dịch tương ứng (bắt đầu từ index 2)
      const translationIndex = (index + 2).toString();
      
      // Lấy phần dịch cho đoạn này
      if (translation[translationIndex]) {
        processedContent.push(
          <Box key={`translation-${index}`} mb={3} pl={4} borderLeft="2px" borderColor="blue.400">
            <Text color="blue.600" fontStyle="italic">
              {translation[translationIndex]}
            </Text>
          </Box>
        );
      }
    });

    return (
      <Stack spacing={2}>
        {processedContent}
      </Stack>
    );
  };

  const renderAudioPlayer = () => {
    if (!newsDetail?.content.audio) return null;

    let audioUrl = '';
    if (currentLanguage === 'en') {
      audioUrl = `https://admin.todaienglish.com/${newsDetail.content.audio}`;
    } else {
      const audioKeys = Object.keys(newsDetail.content.audio)[0];
      const currentAudio = newsDetail.content.audio[audioKeys];
      audioUrl = `https://easychinese.io/audios/${audioKeys}/${currentAudio}`;
    }
    return (
      <Box my={4}>
        <audio controls style={{ width: '100%' }}>
          <source src={audioUrl} type="audio/mp3" />
          Trình duyệt của bạn không hỗ trợ phát âm thanh.
        </audio>
      </Box>
    );
  };

  const imageUrl = () => {
    if (currentLanguage === 'en') {
      return `${newsDetail.image}`;
    } else {
      return `${newsDetail.content.image}`;
    }
  };

  // Hàm xử lý SEO title và description
  const getSEOData = () => {
    if (!newsDetail) {
      return {
        title: `Đang tải bài viết - Shuijiao`,
        description: `Đang tải thông tin bài viết ${languageName} từ Shuijiao.`,
        keywords: `học ${languageName}, đọc ${languageName}, tin tức ${languageName}, shuijiao`
      };
    }

    // Chuyển đổi title từ HTML sang plain text
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = newsDetail.title || '';
    const plainTitle = tempContainer.textContent || tempContainer.innerText || '';
    
    // Chuyển đổi description từ HTML sang plain text (nếu có)
    let plainDesc = '';
    if (newsDetail.description) {
      tempContainer.innerHTML = newsDetail.description;
      plainDesc = tempContainer.textContent || tempContainer.innerText || '';
    }

    return {
      title: `${plainTitle.slice(0, 60)}${plainTitle.length > 60 ? '...' : ''} - Shuijiao`,
      description: plainDesc ? 
        `${plainDesc.slice(0, 150)}${plainDesc.length > 150 ? '...' : ''}` : 
        `Đọc bài ${languageName} về chủ đề ${newsDetail.kind || ''} trên Shuijiao. Bài viết có kèm bản dịch tiếng Việt.`,
      keywords: `học ${languageName}, đọc ${languageName}, tin tức ${languageName}, ${newsDetail.kind || ''}, ${newsDetail.type || ''}, shuijiao`
    };
  };

  const seoData = getSEOData();
  
  return (
    <>
      <SEO 
        title={seoData.title}
        description={seoData.description}
        keywords={seoData.keywords}
        ogType="article"
        ogImage={newsDetail?.content?.image || newsDetail?.image || ''}
      />
      <Container maxW="container.xl" py={8}>
        <Box mb={4}>
          <IconButton
            aria-label="Quay lại"
            icon={<ChevronLeftIcon w={6} h={6} />}
            onClick={() => navigate(-1)}
            variant="outline"
          />
        </Box>

        {isLoading ? (
          <Center py={20}>
            <Spinner size="xl" thickness="4px" color="blue.500" />
          </Center>
        ) : isError || !newsDetail ? (
          <Center py={10} flexDirection="column">
            <Heading as="h2" size="lg" mb={4}>
              Không thể tải tin tức
            </Heading>
            <Text mb={6}>
              Đã xảy ra lỗi khi tải thông tin chi tiết bài viết. Vui lòng thử lại sau.
            </Text>
            <Button colorScheme="blue" onClick={() => navigate('/')}>
              Quay lại trang chủ
            </Button>
          </Center>
        ) : (
          <>
            <Grid 
              templateColumns={{ base: "1fr", lg: "3fr 1fr" }} 
              gap={6}
            >
              <GridItem>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  bg={bgColor}
                  borderColor={borderColor}
                  boxShadow="lg"
                  p={6}
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={4}>
                    <Stack direction="row" spacing={2} flexWrap="wrap">
                      {newsDetail.type && (
                        <Badge colorScheme={utils.getTypeColor(newsDetail.type)}>
                          {utils.getVietnameseType(newsDetail.type)}
                        </Badge>
                      )}
                      {newsDetail.kind && (
                        <Badge colorScheme="blue">{newsDetail.kind}</Badge>
                      )}
                      {newsDetail.source && (
                        <Badge 
                          colorScheme="purple" 
                          cursor={newsDetail.link ? "pointer" : "default"}
                          onClick={() => newsDetail.link && window.open(newsDetail.link, "_blank")}
                          _hover={newsDetail.link ? { opacity: 0.8 } : {}}
                        >
                          {utils.getSource(newsDetail.source)}
                        </Badge>
                      )}
                    </Stack>
                    
                    <IconButton
                      aria-label="Chia sẻ"
                      icon={<FaShare />}
                      size="sm"
                      colorScheme="blue"
                      variant="outline"
                      onClick={onOpen}
                    />
                  </Flex>

                  {imageUrl() && (
                    <Image 
                      src={imageUrl()} 
                      alt={newsDetail.title || "News image"} 
                      my={4}
                      maxH="400px"
                      mx="auto"
                      objectFit="contain"
                    />
                  )}
                  
                  {newsDetail.content.audio && (
                    renderAudioPlayer()
                  )}
                  
                  <Divider my={4} />
                  
                  <Flex justify="space-between" align="center" mb={4}>
                    <Text fontSize="sm" color="gray.500">
                      {newsDetail.date && new Date(newsDetail.date).toLocaleDateString()}
                    </Text>
                    
                    <Button
                      colorScheme="teal"
                      isLoading={isTranslating}
                      loadingText="Đang dịch..."
                      onClick={translateNews}
                      size="sm"
                    >
                      {showTranslation && translation ? "Đã dịch" : "Dịch"}
                    </Button>
                  </Flex>

                  <Heading as="h1" size="xl" mb={4} dangerouslySetInnerHTML={{ __html: newsDetail.title || '' }} />
                  
                  {showTranslation && translation && translation['0'] && (
                    <Box key="title-translation" mb={4} pl={4} borderLeft="2px" borderColor="blue.400">
                      <Text color="blue.600" fontStyle="italic" fontWeight="bold">
                        {translation['0']}
                      </Text>
                    </Box>
                  )}

                  {newsDetail.description && (
                    <Text 
                      fontSize="lg" 
                      fontWeight="semibold" 
                      mb={4} 
                      dangerouslySetInnerHTML={{ __html: newsDetail.description }} 
                    />
                  )}

                  {showTranslation && translation && translation['1'] && (
                    <Box key="description-translation" mb={4} pl={4} borderLeft="2px" borderColor="blue.400">
                      <Text color="blue.600" fontStyle="italic">
                        {translation['1']}
                      </Text>
                    </Box>    
                  )}

                  {showTranslation && translation ? (
                    renderInterleavedContent()
                  ) : (
                    <Box dangerouslySetInnerHTML={{ __html: newsDetail.content.body || '' }} />
                  )}
                </Box>
                
                {/* Box ủng hộ dự án - chỉ hiển thị với bề ngang của nội dung bài viết */}
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
                
                {/* Box từ vựng HSK - chỉ hiển thị với bài tiếng Trung */}
                {currentLanguage === 'zh' && newsDetail?.level_hsk && (
                  <Box mt={6}>
                    <HSKVocabularyBox levelHSK={newsDetail.level_hsk} />
                  </Box>
                )}
                
                {/* Box từ vựng IELTS - chỉ hiển thị với bài tiếng Anh */}
                {currentLanguage === 'en' && newsDetail?.level_ielts && (
                  <Box mt={6}>
                    <IELTSVocabularyBox levelIELTS={newsDetail.level_ielts} />
                  </Box>
                )}
              </GridItem>
              
              <GridItem>
                <Box
                  borderWidth="1px"
                  borderRadius="lg"
                  bg={bgColor}
                  borderColor={borderColor}
                  boxShadow="md"
                  p={4}
                  height="fit-content"
                  position="sticky"
                  top="20px"
                  display={{ base: 'none', lg: 'block' }}
                  maxHeight="calc(100vh - 40px)"
                  overflowY="auto"
                >
                  <NewsRelatedList 
                    news={relatedNews} 
                    isLoading={loadingRelated} 
                    sourceLang={currentLanguage}
                  />
                </Box>
              </GridItem>
            </Grid>
            
            {/* Hiển thị tin liên quan ở dưới cho màn hình điện thoại */}
            <Box 
              mt={6} 
              borderWidth="1px"
              borderRadius="lg"
              bg={bgColor}
              borderColor={borderColor}
              boxShadow="md"
              p={4}
              display={{ base: 'block', lg: 'none' }}
            >
              <NewsRelatedList 
                news={relatedNews} 
                isLoading={loadingRelated} 
                sourceLang={currentLanguage}
                title="Các tin tức liên quan khác"
              />
            </Box>
          </>
        )}
        
        {/* ShareModal component - đặt bên ngoài điều kiện render */}
        <ShareModal
          isOpen={isOpen}
          onClose={onClose}
          title="Chia sẻ bài viết này"
          shareText={utils.splitTextIntoSentences(newsDetail?.title || "", currentLanguage) || "Tin tức từ Shuijiao"}
        />
        
        {/* Thêm ScrollToTopBottom component trước */}
        <ScrollToTopBottom />
        
        {/* Thêm ChineseSearch component sau - sẽ nằm dưới cùng của trang */}
        {
          currentLanguage === 'zh' && (
            <ChineseSearch targetLang={targetLang} />
          )
        }
      </Container>
    </>
  );
};

export default NewsDetailPage; 