// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React, { useState, useEffect } from 'react';
import { 
    Box, 
    Container, 
    Heading, 
    Text, 
    CloseButton,
    Button,
    Center,
    Spinner,
    SimpleGrid
} from '@chakra-ui/react';
import { ChevronDownIcon } from '@chakra-ui/icons';

import NewsFilter from '../components/News/NewsFilter';
import NewsCard from '../components/News/NewsCard';
import ScrollToTopBottom from '../components/Common/ScrollToTopBottom';
import { DonationBoxCompact } from '../components/Common/DonationBox';
import { NewsFilterParams, NewsItem } from '../types';
import { useNews } from '../hooks/useNews';
import SEO from '../components/Common/SEO';

const HomePage: React.FC = () => {
  const [allNews, setAllNews] = useState<NewsItem[]>([]);
  const [loadedDates, setLoadedDates] = useState<string[]>([]);
  const [currentDate, setCurrentDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [filters, setFilters] = useState<NewsFilterParams>({
    topic: '',
    source: '',
    type: 'easy',
    page: 1,
    limit: 40, // Tăng limit để lấy tất cả tin tức trong ngày
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString().split('T')[0],
    language: 'zh' // Chỉ định rõ là tiếng Trung
  });
  
  const [showAlert, setShowAlert] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMoreDates, setHasMoreDates] = useState(true);

  const { data, isError, error, isLoading } = useNews(filters);

  // Tải tin tức ban đầu
  useEffect(() => {
    if (data && data.data && !isLoadingMore) {
      // Nếu đây là lần tải đầu tiên hoặc khi thay đổi bộ lọc
      if (loadedDates.length === 0 || !loadedDates.includes(filters.date || '')) {
        setAllNews(data.data);
        setLoadedDates([filters.date || '']);
        setCurrentDate(filters.date || new Date().toISOString().split('T')[0]);
      }
    }
  }, [data, filters.topic, filters.source, filters.type, filters.date, isLoadingMore, loadedDates]);

  // Xử lý khi tải thêm tin tức từ ngày trước đó
  useEffect(() => {
    if (isLoadingMore && data && data.data) {
      // Thêm tin tức mới vào danh sách hiện tại
      setAllNews(prevNews => [...prevNews, ...data.data]);
      
      // Cập nhật danh sách ngày đã tải
      if (!loadedDates.includes(filters.date || '')) {
        setLoadedDates(prev => [...prev, filters.date || '']);
      }
      
      setIsLoadingMore(false);
      
      // Kiểm tra xem có còn tin tức để tải không
      setHasMoreDates(data.data.length > 0);
    }
  }, [data, isLoadingMore, filters.date, loadedDates]);

  useEffect(() => {
    if (isError && error) {
      setShowAlert(true);
      setAlertMessage('Lỗi khi tải tin tức. Vui lòng thử lại sau.');
      console.error('HomePage error:', error);
      setIsLoadingMore(false);
    }
  }, [isError, error]);

  const handleFilterChange = (newFilters: NewsFilterParams) => {
    // Reset tất cả khi thay đổi bộ lọc
    setAllNews([]);
    setLoadedDates([]);
    setHasMoreDates(true);
    setIsLoadingMore(false);
    
    const newDate = newFilters.date || new Date().toISOString().split('T')[0];
    setCurrentDate(newDate);
    
    setFilters({ 
      ...filters, 
      ...newFilters, 
      page: 1,
      date: newDate,
      timestamp: newDate,
      language: 'zh' // Đảm bảo vẫn là tiếng Trung khi cập nhật filter
    });
  };

  // Hàm tải thêm tin tức từ ngày trước đó
  const handleLoadMore = () => {
    setIsLoadingMore(true);
    
    // Tính toán ngày trước đó
    const previousDay = new Date(currentDate);
    previousDay.setDate(previousDay.getDate() - 1);
    const previousDayStr = previousDay.toISOString().split('T')[0];
    
    // Cập nhật ngày hiện tại
    setCurrentDate(previousDayStr);
    
    // Tải tin tức từ ngày trước đó
    setFilters(prev => ({ 
      ...prev, 
      page: 1, 
      date: previousDayStr,
      timestamp: previousDayStr
    }));
  };

  const renderNewsContent = () => {
    if (allNews.length === 0) {
      if (isLoading) {
        return (
          <Center py={10}>
            <Spinner size="xl" color="blue.500" thickness="4px" />
          </Center>
        );
      }
      return (
        <Center py={10}>
          <Text>Không tìm thấy tin tức. Hãy thử thay đổi bộ lọc.</Text>
        </Center>
      );
    }

    // Chuẩn bị mảng render có cả tin tức và donation box
    const renderItems = [];
    
    allNews.forEach((item, index) => {
      // Thêm tin tức
      const newsKey = `news-${index}-${item.id || ''}`;
      renderItems.push(
        <NewsCard key={newsKey} news={item} sourceLang="zh" />
      );
      
      // Nếu đã hiển thị 5 tin và chưa phải tin cuối cùng, thêm donation box
      if ((index + 1) % 5 === 0 && index !== allNews.length - 1) {
        renderItems.push(
          <DonationBoxCompact 
            key={`donation-${index}`}
            title="Ủng hộ phát triển Shuijiao"
            description="Giúp chúng tôi duy trì và phát triển dịch vụ này miễn phí."
          />
        );
      }
    });

    return (
      <Box py={4}>
        <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
          {renderItems}
        </SimpleGrid>
      </Box>
    );
  };

  return (
    <>
      <SEO 
        title="Shuijiao - Học tiếng Trung qua tin tức thực tế hàng ngày"
        description="Nền tảng học tiếng Trung hiệu quả thông qua tin tức thực tế hàng ngày. Cập nhật liên tục với nhiều chủ đề và mức độ khó khác nhau."
        keywords="học tiếng Trung, tin tức tiếng Trung, tiếng Trung thực tế, đọc báo tiếng Trung, luyện đọc tiếng Trung"
        ogType="website"
      />
      <Container maxW="container.xl" py={8}>
        {showAlert && (
          <Box bg="red.500" color="white" p={4} mb={4} borderRadius="md" position="relative">
            <Heading as="h3" size="md">Lỗi!</Heading>
            <Text>{alertMessage}</Text>
            <CloseButton position="absolute" right="8px" top="8px" onClick={() => setShowAlert(false)} />
          </Box>
        )}

        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" mb={2}>
            Học tiếng Trung qua các bài báo thực tế
          </Heading>
        </Box>

        <NewsFilter filters={filters} onFilterChange={handleFilterChange} sourceLang="zh" />
        
        {renderNewsContent()}
        
        {hasMoreDates && (
          <Center py={6}>
            <Button 
              colorScheme="blue" 
              isLoading={isLoadingMore}
              loadingText="Đang tải..."
              onClick={handleLoadMore}
              size="lg"
              width={{ base: "full", md: "auto" }}
              leftIcon={<ChevronDownIcon />}
            >
              Xem Thêm
            </Button>
          </Center>
        )}
        
        <ScrollToTopBottom />
      </Container>
    </>
  );
};

export default HomePage; 