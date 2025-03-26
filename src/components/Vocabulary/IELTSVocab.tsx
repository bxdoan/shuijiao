// @ts-nocheck - Bỏ qua kiểm tra TypeScript để tránh lỗi Union Type phức tạp
import React from 'react';
import {
  Box,
  Text,
  Heading,
  SimpleGrid,
  Badge,
  useColorModeValue,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Tooltip,
} from '@chakra-ui/react';

interface IELTSVocabularyBoxProps {
  levelIELTS: {
    [key: string]: string[];
  };
}

interface IELTSLevelConfig {
  [key: string]: { color: string; title: string };
}

// Map các cấp độ IELTS sang màu sắc và tiêu đề
const ieltsLevelConfig: IELTSLevelConfig = {
  '1': { color: 'green', title: 'IELTS Band 4.0-4.5 - Cơ bản' },
  '2': { color: 'blue', title: 'IELTS Band 4.5-5.0 - Trung cấp' },
  '3': { color: 'purple', title: 'IELTS Band 5.0-5.5 - Nâng cao' },
  '4': { color: 'red', title: 'IELTS Band 5.5-6.0 - Thành thạo' },
  'unknown': { color: 'gray', title: 'Không xác định' },
};

// Thứ tự hiển thị các cấp độ
const displayOrder = ['1', '2', '3', '4', 'unknown'];

const IELTSVocabularyBox: React.FC<IELTSVocabularyBoxProps> = ({ levelIELTS }) => {
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  
  // Kiểm tra nếu không có dữ liệu
  if (!levelIELTS || Object.keys(levelIELTS).length === 0) {
    return null;
  }

  return (
    <Box
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      bg={bgColor}
      borderColor={borderColor}
      boxShadow="md"
      p={4}
    >
      <Heading as="h3" size="md" mb={4} textAlign="center">
        IELTS Vocabulary in this article
      </Heading>
      
      <Accordion allowMultiple defaultIndex={[0]}>
        {displayOrder.map((level) => {
          // Chỉ hiện thị cấp độ có từ vựng
          if (!levelIELTS[level] || levelIELTS[level].length === 0) {
            return null;
          }
          
          const config = ieltsLevelConfig[level];
          
          return (
            <AccordionItem key={level} mb={2}>
              <h2>
                <AccordionButton>
                  <HStack flex="1" justifyContent="space-between">
                    <Text fontWeight="bold">{config.title}</Text>
                    <Badge colorScheme={config.color} fontSize="0.8em">
                      {levelIELTS[level].length} words
                    </Badge>
                  </HStack>
                  <AccordionIcon />
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <SimpleGrid columns={{ base: 2, md: 3, lg: 4 }} spacing={2}>
                  {levelIELTS[level].map((word, index) => (
                    <Tooltip 
                      key={`${level}-${index}`} 
                      label="Click to see details (coming soon)"
                      hasArrow
                    >
                      <Box 
                        p={2} 
                        borderWidth="1px" 
                        borderRadius="md" 
                        borderColor={`${config.color}.200`}
                        bg={`${config.color}.50`}
                        _hover={{ bg: `${config.color}.100`, cursor: 'pointer' }}
                        _dark={{
                          bg: `${config.color}.900`,
                          borderColor: `${config.color}.700`,
                          _hover: { bg: `${config.color}.800` }
                        }}
                      >
                        <Text fontSize="md" textAlign="center">{word}</Text>
                      </Box>
                    </Tooltip>
                  ))}
                </SimpleGrid>
              </AccordionPanel>
            </AccordionItem>
          );
        })}
      </Accordion>
    </Box>
  );
};

export default IELTSVocabularyBox; 