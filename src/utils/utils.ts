export const getTypeColor = (type: string) => {
  switch (type?.toLowerCase()) {
    case 'easy':
      return 'green';
    case 'medium':
      return 'orange';
    case 'hard':
      return 'red';
    default:
      return 'gray';
  }
};

export const getVietnameseType = (type: string) => {
  switch (type.toLowerCase()) {
    case 'easy':
      return 'DỄ';
    case 'medium':
      return 'TRUNG BÌNH';
    case 'hard':
      return 'KHÓ';
    default:
      return type.toUpperCase();
  }
};

export const getSource = (source: string) => {
  switch (source.toLowerCase()) {
    case 'todaii':
      return 'SHUIJIAO';
    case 'todai':
      return 'SHUIJIAO';
    default:
      return source;
  }
};

export const splitTextIntoSentences = (text: string, sourceLang: string) => {
  // Trích xuất văn bản thuần túy từ HTML
  const stripHtmlTags = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };

  let plainText = '';
  
  if ( sourceLang === "en" ) {
    // Nội dung tiếng Anh - chỉ cần loại bỏ thẻ HTML
    plainText = stripHtmlTags(text);
    // Loại bỏ khoảng trắng thừa
    plainText = plainText.replace(/\s+/g, ' ').trim();
    
    // Chia thành các câu dựa trên dấu câu
    const sentences = [];
    const sentenceParts = plainText.split(/([.!?])/);
    
    // Ghép lại thành câu hoàn chỉnh với dấu câu
    for (let i = 0; i < sentenceParts.length - 1; i += 2) {
      const sentence = (sentenceParts[i] + (sentenceParts[i+1] || '')).trim();
      if (sentence) sentences.push(sentence);
    }
    
    // Nếu còn phần dư, thêm vào
    if (sentenceParts.length % 2 === 1) {
      const lastPart = sentenceParts[sentenceParts.length - 1].trim();
      if (lastPart) sentences.push(lastPart);
    }
    
    // Nếu không tách được câu nào, trả về toàn bộ văn bản
    if (sentences.length === 0 && plainText.trim()) {
      sentences.push(plainText.trim());
    }
    
    return sentences;
  } else {
    // Xử lý tiếng Trung (giữ nguyên code cũ)
    // Loại bỏ tất cả thẻ HTML và chỉ lấy nội dung văn bản
    plainText = stripHtmlTags(text);
    
    // Loại bỏ pinyin (nằm trong cặp ngoặc tròn sau các ký tự Hán)
    // Ví dụ: 你好(nǐ hǎo) -> 你好
    plainText = plainText.replace(/\([^)]*\)/g, '');
    
    // Loại bỏ các ghi chú <rt> (thường chứa pinyin)
    plainText = plainText.replace(/\s*<rt>[^<]*<\/rt>\s*/g, '');
    
    // Loại bỏ các khoảng trắng thừa
    plainText = plainText.replace(/\s+/g, ' ').trim();
    
    // Chỉ giữ lại chữ Hán và một số ký tự đặc biệt
    // Phạm vi unicode của chữ Hán: 
    // CJK Unified Ideographs: 4E00-9FFF
    // CJK Unified Ideographs Extension A: 3400-4DBF
    // CJK Unified Ideographs Extension B: 20000-2A6DF
    // CJK Unified Ideographs Extension C: 2A700-2B73F
    // CJK Unified Ideographs Extension D: 2B740-2B81F
    // CJK Unified Ideographs Extension E: 2B820-2CEAF
    // CJK Unified Ideographs Extension F: 2CEB0-2EBEF
    // CJK Compatibility Ideographs: F900-FAFF
    
    // Lọc để chỉ giữ lại chữ Hán và dấu câu cần thiết
    let chineseOnly = '';
    for (let i = 0; i < plainText.length; i++) {
      const charCode = plainText.charCodeAt(i);
      
      // Kiểm tra xem ký tự có phải là chữ Hán
      const isChineseChar = 
        (charCode >= 0x4E00 && charCode <= 0x9FFF) || // CJK Unified Ideographs
        (charCode >= 0x3400 && charCode <= 0x4DBF) || // Extension A
        (charCode >= 0xF900 && charCode <= 0xFAFF) || // Compatibility Ideographs
        // Giữ lại các dấu câu quan trọng
        [0x3002, 0xFF01, 0xFF1F, 0x3001, 0xFF0C, 0x3001, 0xFF1B, 0xFF1A, 0x300C, 0x300D, 0x300E, 0x300F, 0x2018, 0x2019, 0x201C, 0x201D].includes(charCode);
      
      if (isChineseChar) {
        chineseOnly += plainText[i];
      } else if (['.', '!', '?', '。', '！', '？'].includes(plainText[i])) {
        // Giữ lại các dấu câu phổ biến để phân chia câu
        chineseOnly += plainText[i];
      } else if (plainText[i] === ' ' && chineseOnly.length > 0 && chineseOnly[chineseOnly.length - 1] !== ' ') {
        // Giữ một khoảng trắng duy nhất giữa các từ (nếu cần)
        chineseOnly += ' ';
      }
    }
    
    // Chia văn bản thành các câu
    const sentences: string[] = [];
    let currentSentence = '';
    
    for (let i = 0; i < chineseOnly.length; i++) {
      currentSentence += chineseOnly[i];
      
      // Kiểm tra nếu đây là dấu kết thúc câu và ký tự tiếp theo là khoảng trắng hoặc hết chuỗi
      if (
        ['.', '!', '?', '。', '！', '？'].includes(chineseOnly[i]) && 
        (i === chineseOnly.length - 1 || chineseOnly[i + 1] === ' ')
      ) {
        sentences.push(currentSentence.trim());
        currentSentence = '';
      }
    }
    
    // Thêm phần cuối nếu còn
    if (currentSentence.trim()) {
      sentences.push(currentSentence.trim());
    }
    
    // Nếu không có câu nào được chia, trả về toàn bộ văn bản như một câu duy nhất
    if (sentences.length === 0 && chineseOnly.trim()) {
      sentences.push(chineseOnly.trim());
    }
    
    return sentences;
  }
};
