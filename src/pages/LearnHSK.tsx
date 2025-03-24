// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  Button,
  VStack,
  Flex,
  Badge,
  Image,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  LinkBox,
  LinkOverlay,
  AspectRatio,
  useColorModeValue,
  Skeleton,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { FaYoutube, FaBookOpen } from 'react-icons/fa';
import SEO from '../components/Common/SEO';

// Import hsk1.json
import hsk1Data from '../data_example/hsk1.json';

const LearnHSK = () => {
  const { level } = useParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    // Tạo hàm để load dữ liệu HSK
    const loadHSKData = async () => {
      try {
        setIsLoading(true);
        
        // Dựa vào level để lấy dữ liệu từ file tương ứng
        // Hiện tại chỉ có HSK 1
        let data = [];
        
        if (level === '1') {
          data = hsk1Data;
        } else {
          // Trong tương lai có thể thêm các cấp độ khác
          data = [];
        }
        
        setLessons(data);
      } catch (error) {
        console.error('Error loading HSK data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadHSKData();
  }, [level]);

  // Hàm trích xuất ID từ URL YouTube
  const getYoutubeId = (url) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  return (
    <Box py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <SEO 
        title={`Học HSK ${level || ''} - Shuijiao Chinese Learning`}
        description={`Học tiếng Trung với bài giảng HSK ${level || ''} trên Shuijiao. Bài giảng, từ vựng và ngữ pháp.`}
        keywords="HSK, học tiếng Trung, tiếng Hán, Shuijiao, từ vựng HSK"
      />
      
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={6}>
            <Badge 
              colorScheme="red" 
              fontSize="md" 
              py={1} 
              px={3} 
              borderRadius="full" 
              mb={3}
            >
              Khóa học tiếng Trung
            </Badge>
            <Heading 
              as="h1" 
              size="2xl" 
              mb={6} 
              bgGradient="linear(to-r, red.500, yellow.500)" 
              bgClip="text"
            >
              HSK {level || ''}
            </Heading>
            <Text 
              fontSize="xl" 
              maxW="container.md" 
              mx="auto" 
              opacity={0.8}
            >
              Học tiếng Trung hiệu quả với các bài giảng video, từ vựng và cách đọc chuẩn HSK {level || ''}
            </Text>
          </Box>

          {/* Lessons Grid */}
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {[...Array(6)].map((_, i) => (
                <Box key={i}>
                  <Skeleton height="200px" mb={4} />
                  <Skeleton height="30px" mb={2} />
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="40px" width="120px" />
                </Box>
              ))}
            </SimpleGrid>
          ) : lessons.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {lessons.map((lesson) => (
                <LinkBox as={Card} key={lesson.id} overflow="hidden" variant="outline" bg={cardBgColor} _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }} transition="all 0.3s">
                  <CardBody p={0}>
                    <AspectRatio ratio={16 / 9}>
                      <Image
                        src={`https://img.youtube.com/vi/${getYoutubeId(lesson.youtube_url)}/maxresdefault.jpg`}
                        alt={lesson.title}
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/640x360?text=Shuijiao+HSK"
                      />
                    </AspectRatio>
                    <Box p={5}>
                      <Stack spacing={2}>
                        <Badge colorScheme="red" alignSelf="start">{lesson.episode}</Badge>
                        <Heading size="md" my={2}>
                          <LinkOverlay as={RouterLink} to={`/zh/vi/hsk/${level}/${lesson.id}`}>
                            {lesson.title}
                          </LinkOverlay>
                        </Heading>
                        <Text fontSize="sm" noOfLines={2}>{lesson.description}</Text>
                        <Flex justify="space-between" mt={3}>
                          <Button 
                            leftIcon={<FaYoutube />}
                            colorScheme="red"
                            variant="outline"
                            as="a"
                            href={lesson.youtube_url}
                            target="_blank"
                            size="sm"
                          >
                            YouTube
                          </Button>
                          <Button 
                            rightIcon={<FaBookOpen />}
                            colorScheme="yellow"
                            as={RouterLink}
                            to={`/zh/vi/hsk/${level}/${lesson.id}`}
                            size="sm"
                          >
                            Xem thêm
                          </Button>
                        </Flex>
                      </Stack>
                    </Box>
                  </CardBody>
                </LinkBox>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Heading size="md" mb={4} color="gray.500">Không tìm thấy bài học nào cho HSK {level || ''}</Heading>
              <Button as={RouterLink} to="/zh" colorScheme="blue">Quay lại trang chủ</Button>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default LearnHSK; 