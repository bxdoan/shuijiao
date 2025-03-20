// @ts-nocheck
import React from 'react';
import {
  Box,
  Heading,
  Text,
  Image,
  Flex,
  Link,
  useColorModeValue,
  Button,
  useToast,
  HStack
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';

import { qrCodeUrl } from '../utils/utils';

interface DonationBoxProps {
  title?: string;
  description?: string;
  bankName?: string;
  accountNumber?: string;
  accountHolder?: string;
  transferMessage?: string;
  supportLink?: string;
}

export const DonationBox: React.FC<DonationBoxProps> = ({
  title = "Ủng hộ dự án Shuijiao",
  description = "Nếu bạn thấy ứng dụng hữu ích, hãy ủng hộ để chúng tôi có thể phát triển thêm nhiều tính năng mới.",
  bankName = "MBBANK",
  accountNumber = "0904195065",
  accountHolder = "NGUYEN VAN A",
  transferMessage = "Ho tro Shuijiao",
  supportLink = "#"
}) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('blue.400', 'blue.500');
  const toast = useToast();

  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Đã sao chép",
      description: `${fieldName} đã được sao chép vào clipboard`,
      status: "success",
      duration: 2000,
      isClosable: true,
      position: "bottom"
    });
  };

  const bankDetails = {
    bankId: bankName,
    accountNumber: accountNumber,
    accountHolder: accountHolder,
    transferContent: transferMessage,
    template: "compact2",
  };

  const qrUrl = qrCodeUrl(bankDetails);

  return (
    <Box 
      borderWidth="1px"
      borderRadius="lg"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      p={5}
      textAlign="center"
      width="100%"
    >
      <Heading as="h3" size="md" mb={3} color="blue.600">
        {title}
      </Heading>
      <Text mb={4}>
        {description}
      </Text>
      <Flex direction={{ base: "column", md: "row" }} alignItems="center" justifyContent="center" gap={4}>
        <Box>
          <Image 
            src={qrUrl} 
            alt="QR Code chuyển khoản" 
            borderRadius="md"
            border="1px"
            borderColor="gray.200"
            boxSize={{ base: "200px", md: "180px" }}
            height={{ base: "250px", md: "220px" }}
          />
        </Box>
        <Box textAlign={{ base: "center", md: "left" }}>
          <Text fontWeight="bold" mb={2}>Thông tin chuyển khoản:</Text>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Ngân hàng: {bankName}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(bankName, "Ngân hàng")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Số tài khoản: {accountNumber}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(accountNumber, "Số tài khoản")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mb={1} justify={{ base: "center", md: "flex-start" }}>
            <Text>Chủ tài khoản: {accountHolder}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(accountHolder, "Chủ tài khoản")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
          
          <HStack mt={2} justify={{ base: "center", md: "flex-start" }}>
            <Text fontStyle="italic">Nội dung: {transferMessage}</Text>
            <Button 
              size="xs" 
              onClick={() => handleCopy(transferMessage, "Nội dung")}
              colorScheme="blue"
              variant="ghost"
              leftIcon={<CopyIcon />}
            >
              Copy
            </Button>
          </HStack>
        </Box>
      </Flex>
    </Box>
  );
};

export default DonationBox; 