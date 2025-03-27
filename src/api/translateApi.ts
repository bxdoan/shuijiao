// API Constants
const GOOGLE_TRANSLATE_API = 'https://translate.googleapis.com/translate_a/single';
const API_CLIENT = 'gtx';

// Language codes
const LANG_CODES = {
  CHINESE: 'zh',
  VIETNAMESE: 'vi',
  ENGLISH: 'en',
  AUTO: 'auto'
} as const;

// API Parameters
const API_PARAMS = {
  TRANSLATE: 'dt=t',
  DICTIONARY: 'dt=bd',
  JSON: 'dj=1',
  PINYIN: 'dt=rm'
} as const;

// Unicode ranges for Chinese characters
const CHINESE_CHAR_RANGES = {
  BASIC: '\u4E00-\u9FFF',      // Basic CJK Unified Ideographs
  EXTENSION_A: '\u3400-\u4DBF', // CJK Unified Ideographs Extension A
  COMPATIBILITY: '\uF900-\uFAFF' // CJK Compatibility Ideographs
} as const;

// Helper function to check if text contains Chinese characters
const containsChineseCharacters = (text: string): boolean => {
  const chineseRegex = new RegExp(
    `[${CHINESE_CHAR_RANGES.BASIC}${CHINESE_CHAR_RANGES.EXTENSION_A}${CHINESE_CHAR_RANGES.COMPATIBILITY}]`
  );
  return chineseRegex.test(text);
};

// Helper function to build Google Translate URL
const buildTranslateUrl = (
  text: string,
  targetLang: string,
  sourceLang: string = LANG_CODES.AUTO,
  params: string[] = []
): string => {
  const baseParams = [
    `client=${API_CLIENT}`,
    `sl=${sourceLang}`,
    `tl=${targetLang}`,
    `q=${encodeURIComponent(text)}`,
    ...params
  ];
  
  return `${GOOGLE_TRANSLATE_API}?${baseParams.join('&')}`;
};

// Helper function to handle API response
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    throw new Error(`Google Translate error: ${response.status}`);
  }
  return await response.json();
};

// Helper function to extract translation from API response
const extractTranslation = (data: any): string => {
  if (!data.sentences) return '';
  
  return data.sentences
    .map((sentence: any) => sentence.trans || '')
    .join('');
};

// Helper function to extract pinyin from API response
const extractPinyin = (data: any): string => {
  // Try to get pinyin from data[0]
  if (data && Array.isArray(data[0])) {
    const pinyinParts = data[0]
      .filter((part: any) => part && part.length > 3 && part[3])
      .map((part: any) => part[3]);
      
    if (pinyinParts.length > 0) {
      return pinyinParts.join(' ');
    }
  }
  
  // Try to get pinyin from data[1]
  if (data && Array.isArray(data[1])) {
    return data[1].join(' ');
  }
  
  // Try to get pinyin from data[2]
  if (data && data[2] && typeof data[2] === 'string') {
    return data[2];
  }
  
  return '';
};

// Helper function to extract fallback translation
const extractFallbackTranslation = (data: any): string => {
  if (!data || !Array.isArray(data[0])) return '';
  
  return data[0]
    .filter((part: any) => part && part[0])
    .map((part: any) => part[0])
    .join('');
};

export const fetchGoogleTranslation = async (
  text: string,
  targetLang: string = LANG_CODES.VIETNAMESE,
  srcLang: string = LANG_CODES.AUTO
): Promise<string> => {
  try {
    const sourceLang = srcLang === LANG_CODES.AUTO
      ? (containsChineseCharacters(text) ? LANG_CODES.CHINESE : LANG_CODES.ENGLISH)
      : srcLang;
    
    const url = buildTranslateUrl(text, targetLang, sourceLang, [
      API_PARAMS.TRANSLATE,
      API_PARAMS.DICTIONARY,
      API_PARAMS.JSON
    ]);
    
    const data = await handleApiResponse(await fetch(url));
    return extractTranslation(data);
  } catch (error) {
    console.error('Google Translate API error:', error);
    throw error;
  }
};

/**
 * Lấy pinyin cho một đoạn văn bản tiếng Trung
 * Sử dụng Google Translate API để lấy thông tin phiên âm pinyin
 */
export const getChinesePinyin = async (text: string): Promise<string> => {
  try {
    if (!text?.trim()) return '';
    
    const url = buildTranslateUrl(text, LANG_CODES.VIETNAMESE, LANG_CODES.CHINESE, [
      API_PARAMS.TRANSLATE,
      API_PARAMS.PINYIN
    ]);
    
    const data = await handleApiResponse(await fetch(url));
    
    // Try to get pinyin first
    const pinyin = extractPinyin(data);
    if (pinyin) return pinyin;
    
    // If no pinyin found, try to get fallback translation
    const fallbackTranslation = extractFallbackTranslation(data);
    if (fallbackTranslation) {
      return `[Dịch: ${fallbackTranslation}]`;
    }
    
    console.log('Unexpected API response structure:', JSON.stringify(data));
    return 'Không có dữ liệu pinyin';
  } catch (error) {
    console.error('Lỗi khi lấy pinyin:', error);
    return 'Lỗi khi lấy pinyin';
  }
};
  