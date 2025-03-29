// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { 
  Button,
  HStack
} from '@chakra-ui/react';
import { 
  Link, 
  useLocation
} from 'react-router-dom';

import { LearnMenu } from './LearnMenu';


export const LanguageMenu = () => {
  const location = useLocation();
  const [learnLang, setLearnLang] = useState('zh'); // Default to Chinese
  
  useEffect(() => {
    // Get learnLang from localStorage on component mount
    const savedLang = localStorage.getItem('learnLang');
    if (savedLang) {
      setLearnLang(savedLang);
    } else {
      setLearnLang('zh');
      localStorage.setItem('learnLang', 'zh');
    }
  }, []);
  
  const getMenuItems = () => {
    if (learnLang === 'zh') {
      return (
        <HStack spacing="1" ml={1}>
          <Button
          as={Link}
          to="/zh"
          variant={location.pathname === '/zh' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Đọc báo
          </Button>
          <Button
          as={Link}
          to="/zh/dict"
          variant={location.pathname === '/zh/dict' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Từ điển
          </Button>
          <Button
          as={Link}
          to="/zh/video"
          variant={location.pathname === '/zh/video' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Video
          </Button>
          <Button
          as={Link}
          to="/zh/vocab"
          variant={location.pathname === '/zh/vocab' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Từ vựng
          </Button>
          <LearnMenu />
          <Button
          as={Link}
          to="/translate"
          variant={location.pathname === '/translate' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Dịch
          </Button>
        </HStack>
      );
    } else {
      return (
        <HStack spacing="1" ml={1}>
           <Button
          as={Link}
          to="/en"
          variant={location.pathname === '/en' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
            Đọc báo
          </Button>          
          <Button
          as={Link}
          to="/translate"
          variant={location.pathname === '/translate' ? "solid" : "ghost"}
          colorScheme="yellow"
          size="md"
          >
              Dịch
          </Button>
        </HStack>
      );
    }
  };

  return (
    <>
        {getMenuItems()}
    </>
  );
};