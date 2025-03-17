import React from 'react';
import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  Divider,
  List,
  ListItem,
  ListIcon,
  Link,
  useColorModeValue,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';

const AboutPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4}>
            About Kim Én Chinese
          </Heading>
          <Text fontSize="lg" color="gray.600">
            A platform designed to help you learn Chinese through real-world news
          </Text>
        </Box>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <Heading as="h2" size="lg" mb={4}>
            Our Mission
          </Heading>
          <Text mb={4}>
            Kim Én Chinese is dedicated to making Chinese language learning accessible,
            engaging, and effective through authentic news content. We believe that
            learning a language through real-world materials is one of the most effective
            ways to achieve fluency.
          </Text>
          <Text>
            By providing news articles with Chinese text, pinyin, and English translations,
            we help learners at all levels improve their reading comprehension, vocabulary,
            and cultural understanding.
          </Text>
        </Box>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <Heading as="h2" size="lg" mb={4}>
            Features
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Articles in Chinese with pinyin and English translations
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Content categorized by difficulty level (Easy, Medium, Hard)
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Diverse topics including culture, technology, business, and more
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Articles from various reputable sources
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              User-friendly interface with filtering options
            </ListItem>
          </List>
        </Box>

        <Divider />

        <Box textAlign="center">
          <Text>
            This project is inspired by{' '}
            <Link href="https://easychinese.io" color="blue.500" isExternal>
              EasyChinese.io
            </Link>
            , a great resource for Chinese language learners.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage; 