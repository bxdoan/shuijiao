// @ts-nocheck
import React from 'react';
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { 
  ChevronDownIcon,
} from '@chakra-ui/icons';
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

const ChineseMenu = () => {
  const location = useLocation();
  
  // Check if current path is a Chinese path
  const isChinesePath = location.pathname === '/zh' || location.pathname === '/' || 
                         location.pathname.startsWith('/zh/');
  
  // Check if current path is HSK related
  const isHSKPath = location.pathname.includes('/zh/vi/hsk/');
  
  // Get current HSK level if on HSK path
  const currentLevel = isHSKPath ? location.pathname.split('/')[4] : null;
  
  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant={isChinesePath ? "solid" : "ghost"}
        colorScheme="yellow"
        size="md"
      >
        Tiếng Trung
      </MenuButton>
      <MenuList 
        bg="red.700" 
        borderColor="red.600"
        boxShadow="xl"
        zIndex={20}
        color="white"
        border="2px solid"
        p={1}
        minWidth="250px"
      >
        <MenuItem 
          as={Link} 
          to="/zh" 
          icon={<FaNewspaper />}
          _hover={{ bg: 'red.600' }}
          color="white"
          fontWeight="medium"
          bg="red.700"
        >
          Đọc báo
        </MenuItem>
        
        <MenuDivider borderColor="red.600" />
        
        <MenuItem 
          as={Link} 
          to="/zh/dict" 
          icon={<FaBook />}
          _hover={{ bg: 'red.600' }}
          color="white"
          fontWeight="medium"
          bg="red.700"
        >
          Từ điển Hán Việt
        </MenuItem>
        
        <MenuDivider borderColor="red.600" />
        
        {/* HSK Submenu */}
        <MenuGroup 
          title="Học HSK" 
          color="yellow.300"
          fontWeight="bold"
          fontSize="sm"
          pl={3}
          pb={2}
          pt={1}
        >
          <Box mt={2}>
            {/* Chia danh sách HSK thành 2 hàng */}
            <Grid templateColumns="repeat(3, 1fr)" gap={1} mb={2}>
              {/* Hàng đầu HSK 1-3 */}
              {HSK_LEVELS.slice(0, 3).map(level => (
                <GridItem key={level.level}>
                  <MenuItem 
                    as={Link} 
                    to={`/zh/vi/hsk/${level.level}`}
                    _hover={{ bg: 'red.600' }}
                    color="white"
                    fontWeight={currentLevel === level.level ? "bold" : "medium"}
                    bg="red.700"
                    height="100%"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Flex align="center" justify="center">
                      <Icon as={FaGraduationCap} mr={1} color={`${level.color}.300`} />
                      <Text fontSize="sm">HSK {level.level}</Text>
                    </Flex>
                  </MenuItem>
                </GridItem>
              ))}
            </Grid>
            
            {/* Hàng thứ hai HSK 4-6 */}
            <Grid templateColumns="repeat(3, 1fr)" gap={1}>
              {HSK_LEVELS.slice(3).map(level => (
                <GridItem key={level.level}>
                  <MenuItem 
                    as={Link} 
                    to={`/zh/vi/hsk/${level.level}`}
                    _hover={{ bg: 'red.600' }}
                    color="white"
                    fontWeight={currentLevel === level.level ? "bold" : "medium"}
                    bg="red.700"
                    height="100%"
                    px={2}
                    py={1}
                    borderRadius="md"
                  >
                    <Flex align="center" justify="center">
                      <Icon as={FaGraduationCap} mr={1} color={`${level.color}.300`} />
                      <Text fontSize="sm">HSK {level.level}</Text>
                    </Flex>
                  </MenuItem>
                </GridItem>
              ))}
            </Grid>
          </Box>
        </MenuGroup>
      </MenuList>
    </Menu>
  );
};

export default ChineseMenu; 