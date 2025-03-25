// @ts-nocheck
import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Center,
  Spinner,
  Button,
  HStack,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import { useVideo } from '../../hooks/useVideo';
import VideoCard from '../../components/Video/VideoCard';
import SEO from '../../components/Common/SEO';
import { DonationVideoBox } from '../../components/Common/DonationBox';

const VideoPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 11;

  const videoTypes = useMemo(() => [
    { name: 'Tất cả', type: 'Chinese', param: 'all' },
    { name: 'Âm nhạc', type: 'Chinese Voice_Music', param: 'music' },
    { name: 'Tin tức', type: 'Chinese Voice_News', param: 'news' },
    { name: 'Văn hóa', type: 'Chinese Voice_Culture', param: 'culture' },
    { name: 'Học tập', type: 'Chinese Voice_Learning', param: 'learning' },
    { name: 'Giải trí', type: 'Chinese Voice_Entertainment', param: 'entertainment' },
  ], []);

  useEffect(() => {
    const typeParam = searchParams.get('type') || 'all';
    const tabIndex = videoTypes.findIndex(type => type.param === typeParam);
    if (tabIndex !== -1) {
      setActiveTab(tabIndex);
    }
  }, [searchParams, videoTypes]);

  const { data, isLoading, isError } = useVideo(
    videoTypes[activeTab].type,
    currentPage,
    ITEMS_PER_PAGE
  );

  const handleTabChange = (index: number) => {
    setActiveTab(index);
    setCurrentPage(1);
    setSearchParams({ type: videoTypes[index].param });
    navigate(`?type=${videoTypes[index].param}`, { replace: true });
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPagination = () => {
    if (!data?.Song || data.Song.length < ITEMS_PER_PAGE) return null;

    return (
      <Center py={6}>
        <HStack spacing={2}>
          <Button
            leftIcon={<ChevronLeftIcon />}
            onClick={() => handlePageChange(currentPage - 1)}
            isDisabled={currentPage === 1}
          >
            Trang trước
          </Button>
          <Text fontWeight="bold">Trang {currentPage}</Text>
          <Button
            rightIcon={<ChevronRightIcon />}
            onClick={() => handlePageChange(currentPage + 1)}
            isDisabled={!data.Song || data.Song.length < ITEMS_PER_PAGE}
          >
            Trang sau
          </Button>
        </HStack>
      </Center>
    );
  };

  const renderVideosWithDonation = (videos: any[]) => {
    const result = [];
    for (let i = 0; i < videos.length; i++) {
      result.push(<VideoCard key={videos[i].id} video={videos[i]} />);
      if (i === 4) {
        result.push(<DonationVideoBox key={`donation-${i}`} />);
      }
    }
    return result;
  };

  return (
    <>
      <SEO
        title="Shuijiao - Học tiếng Trung qua video"
        description="Nền tảng học tiếng Trung hiệu quả thông qua video. Cập nhật liên tục với nhiều chủ đề và mức độ khó khác nhau."
        keywords="học tiếng Trung, video tiếng Trung, tiếng Trung thực tế, xem video tiếng Trung, luyện nghe tiếng Trung"
        ogType="website"
      />
      <Container maxW="container.xl" py={8}>
        <Box textAlign="center" mb={8}>
          <Heading as="h1" size="2xl" mb={2}>
            Học tiếng Trung qua video
          </Heading>
        </Box>

        <Tabs onChange={handleTabChange} colorScheme="blue" variant="enclosed" index={activeTab}>
          <TabList mb={6} display="flex" justifyContent="center">
            {videoTypes.map((type, index) => (
              <Tab key={index} flex="1" maxW="200px">
                <Text fontSize="md" fontWeight="bold">{type.name}</Text>
              </Tab>
            ))}
          </TabList>

          <TabPanels>
            {videoTypes.map((type, index) => (
              <TabPanel key={index}>
                {isLoading ? (
                  <Center py={10}>
                    <Spinner size="xl" color="blue.500" thickness="4px" />
                  </Center>
                ) : isError ? (
                  <Center py={10}>
                    <Text>Đã xảy ra lỗi khi tải video. Vui lòng thử lại sau.</Text>
                  </Center>
                ) : data?.Song && data.Song.length > 0 ? (
                  <>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                      {renderVideosWithDonation(data.Song)}
                    </SimpleGrid>
                    {renderPagination()}
                  </>
                ) : (
                  <Center py={10}>
                    <Text>Không tìm thấy video nào.</Text>
                  </Center>
                )}
              </TabPanel>
            ))}
          </TabPanels>
        </Tabs>
      </Container>
    </>
  );
};

export default VideoPage; 