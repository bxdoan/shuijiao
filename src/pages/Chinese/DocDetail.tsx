// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Image,
  Button,
  Badge,
  useColorModeValue,
  Spinner,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Alert,
  AlertIcon,
  Divider,
  Flex
} from '@chakra-ui/react';
import { useParams, Link as RouterLink, useNavigate } from 'react-router-dom';
import { FaDownload, FaArrowLeft } from 'react-icons/fa';
import { ChevronRightIcon } from '@chakra-ui/icons';

import SEO from '../../components/Common/SEO';

interface Doc {
  id: string;
  thumbnail: string;
  title: string;
  description: string;
  url: string;
}

const DocDetail = () => {
  const { id } = useParams();
  const [doc, setDoc] = useState<Doc | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  
  // Màu sắc dựa trên theme
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const pageBgColor = useColorModeValue('gray.50', 'gray.900');

  useEffect(() => {
    const loadDoc = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Import file docs.json
        const docsModule = await import('../../data_example/docs.json');
        const docs = docsModule.default || [];
        
        // Tìm tài liệu theo ID
        const foundDoc = docs.find((d: Doc) => d.id === id);
        
        if (foundDoc) {
          setDoc(foundDoc);
        } else {
          setError('Không tìm thấy tài liệu');
        }
      } catch (error) {
        console.error('Error loading doc:', error);
        setError('Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    loadDoc();
  }, [id]);

  const handleDownload = () => {
    if (doc?.url) {
      window.open(doc.url, '_blank');
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" align="center" minHeight="50vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Box py={10} textAlign="center">
        <Alert status="warning" maxW="container.md" mx="auto" mb={6}>
          <AlertIcon />
          {error}
        </Alert>
        <Button 
          leftIcon={<FaArrowLeft />} 
          colorScheme="blue" 
          onClick={() => navigate('/zh/docs')}
        >
          Quay lại danh sách tài liệu
        </Button>
      </Box>
    );
  }

  if (!doc) {
    return (
      <Box py={10} textAlign="center">
        <Heading size="lg" mb={4}>Không tìm thấy tài liệu</Heading>
        <Text mb={6}>Không tìm thấy tài liệu với ID: {id}</Text>
        <Button 
          leftIcon={<FaArrowLeft />} 
          colorScheme="blue" 
          onClick={() => navigate('/zh/docs')}
        >
          Quay lại danh sách tài liệu
        </Button>
      </Box>
    );
  }

  return (
    <Box py={8} bg={pageBgColor}>
      <SEO 
        title={`${doc.title} - Shuijiao Chinese Learning`}
        description={doc.description}
        keywords={`tài liệu học tiếng Trung, ${doc.title}, Shuijiao`}
      />
      
      <Container maxW="container.xl">
        <VStack spacing={8} align="stretch">
          {/* Breadcrumbs */}
          <Breadcrumb separator={<ChevronRightIcon color="gray.500" />} fontSize="sm">
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/zh">Trang chủ</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem>
              <BreadcrumbLink as={RouterLink} to="/zh/docs">Tài liệu</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbItem isCurrentPage>
              <BreadcrumbLink>{doc.title}</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          
          {/* Header */}
          <Box>
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
              size="xl" 
              mb={4}
            >
              {doc.title}
            </Heading>
          </Box>

          {/* Main content */}
          <Flex 
            direction={{ base: 'column', lg: 'row' }} 
            gap={8}
          >
            {/* Left column - Image */}
            <Box flex="1" borderRadius="lg" overflow="hidden" bg={bgColor} boxShadow="base">
              <Image
                src={doc.thumbnail}
                alt={doc.title}
                width="100%"
                height="auto"
                objectFit="cover"
                fallbackSrc="https://via.placeholder.com/800x400?text=Shuijiao+Docs"
              />
            </Box>
            
            {/* Right column - Description */}
            <Box 
              width={{ base: "100%", lg: "40%" }} 
              bg={bgColor} 
              p={6} 
              borderRadius="lg" 
              borderWidth="1px" 
              borderColor={borderColor}
            >
              <Heading as="h2" size="md" mb={4}>
                Mô tả
              </Heading>
              <Divider mb={4} />
              
              <Text mb={6}>
                {doc.description}
              </Text>
              
              <VStack spacing={3}>
                <Button 
                  leftIcon={<FaDownload />}
                  colorScheme="blue"
                  size="lg"
                  width="full"
                  onClick={handleDownload}
                >
                  Tải xuống
                </Button>

                <Button 
                  leftIcon={<FaArrowLeft />}
                  colorScheme="blue"
                  variant="outline"
                  size="md"
                  width="full"
                  onClick={() => navigate('/zh/docs')}
                >
                  Quay lại danh sách tài liệu
                </Button>
              </VStack>
            </Box>
          </Flex>
        </VStack>
      </Container>
    </Box>
  );
};

export default DocDetail; 