// @ts-nocheck
import React from 'react';
import {
  VStack,
  Heading,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  HStack,
  Icon,
  Text,
  Divider,
  Badge
} from '@chakra-ui/react';
import {
  Link,
  useLocation
} from 'react-router-dom';
import {
  FaBook,
  FaNewspaper,
  FaGraduationCap
} from 'react-icons/fa';

// HSK levels available
const HSK_LEVELS = [
  { level: "1", title: "HSK 1", color: "green" },
  { level: "2", title: "HSK 2", color: "blue" },
  { level: "3", title: "HSK 3", color: "purple" },
  { level: "4", title: "HSK 4", color: "orange" },
  { level: "5", title: "HSK 5", color: "pink" },
  { level: "6", title: "HSK 6", color: "red" },
];

interface MobileChineseMenuProps {
  onCloseDrawer: () => void;
}

const MobileChineseMenu = ({ onCloseDrawer }: MobileChineseMenuProps) => {
  const location = useLocation();
  
  // Check if current path is HSK related
  const isHSKPath = location.pathname.includes('/zh/vi/hsk/');
  
  // Get current HSK level if on HSK path
  const currentLevel = isHSKPath ? location.pathname.split('/')[4] : null;

  return (
    <VStack spacing={3} align="stretch" mt={2}>
      <Heading as="h3" size="sm" color="yellow.300" mb={0}>
        Tiếng Trung
      </Heading>
      
      <Button
        as={Link}
        to="/zh"
        variant="ghost"
        colorScheme="yellow"
        size="md"
        justifyContent="flex-start"
        leftIcon={<FaNewspaper />}
        onClick={onCloseDrawer}
      >
        Đọc báo
      </Button>
      
      <Button
        as={Link}
        to="/zh/dict"
        variant="ghost"
        colorScheme="yellow"
        size="md"
        justifyContent="flex-start"
        leftIcon={<FaBook />}
        onClick={onCloseDrawer}
      >
        Từ điển Hán Việt
      </Button>
      
      <Accordion allowToggle defaultIndex={isHSKPath ? [0] : undefined}>
        <AccordionItem border="none">
          <h2>
            <AccordionButton 
              px={2} 
              _hover={{ bg: 'rgba(236, 201, 75, 0.15)' }}
              borderRadius="md"
            >
              <HStack flex='1' textAlign='left' spacing={2}>
                <Icon as={FaGraduationCap} color="yellow.400" />
                <Text color="yellow.300" fontWeight="medium">Học HSK</Text>
                {isHSKPath && (
                  <Badge colorScheme={HSK_LEVELS.find(l => l.level === currentLevel)?.color || "gray"}>
                    {currentLevel}
                  </Badge>
                )}
              </HStack>
              <AccordionIcon color="yellow.300" />
            </AccordionButton>
          </h2>
          <AccordionPanel pb={2} pt={2} pl={2}>
            <VStack align="stretch" spacing={1}>
              {HSK_LEVELS.map(level => (
                <Button
                  key={level.level}
                  as={Link}
                  to={`/zh/vi/hsk/${level.level}`}
                  variant={currentLevel === level.level ? "solid" : "ghost"}
                  colorScheme={level.color}
                  size="sm"
                  justifyContent="flex-start"
                  leftIcon={<FaGraduationCap />}
                  onClick={onCloseDrawer}
                  mb={1}
                >
                  HSK {level.level}
                </Button>
              ))}
            </VStack>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      
      <Divider borderColor="red.600" my={1} />
    </VStack>
  );
};

export default MobileChineseMenu; 