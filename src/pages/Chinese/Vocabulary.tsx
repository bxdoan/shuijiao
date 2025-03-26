// @ts-nocheck
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Center,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaBook } from 'react-icons/fa';
import { fetchVocabularyCategories } from '../../api/newsApi';
import { VocabularyCategory } from '../../types';
import SEO from '../../components/Common/SEO';

const ChineseVocabulary: React.FC = () => {
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const badgeColor = useColorModeValue('blue.500', 'blue.300');

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await fetchVocabularyCategories();
        setCategories(response.result);
      } catch (error) {
        console.error('Error loading vocabulary categories:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  const handleCategoryClick = (category: VocabularyCategory) => {
    navigate(`/zh/vocab/${category.p}`);
  };

  if (isLoading) {
    return (
      <Center minH="60vh">
        <Spinner size="xl" color="blue.500" thickness="4px" />
      </Center>
    );
  }

  return (
    <>
      <SEO
        title="Từ vựng tiếng Trung - Shuijiao"
        description="Học từ vựng tiếng Trung theo chủ đề"
        keywords="từ vựng tiếng Trung, học tiếng Trung, chủ đề từ vựng"
      />
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Heading size="lg">Từ vựng tiếng Trung theo chủ đề</Heading>
          
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {categories.map((category) => (
              <Card
                key={category.p}
                bg={bgColor}
                borderWidth="1px"
                borderColor={borderColor}
                cursor="pointer"
                onClick={() => handleCategoryClick(category)}
                transition="transform 0.2s"
                _hover={{ transform: 'scale(1.02)' }}
              >
                <CardBody>
                  <VStack align="start" spacing={3}>
                    <HStack>
                      <FaBook color={badgeColor} />
                      <Text fontSize="lg" fontWeight="bold" color={textColor}>
                        {category.n_vi}
                      </Text>
                    </HStack>
                    <Text color="gray.600" fontSize="sm">
                      {category.n_en}
                    </Text>
                    <Badge colorScheme="blue">
                      {category.notebooks_count} từ vựng
                    </Badge>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        </VStack>
      </Container>
    </>
  );
};

export default ChineseVocabulary; 