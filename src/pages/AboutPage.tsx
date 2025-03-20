// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
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
            Shuijiao
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Nền tảng được thiết kế để giúp bạn học tiếng Trung qua tin tức thực tế
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
            Sứ Mệnh Của Chúng Tôi
          </Heading>
          <Text mb={4}>
              Shuijiao cam kết làm cho việc học tiếng Trung trở nên dễ tiếp cận,
            hấp dẫn và hiệu quả thông qua nội dung tin tức thực tế. Chúng tôi tin rằng
            học ngôn ngữ thông qua tài liệu thực tế là một trong những cách hiệu quả nhất
            để đạt được sự thành thạo.
          </Text>
          <Text>
            Bằng cách cung cấp các bài báo tin tức với văn bản tiếng Trung, pinyin và bản dịch tiếng Anh,
            chúng tôi giúp người học ở mọi trình độ cải thiện khả năng đọc hiểu, từ vựng,
            và hiểu biết văn hóa.
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
            Tính Năng
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Bài viết bằng tiếng Trung kèm pinyin và bản dịch tiếng Anh
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Nội dung được phân loại theo cấp độ khó (Dễ, Trung Bình, Khó)
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Đa dạng chủ đề bao gồm văn hóa, công nghệ, kinh doanh, và nhiều lĩnh vực khác
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Bài viết từ nhiều nguồn uy tín khác nhau
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Giao diện thân thiện với người dùng và có tùy chọn lọc
            </ListItem>
          </List>
        </Box>

        <Divider />

        <Box textAlign="center">
          <Text>
            Dự án này được lấy cảm hứng từ{' '}
            <Link href="https://easychinese.io" color="blue.500" isExternal>
              EasyChinese.io
            </Link>
            , một nguồn tài nguyên tuyệt vời cho người học tiếng Trung.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage; 