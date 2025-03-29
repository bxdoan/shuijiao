// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  SimpleGrid,
  Card,
  CardBody,
  Image,
  Button,
  Badge,
  useColorModeValue,
  Skeleton,
  Alert,
  AlertIcon,
  AspectRatio,
} from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';
import { FaDownload } from 'react-icons/fa';

import SEO from '../../components/Common/SEO';

const Docs = () => {
  const [docs, setDocs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const cardBgColor = useColorModeValue('white', 'gray.800');

  useEffect(() => {
    const loadDocs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Import file docs.json
        const docsModule = await import('../../data_example/docs.json');
        setDocs(docsModule.default || []);
      } catch (error) {
        console.error('Error loading docs:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDocs();
  }, []);

  const handleDownload = (url) => {
    window.open(url, '_blank');
  };

  return (
    <Box py={8} bg={useColorModeValue('gray.50', 'gray.900')}>
      <SEO 
        title="Tài liệu học tiếng Trung - Shuijiao Chinese Learning"
        description="Tải miễn phí các tài liệu học tiếng Trung chất lượng cao"
        keywords="tài liệu học tiếng Trung, giáo trình Hán ngữ, HSK, Shuijiao"
      />
      
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Header */}
          <Box textAlign="center" py={6}>
            <Badge 
              colorScheme="blue" 
              fontSize="md" 
              py={1} 
              px={3} 
              borderRadius="full" 
              mb={3}
            >
              Tài liệu học tập
            </Badge>
            <Heading 
              as="h1" 
              size="2xl" 
              mb={6}
              bgGradient="linear(to-r, blue.500, purple.500)" 
              bgClip="text"
              lineHeight="1.4"
            >
              Tài liệu học tiếng Trung
            </Heading>
            <Text 
              fontSize="xl" 
              maxW="container.md" 
              mx="auto" 
              opacity={0.8}
              mt={1}
            >
              Tải miễn phí các tài liệu học tiếng Trung chất lượng cao, 
              bao gồm giáo trình Hán ngữ và tài liệu HSK
            </Text>
          </Box>

          {/* Error display */}
          {error && (
            <Alert status="warning" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {/* Docs Grid */}
          {isLoading ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {[...Array(6)].map((_, i) => (
                <Box key={i}>
                  <Skeleton height="400px" mb={4} />
                  <Skeleton height="30px" mb={2} />
                  <Skeleton height="20px" mb={2} />
                  <Skeleton height="40px" width="120px" />
                </Box>
              ))}
            </SimpleGrid>
          ) : docs.length > 0 ? (
            <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={8}>
              {docs.map((doc) => (
                <Card 
                  key={doc.id} 
                  overflow="hidden" 
                  variant="outline" 
                  bg={cardBgColor}
                  _hover={{ transform: 'translateY(-5px)', boxShadow: 'lg' }}
                  transition="all 0.3s"
                >
                  <CardBody p={0}>
                    <AspectRatio ratio={3/4} maxW="100%">
                      <Image
                        src={doc.thumbnail}
                        alt={doc.title}
                        objectFit="cover"
                        fallbackSrc="https://via.placeholder.com/300x400?text=Shuijiao+Docs"
                      />
                    </AspectRatio>
                    <Box p={5}>
                      <Heading size="md" mb={2}>
                        <RouterLink to={`/zh/docs/${doc.id}`}>
                          {doc.title}
                        </RouterLink>
                      </Heading>
                      <Text fontSize="sm" noOfLines={2} mb={4}>
                        {doc.description}
                      </Text>
                      <Button
                        leftIcon={<FaDownload />}
                        colorScheme="blue"
                        onClick={() => handleDownload(doc.url)}
                        width="full"
                      >
                        Tải xuống
                      </Button>
                    </Box>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          ) : (
            <Box textAlign="center" py={10} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Heading size="md" mb={4} color="gray.500">Không tìm thấy tài liệu nào</Heading>
            </Box>
          )}
        </VStack>
      </Container>
    </Box>
  );
};

export default Docs; 