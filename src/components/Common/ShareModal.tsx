// @ts-nocheck
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { FaTwitter, FaFacebook, FaLink } from 'react-icons/fa';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareText: string;
  url?: string;
}

export const ShareModal = ({
  isOpen,
  onClose,
  title,
  shareText,
  url = window.location.href,
}: ShareModalProps) => {
    const toast = useToast();
    const handleShareComplete = (platform: 'copy') => {
        if (platform === 'copy') {
            toast({
                title: "Đã sao chép link!",
                status: "success",
                duration: 2000,
            });
        }
    };
    const handleShare = (platform: 'twitter' | 'facebook' | 'copy') => {
        switch (platform) {
            case 'twitter':
                window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(url)}`);
                break;
            case 'facebook':
                window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`);
                break;
            case 'copy':
                navigator.clipboard.writeText(url);
                handleShareComplete(platform);
                break;
        }
        onClose();
    };

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose}
            isCentered
            motionPreset="slideInBottom"
        >
            <ModalOverlay 
                bg="blackAlpha.300" 
                backdropFilter="blur(10px)"
            />
            <ModalContent
                mx={4}
                maxW="md"
            >
                <ModalHeader>{title}</ModalHeader>
                <ModalCloseButton />
                <ModalBody pb={6}>
                    <VStack spacing={4}>
                        <Button
                            leftIcon={<FaTwitter />}
                            colorScheme="twitter"
                            w="full"
                            onClick={() => handleShare('twitter')}
                        >
                            Chia sẻ qua Twitter
                        </Button>
                        <Button
                            leftIcon={<FaFacebook />}
                            colorScheme="facebook"
                            w="full"
                            onClick={() => handleShare('facebook')}
                        >
                            Chia sẻ qua Facebook
                        </Button>
                        <Button
                            leftIcon={<FaLink />}
                            colorScheme="gray"
                            w="full"
                            onClick={() => handleShare('copy')}
                        >
                            Sao chép đường dẫn
                        </Button>
                    </VStack>
                </ModalBody>
            </ModalContent>
        </Modal>
    );
}; 