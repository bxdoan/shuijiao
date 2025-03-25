// @ts-nocheck
import React from 'react';
import { useParams } from 'react-router-dom';
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
} from '@chakra-ui/react';

import { useVideoDetail, useRelatedVideos } from '../../hooks/useVideo';
import VideoCard from '../../components/Video/VideoCard';
import SEO from '../../components/Common/SEO';

const VideoDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data, isLoading, isError } = useVideoDetail(Number(id));

  const videoType = data?.Song?.video_type || 'Chinese';
  const { data: relatedData, isLoading: isLoadingRelated } = useRelatedVideos(
    videoType,
    Number(id),
    1,
    12
  );

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
                {relatedData.Song.map((relatedVideo) => (
                  <VideoCard key={relatedVideo.id} video={relatedVideo} />
                ))}
              </SimpleGrid>
            ) : (
              <Text color="gray.500">Không có video liên quan.</Text>
            )}
          </Box>
        </VStack>
      </Container>
    </>
  );
};

export default VideoDetailPage; 