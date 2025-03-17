import { IconType } from 'react-icons';
import { ComponentWithAs } from '@chakra-ui/react';

declare module 'react-icons/fa' {
  export const FaFacebook: IconType;
  export const FaTwitter: IconType;
  export const FaInstagram: IconType;
  export const FaYoutube: IconType;
  export const FaGithub: IconType;
}

declare module '@chakra-ui/react' {
  export interface ChakraProps {
    as?: React.ElementType;
  }
} 