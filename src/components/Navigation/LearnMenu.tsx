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
  FaGraduationCap,
} from 'react-icons/fa';
import { HSK_LEVELS } from '../../constant/hsk';

export const LearnMenu = () => {
  const location = useLocation();
  // Check if current path is HSK related
  const isHSKPath = location.pathname.includes('/zh/vi/hsk/');
  
  // Get current HSK level if on HSK path
  const currentLevel = isHSKPath ? location.pathname.split('/')[4] : null;

  return (
    <Menu closeOnSelect={false}>
      <MenuButton
        as={Button}
        rightIcon={<ChevronDownIcon />}
        variant={isHSKPath ? "solid" : "ghost"}
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