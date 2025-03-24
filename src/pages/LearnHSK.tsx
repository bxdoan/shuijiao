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
  Alert,
  AlertIcon,
} from '@chakra-ui/react';
import { useParams, Link as RouterLink } from 'react-router-dom';
import { FaBookOpen } from 'react-icons/fa';
import SEO from '../components/Common/SEO';
import { HSK_LEVEL_COLORS } from '../constant/hsk';

const LearnHSK = () => {
  const { level } = useParams();
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');
  
  // Lấy màu tương ứng với cấp độ HSK hiện tại
  const levelColor = HSK_LEVEL_COLORS[level] || 'red';

  useEffect(() => {
    // Tạo hàm để load dữ liệu HSK
    const loadHSKData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Động lấy file HSK theo cấp độ
        try {
          // Sử dụng import động để tải file JSON theo cấp độ HSK
          const hskModule = await import(`../data_example/hsk${level}.json`);
          setLessons(hskModule.default || []);
        } catch (importError) {
          console.error(`Không thể tải file hsk${level}.json:`, importError);
          setError(`Dữ liệu HSK ${level} chưa có sẵn. Vui lòng thử cấp độ khác.`);
          setLessons([]);
        }
      } catch (error) {
        console.error('Error loading HSK data:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
        setLessons([]);
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
        keywords={`HSK ${level}, học tiếng Trung, tiếng Hán, Shuijiao, từ vựng HSK, HSK${level}`}
      />
      
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={6}>
            <Badge 
              colorScheme={levelColor} 
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
              bgGradient={`linear(to-r, ${levelColor}.500, yellow.500)`} 
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

          {/* Error display */}
          {error && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

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
                        <Badge colorScheme={levelColor} alignSelf="start">{lesson.episode}</Badge>
                        <Heading size="md" my={2}>
                          <LinkOverlay as={RouterLink} to={`/zh/vi/hsk/${level}/${lesson.id}`}>
                            {lesson.title}
                          </LinkOverlay>
                        </Heading>
                        <Text fontSize="sm" noOfLines={2}>{lesson.description}</Text>
                        <Flex justify="space-between" mt={3}>
                          <Button 
                            rightIcon={<FaBookOpen />}
                            colorScheme={levelColor}
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