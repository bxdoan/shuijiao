import { extendTheme, ThemeConfig } from '@chakra-ui/react';

// Cấu hình chế độ màu - đặt chế độ tối làm mặc định
const config: ThemeConfig = {
  initialColorMode: 'dark',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    yellow: {
      50: '#FFFFF0',
      100: '#FEFCBF',
      200: '#FAF089',
      300: '#F6E05E',
      400: '#ECC94B',
      500: '#D69E2E',
      600: '#B7791F',
      700: '#975A16',
      800: '#744210',
      900: '#5F370E',
    },
  },
  fonts: {
    heading: '"Noto Sans SC", sans-serif',
    body: '"Noto Sans", sans-serif',
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.50',
        color: props.colorMode === 'dark' ? 'white' : 'gray.800',
      },
    }),
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'medium',
        borderRadius: 'md',
      },
      variants: {
        solid: (props: any) => ({
          bg: props.colorScheme === 'yellow' ? 'yellow.400' : 'brand.500',
          color: props.colorScheme === 'yellow' ? 'black' : 'white',
          _hover: {
            bg: props.colorScheme === 'yellow' ? 'yellow.500' : 'brand.600',
          },
        }),
        ghost: (props: any) => ({
          color: props.colorScheme === 'yellow' ? 'yellow.300' : props.colorMode === 'dark' ? 'whiteAlpha.900' : 'gray.800',
          _hover: {
            bg: props.colorScheme === 'yellow' ? 'rgba(236, 201, 75, 0.15)' : 'blackAlpha.50',
          },
        }),
        outline: {
          borderColor: 'brand.500',
          color: 'brand.500',
        },
      },
    },
    Card: {
      baseStyle: {
        container: {
          borderRadius: 'lg',
          overflow: 'hidden',
          boxShadow: 'md',
          transition: 'all 0.3s ease',
          _hover: {
            boxShadow: 'lg',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
  },
});

export default theme; 