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
  useColorModeValue,
  Flex,
  Badge,
  SimpleGrid,
} from '@chakra-ui/react';
import { CheckCircleIcon } from '@chakra-ui/icons';
import DonationBox from '../components/DonationBox';

const AboutPage: React.FC = () => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const accentColor = useColorModeValue('blue.500', 'blue.300');

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={4} color={accentColor}>
            Shuijiao
          </Heading>
          <Text fontSize="xl" fontWeight="medium" mb={2}>
            Học ngôn ngữ thông qua đọc tin tức thực tế
          </Text>
          <Text fontSize="lg" color="gray.600">
            Nền tảng được thiết kế để giúp bạn học các ngôn ngữ thông dụng qua tin tức thực tế hàng ngày
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
          <Heading as="h2" size="lg" mb={4} color={accentColor}>
            Sứ Mệnh Của Chúng Tôi
          </Heading>
          <Text mb={4}>
            Shuijiao cam kết làm cho việc học ngoại ngữ trở nên dễ tiếp cận,
            hấp dẫn và hiệu quả thông qua nội dung tin tức thực tế. Chúng tôi tin rằng
            học ngôn ngữ thông qua tài liệu thực tế là một trong những cách hiệu quả nhất
            để đạt được sự thành thạo.
          </Text>
          <Text>
            Bằng cách cung cấp các bài báo tin tức bằng nhiều ngôn ngữ như Anh, Trung, Hàn, Pháp, Đức
            kèm theo bản dịch tiếng Việt, chúng tôi giúp người học ở mọi trình độ cải thiện khả năng 
            đọc hiểu, từ vựng, và hiểu biết văn hóa thông qua nội dung thời sự.
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
          <Heading as="h2" size="lg" mb={4} color={accentColor}>
            Các Ngôn Ngữ Được Hỗ Trợ
          </Heading>
          <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={6} mb={6}>
            {[
              { name: 'Tiếng Anh', icon: '🇬🇧', color: 'blue' },
              { name: 'Tiếng Trung', icon: '🇨🇳', color: 'red' },
              { name: 'Tiếng Hàn', icon: '🇰🇷', color: 'blue' },
              { name: 'Tiếng Pháp', icon: '🇫🇷', color: 'blue' },
              { name: 'Tiếng Đức', icon: '🇩🇪', color: 'yellow' },
            ].map((lang) => (
              <Flex
                key={lang.name}
                direction="column"
                align="center"
                p={4}
                borderWidth="1px"
                borderRadius="md"
                borderColor="gray.200"
                boxShadow="sm"
                _hover={{ transform: 'translateY(-2px)', boxShadow: 'md' }}
                transition="all 0.2s"
              >
                <Text fontSize="3xl" mb={2}>{lang.icon}</Text>
                <Badge colorScheme={lang.color} fontSize="sm" px={2} py={1}>
                  {lang.name}
                </Badge>
              </Flex>
            ))}
          </SimpleGrid>
          <Text fontSize="sm" color="gray.500" fontStyle="italic">
            * Chúng tôi đang tiếp tục mở rộng danh sách ngôn ngữ được hỗ trợ
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
          <Heading as="h2" size="lg" mb={4} color={accentColor}>
            Tính Năng
          </Heading>
          <List spacing={3}>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Bài viết bằng nhiều ngôn ngữ khác nhau kèm bản dịch tiếng Việt
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
              Bài viết từ nhiều nguồn uy tín khác nhau từ các quốc gia
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Công cụ dịch tích hợp giúp hiểu nội dung nhanh chóng
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Cập nhật tin tức mới hàng ngày từ nhiều nguồn quốc tế
            </ListItem>
            <ListItem>
              <ListIcon as={CheckCircleIcon} color="green.500" />
              Giao diện thân thiện với người dùng và có tùy chọn lọc theo ngôn ngữ, chủ đề
            </ListItem>
          </List>
        </Box>

        <Box
          p={6}
          bg={bgColor}
          borderRadius="lg"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <Heading as="h2" size="lg" mb={4} color={accentColor}>
            Hỗ Trợ Phát Triển
          </Heading>
          <Text mb={6}>
            Shuijiao là một dự án phi lợi nhuận với mục tiêu giúp người Việt tiếp cận với các ngôn ngữ quốc tế
            một cách dễ dàng và miễn phí. Chúng tôi duy trì dự án này thông qua sự ủng hộ của cộng đồng.
            Nếu bạn thấy Shuijiao hữu ích, vui lòng xem xét ủng hộ để chúng tôi có thể tiếp tục phát triển
            thêm nhiều ngôn ngữ và tính năng mới.
          </Text>
          
          <DonationBox 
            title="Ủng hộ phát triển Shuijiao" 
            description="Sự ủng hộ của bạn sẽ giúp chúng tôi duy trì và mở rộng hỗ trợ thêm nhiều ngôn ngữ và tính năng mới."
            bankName="MBBANK"
            accountNumber="0904195065"
            accountHolder="Bui Xuan Doan"
            transferMessage="Ho tro Shuijiao"
          />
        </Box>

        <Divider />

        <Box textAlign="center" p={4}>
          <Text mt={2} fontSize="sm" color="gray.500">
            © {new Date().getFullYear()} Shuijiao. Mọi quyền được bảo lưu.
          </Text>
        </Box>
      </VStack>
    </Container>
  );
};

export default AboutPage; 