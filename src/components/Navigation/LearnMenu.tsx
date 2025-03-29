// @ts-nocheck
import React from 'react';
import { 
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuGroup,
  Button,
  Box,
  Icon,
  Text,
  Flex,
  Grid,
  GridItem,
  Divider
} from '@chakra-ui/react';
import { 
  ChevronDownIcon,
} from '@chakra-ui/icons';
import { 
  Link, 
  useLocation
} from 'react-router-dom';
import { 
  FaGraduationCap,
  FaFileAlt
} from 'react-icons/fa';
import { HSK_LEVELS } from '../../constant/hsk';

export const LearnMenu = () => {
  const location = useLocation();
  // Check if current path is HSK related
  const isHSKPath = location.pathname.includes('/zh/vi/hsk/');
  const isDocsPath = location.pathname.includes('/zh/docs');
  
  // Get current HSK level if on HSK path
  const currentLevel = isHSKPath ? location.pathname.split('/')[4] : null;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant={isHSKPath || isDocsPath ? "solid" : "ghost"}
        colorScheme="yellow"
        size="md"
      >
        Học
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
        {/* Tài Liệu Menu Item */}
        <MenuItem 
          as={Link} 
          to="/zh/docs"
          _hover={{ bg: 'red.600' }}
          color={isDocsPath ? "yellow.300" : "white"}
          fontWeight={isDocsPath ? "bold" : "medium"}
          bg="red.700"
          height="100%"
          px={2}
          py={1}
          borderRadius="md"
          mb={2}
        >
          <Flex align="center" justify="center">
            <Icon as={FaFileAlt} mr={1} color="blue.300" />
            <Text fontSize="sm">Tài Liệu</Text>
          </Flex>
        </MenuItem>

        <Divider borderColor="red.600" mb={2} />

        {/* HSK Submenu */}
        <MenuGroup 
          title="Học HSK" 
          color="white"
          fontWeight={isHSKPath ? "bold" : "medium"}
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
                    color={currentLevel === level.level ? "yellow.300" : "white"} 
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
                    color={currentLevel === level.level ? "yellow.300" : "white"} 
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