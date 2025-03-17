import '@chakra-ui/react';

// Override complex types to simplify them
declare module '@chakra-ui/react' {
  // Simplify Container props
  export interface ContainerProps {
    maxW?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  // Simplify Box props
  export interface BoxProps {
    as?: any;
    children?: React.ReactNode;
    [key: string]: any;
  }
  
  // Simplify other component props as needed
  export interface FlexProps extends BoxProps {}
  export interface StackProps extends BoxProps {}
  export interface TextProps extends BoxProps {}
  export interface HeadingProps extends BoxProps {}
  export interface ButtonProps extends BoxProps {}
  export interface IconButtonProps extends BoxProps {}
} 