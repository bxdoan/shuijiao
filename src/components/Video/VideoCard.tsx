// @ts-nocheck
import React from 'react';
import { 
    Box, 
    Image, 
    Text, 
    VStack,
    HStack, 
    Badge 
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';

interface VideoCardProps {
  video: {
    id: number;
    name: string;
    thumbnail: string;
    video_length: string;
    video_type: string;
    view: number;
    name_en: string;
  };
}

const VideoCard: React.FC<VideoCardProps> = ({ video }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/zh/video/${video.id}`);
  };

  return (
    <Box
      cursor="pointer"
      onClick={handleClick}
      transition="transform 0.2s"
      _hover={{ transform: 'scale(1.02)' }}
      borderRadius="lg"
      overflow="hidden"
      boxShadow="md"
    >
      <Box position="relative">
        <Image
          src={video.thumbnail}
          alt={video.name}
          width="100%"
          height="200px"
          objectFit="cover"
        />
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="red"
          borderRadius="md"
        >
          {video.video_length}
        </Badge>
      </Box>
      
      <VStack p={4} align="start" spacing={2}>
        <Text fontWeight="bold" noOfLines={2}>
          {video.name}
        </Text>
        <Text fontSize="sm" color="gray.600" noOfLines={1}>
          {video.name_en}
        </Text>
        <HStack spacing={2}>
          <Badge colorScheme="blue">
            {video.video_type.split('_')[1]}
          </Badge>
          <Text fontSize="sm" color="gray.500">
            {video.view.toLocaleString()} views
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default VideoCard; 