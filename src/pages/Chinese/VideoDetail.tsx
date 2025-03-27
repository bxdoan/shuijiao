// @ts-nocheck
import React from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  HStack,
  Badge,
  Center,
  Spinner,
  AspectRatio,
  Divider,
  SimpleGrid,
  Button,
  IconButton,
} from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon, ArrowBackIcon } from '@chakra-ui/icons';
import { useState, useEffect } from 'react';

import { 
    useVideoDetail, 
    useRelatedVideos 
} from '../../hooks/useVideo';
import VideoCard from '../../components/Video/VideoCard';
import SEO from '../../components/Common/SEO';
// import { DonationVideoBox } from '../../components/Common/DonationBox';

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useVideoDetail(Number(id));
  const [backId, setBackId] = useState(null);

  const videoType = data?.Song?.video_type || 'Chinese';
  const { data: relatedData, isLoading: isLoadingRelated } = useRelatedVideos(
    videoType,
    Number(id),
    12
  );

  // Xác định video tiếp theo từ danh sách liên quan
  const currentVideoIndex = relatedData?.Song?.findIndex(video => video.id === Number(id)) || -1;
  const nextVideo = relatedData?.Song[currentVideoIndex + 1];

  useEffect(() => {
    const backId = searchParams.get('backId');
    setBackId(backId);
  }, [searchParams]);

  // Xác định loại video từ video_type
  const getVideoTypeParam = (type: string) => {
    const typeMap: { [key: string]: string } = {
      'Chinese Voice_Music': 'music',
      'Chinese Voice_News': 'news',
      'Chinese Voice_Culture': 'culture',
      'Chinese Voice_Learning': 'learning',
      'Chinese Voice_Entertainment': 'entertainment',
      'Chinese': 'all'
    };
    return typeMap[type] || 'all';
  };

  const handleBackToList = () => {
    const type = getVideoTypeParam(videoType);
    navigate(`/zh/video?type=${type}`);
  };

  const handleNextVideo = () => {
    if (nextVideo) {
      navigate(`/zh/video/${nextVideo.id}?backId=${id}`);
    }
  };

  const handleBackVideo = () => {
    if (backId) {
      navigate(`/zh/video/${backId}`);
    }
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  if (isError || !data?.Song) {
    return (
      <Center minH="60vh">
        <Text>Đã xảy ra lỗi khi tải video. Vui lòng thử lại sau.</Text>
      </Center>
    );
  }

  const video = data.Song;

  return (
    <>
      <SEO
        title={`${video.name} - Shuijiao`}
        description={`Xem video học tiếng Trung: ${video.name_en}`}
        keywords={`học tiếng Trung, video tiếng Trung, ${video.name}`}
        ogType="video"
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          {/* Navigation Buttons */}
          {!isLoading && data?.Song && (
            <HStack spacing={4} justify="space-between">
              <HStack>
                <IconButton
                  aria-label="Quay lại danh sách"
                  icon={<ArrowBackIcon />}
                  onClick={handleBackToList}
                  colorScheme="blue"
                  variant="ghost"
                  size="sm"
                />
                <Text 
                    fontSize="sm" 
                    color="gray.600" 
                    fontWeight="bold" 
                    cursor="pointer" 
                    onClick={handleBackToList}
                >
                  Quay lại danh sách {video.video_type.split('_')[1]}
                </Text>
              </HStack>
              <HStack spacing={2}>
                {backId && (
                  <Button
                    leftIcon={<ChevronLeftIcon />}
                    onClick={handleBackVideo}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                  >
                    <Text fontSize="sm" fontWeight="bold">Video trước</Text>
                  </Button>
                )}
                {nextVideo && (
                  <Button
                    rightIcon={<ChevronRightIcon />}
                    onClick={handleNextVideo}
                    colorScheme="blue"
                    variant="ghost"
                    size="sm"
                  >
                    <Text fontSize="sm" fontWeight="bold">Video tiếp</Text>
                  </Button>
                )}
              </HStack>
            </HStack>
          )}

          {isLoading ? (
            <Center minH="60vh">
              <Spinner size="xl" color="blue.500" thickness="4px" />
            </Center>
          ) : isError || !data?.Song ? (
            <Center minH="60vh">
              <Text>Đã xảy ra lỗi khi tải video. Vui lòng thử lại sau.</Text>
            </Center>
          ) : (
            <>
              <AspectRatio ratio={16 / 9}>
                <iframe
                  src={video.url.replace('watch?v=', 'embed/')}
                  allowFullScreen
                  style={{ borderRadius: '8px' }}
                  title={`Video: ${video.name}`}
                />
              </AspectRatio>

              <Box>
                <Heading as="h1" size="xl" mb={4}>
                  {video.name}
                </Heading>
                <Text fontSize="lg" color="gray.600" mb={4}>
                  {video.name_en}
                </Text>
                <HStack spacing={4} mb={4}>
                  <Badge colorScheme="blue" fontSize="md" px={3} py={1}>
                    {video.video_type.split('_')[1]}
                  </Badge>
                  <Text color="gray.500">
                    {video.video_length} • {video.view.toLocaleString()} lượt xem
                  </Text>
                </HStack>
                <Divider my={4} />
                <Text fontSize="md" color="gray.700">
                  {video.name_ro}
                </Text>
              </Box>

              {/* Video liên quan */}
              <Box>
                <Heading as="h2" size="lg" mb={4}>
                  Video liên quan
                </Heading>
                {isLoadingRelated ? (
                  <Center py={6}>
                    <Spinner size="md" color="blue.500" />
                  </Center>
                ) : relatedData?.Song && relatedData.Song.length > 0 ? (
                  <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
                    {relatedData.Song.map((relatedVideo, index) => (
                      <React.Fragment key={relatedVideo.id}>
                        <VideoCard video={relatedVideo} backId={id} />
                        {/* {index === 4 && (
                          <DonationVideoBox />
                        )} */}
                      </React.Fragment>
                    ))}
                  </SimpleGrid>
                ) : (
                  <Text color="gray.500">Không có video liên quan.</Text>
                )}
              </Box>
            </>
          )}
        </VStack>
      </Container>
    </>
  );
};

export default VideoDetailPage; 