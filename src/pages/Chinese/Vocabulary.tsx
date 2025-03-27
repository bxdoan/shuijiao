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
  IconButton,
} from '@chakra-ui/react';
import { FaBook, FaShare, FaGraduationCap } from 'react-icons/fa';
import { fetchVocabularyCategories } from '../../api/vocabApi';
import { VocabularyCategory } from '../../types';
import SEO from '../../components/Common/SEO';
import { ShareModal } from '../../components/Common/ShareModal';
import vocabData from '../../data_example/vocab.json';

const ChineseVocabulary: React.FC = () => {
  const [categories, setCategories] = useState<VocabularyCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const navigate = useNavigate();

  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const textColor = useColorModeValue('gray.800', 'white');
  const badgeColor = useColorModeValue('blue.500', 'blue.300');
  const hskBadgeColor = useColorModeValue('purple.500', 'purple.300');

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

  const handleHskClick = (hsk: string) => {
    navigate(`/zh/vocab/hsk/${hsk}`);
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
          <HStack justify="space-between">
            <Heading size="lg">Từ vựng tiếng Trung theo chủ đề</Heading>
            <IconButton
              aria-label="Chia sẻ"
              icon={<FaShare />}
              onClick={() => setIsShareModalOpen(true)}
              colorScheme="blue"
              variant="ghost"
              size="sm"
            />
          </HStack>

          <ShareModal
            isOpen={isShareModalOpen}
            onClose={() => setIsShareModalOpen(false)}
            title="Chia sẻ bộ từ vựng"
            shareText="Học từ vựng tiếng Trung theo chủ đề với Shuijiao"
          />

          {/* HSK Categories */}
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Theo HSK</Heading>
            <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={4}>
              {vocabData.map((hsk) => (
                <Card
                  key={hsk.id}
                  bg={bgColor}
                  borderWidth="1px"
                  borderColor={borderColor}
                  cursor="pointer"
                  onClick={() => handleHskClick(hsk.hsk)}
                  transition="transform 0.2s"
                  _hover={{ transform: 'scale(1.02)' }}
                >
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack>
                        <FaGraduationCap color={hskBadgeColor} />
                        <Text fontSize="lg" fontWeight="bold" color={textColor}>
                          {hsk.n_vi}
                        </Text>
                      </HStack>
                      <Text color="gray.600" fontSize="sm">
                        {hsk.n_en}
                      </Text>
                      <Badge colorScheme="purple">
                        {hsk.notebooks_count} từ vựng
                      </Badge>
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </SimpleGrid>
          </VStack>

          {/* Topic Categories */}
          <VStack align="stretch" spacing={4}>
            <Heading size="md">Theo chủ đề</Heading>
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
        </VStack>
      </Container>
    </>
  );
};

export default ChineseVocabulary; 