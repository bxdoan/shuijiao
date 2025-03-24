
// Helper function to check if text contains Chinese characters
function containsChineseCharacters(text: string): boolean {
    // Unicode range for Han characters
    const chineseRegex = /[\u4E00-\u9FFF\u3400-\u4DBF\uF900-\uFAFF]/;
    return chineseRegex.test(text);
}

export const fetchGoogleTranslation = async (text: string, targetLang: string = 'vi', srcLang: string = 'auto') => {
    try {
      // Determine source language based on content
      // By default, it will auto-detect the source language
      const sourceLang = srcLang === 'auto' ? (containsChineseCharacters(text) ? 'zh' : 'en') : srcLang;
      
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=bd&dj=1&sl=${sourceLang}&tl=${targetLang}&q=${encodeURIComponent(text)}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Translate error: ${response.status}`);
      }
  
      const data = await response.json();
      
      // Process complex results from Google
      let translatedText = '';
      
      // Iterate through elements in the sentences array
      if (data.sentences) {
        for (const sentence of data.sentences) {
          if (sentence.trans) {
            translatedText += sentence.trans;
          }
        }
      }
      
      return translatedText;
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
      if (!text || !text.trim()) return '';
      
      // Sử dụng cả hai tham số dt=rm (cho pinyin) và dt=t (cho bản dịch)
      const response = await fetch(
        `https://translate.googleapis.com/translate_a/single?client=gtx&dt=t&dt=rm&sl=zh&tl=vi&q=${encodeURIComponent(text)}`
      );
      
      if (!response.ok) {
        throw new Error(`Google Translate error: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Dữ liệu phản hồi từ Google API có cấu trúc phức tạp
      // Xử lý trường hợp chứa dữ liệu trong data[0]
      if (data && Array.isArray(data[0])) {
        const pinyinParts = [];
        
        // Duyệt qua các phần tử và trích xuất phiên âm
        for (let i = 0; i < data[0].length; i++) {
          const translatePart = data[0][i];
          
          // Nếu phần này chứa phiên âm trong phần tử thứ 4
          if (translatePart && translatePart.length > 3 && translatePart[3]) {
            pinyinParts.push(translatePart[3]);
          }
        }
        
        if (pinyinParts.length > 0) {
          return pinyinParts.join(' ');
        }
      }
      
      // Thử kiểm tra dữ liệu trong data[1] (định dạng pinyin riêng)
      if (data && Array.isArray(data[1])) {
        return data[1].join(' ');
      }
      
      // Thử kiểm tra dữ liệu trong data[2] (một số phiên bản API trả về pinyin ở đây)
      if (data && data[2] && typeof data[2] === 'string') {
        return data[2];
      }
      
      // Nếu không tìm thấy pinyin, trả về bản dịch tiếng Việt như một giải pháp thay thế
      if (data && Array.isArray(data[0])) {
        let translation = '';
        
        // Duyệt qua từng phần và trích xuất văn bản dịch
        for (const part of data[0]) {
          if (part && part[0]) {
            translation += part[0];
          }
        }
        
        if (translation) {
          return `[Dịch: ${translation}]`;
        }
      }
      
      console.log('Cấu trúc API không như mong đợi:', JSON.stringify(data));
      return 'Không có dữ liệu pinyin';
    } catch (error: any) {
      console.error('Lỗi khi lấy pinyin:', error);
      console.error(error.toString());
      return 'Lỗi khi lấy pinyin';
    }
};
  