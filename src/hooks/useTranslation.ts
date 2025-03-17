import { useState, useCallback } from 'react';
import { translateText, translateBatch, isTranslationConfigured } from '../services/easyChineseTranslationService';

interface UseTranslationReturn {
  translate: (text: string) => Promise<string>;
  translateMultiple: (texts: string[]) => Promise<string[]>;
  isLoading: boolean;
  error: Error | null;
  isConfigured: boolean;
}

/**
 * Hook để sử dụng dịch vụ dịch thuật
 * @returns Các hàm và trạng thái liên quan đến dịch thuật
 */
export const useTranslation = (): UseTranslationReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  
  // Kiểm tra xem API key đã được cấu hình chưa
  const isConfigured = isTranslationConfigured();

  /**
   * Dịch một đoạn văn bản
   * @param text Văn bản cần dịch
   * @returns Văn bản đã được dịch
   */
  const translate = useCallback(async (text: string): Promise<string> => {
    if (!isConfigured) {
      console.warn('Translation API is not configured');
      return `[Cần cấu hình API] ${text}`;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const translatedText = await translateText(text);
      return translatedText;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown translation error');
      setError(error);
      return text;
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  /**
   * Dịch nhiều đoạn văn bản cùng lúc
   * @param texts Mảng các văn bản cần dịch
   * @returns Mảng các văn bản đã được dịch
   */
  const translateMultiple = useCallback(async (texts: string[]): Promise<string[]> => {
    if (!isConfigured) {
      console.warn('Translation API is not configured');
      return texts.map(text => `[Cần cấu hình API] ${text}`);
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const translatedTexts = await translateBatch(texts);
      return translatedTexts;
    } catch (err) {
      const error = err instanceof Error ? err : new Error('Unknown batch translation error');
      setError(error);
      return texts;
    } finally {
      setIsLoading(false);
    }
  }, [isConfigured]);

  return {
    translate,
    translateMultiple,
    isLoading,
    error,
    isConfigured
  };
}; 