const express = require('express');
const axios = require('axios');
const cors = require('cors');
const path = require('path');
const app = express();

// Cấu hình CORS để cho phép truy cập từ front-end
app.use(cors());

// Parse JSON body
app.use(express.json());

// Các headers cần thiết cho API gọi đến easyChinese
const EASYCHINESE_HEADERS = {
  'accept': 'application/json, text/plain, */*',
  'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
  'authorization': 'qidKNYDRnnbXYyUNnXKiYvRrJveH4CCS',
  'content-type': 'application/json',
  'dnt': '1',
  'origin': 'https://easychinese.io',
  'priority': 'u=1, i',
  'referer': 'https://easychinese.io/',
  'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
  'sec-ch-ua-mobile': '?0',
  'sec-ch-ua-platform': '"Windows"',
  'sec-fetch-dest': 'empty',
  'sec-fetch-mode': 'cors',
  'sec-fetch-site': 'same-site',
  'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
};

// API route cho việc dịch
app.get('/api/translate', async (req, res) => {
  try {
    const { news_id, lang } = req.query;
    
    if (!news_id || !lang) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    console.log(`Proxying translation request for news_id: ${news_id}, lang: ${lang}`);
    
    const response = await axios.get(
      `https://api.easychinese.io/api/translate?news_id=${news_id}&lang=${lang}`,
      { headers: EASYCHINESE_HEADERS }
    );
    
    // Thêm debug log
    console.log(`Received response from easyChinese API: ${response.status}`);
    
    // Cache control
    res.set('Cache-Control', 'public, max-age=300'); // Cache for 5 minutes
    
    return res.json(response.data);
  } catch (error) {
    console.error('Proxy error:', error.message);
    
    // Log chi tiết lỗi
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
    
    return res.status(500).json({ 
      error: 'Error fetching translation', 
      message: error.message 
    });
  }
});

// Cache-based implementation
const translationCache = new Map();

app.get('/api/cached-translate', async (req, res) => {
  const { news_id, lang } = req.query;
  const cacheKey = `${news_id}:${lang}`;
  
  // Check cache first
  if (translationCache.has(cacheKey)) {
    console.log(`Cache hit for: ${cacheKey}`);
    return res.json(translationCache.get(cacheKey));
  }
  
  try {
    const response = await axios.get(
      `https://api.easychinese.io/api/translate?news_id=${news_id}&lang=${lang}`,
      { headers: EASYCHINESE_HEADERS }
    );
    
    // Store in cache
    translationCache.set(cacheKey, response.data);
    console.log(`Cached translation for: ${cacheKey}`);
    
    return res.json(response.data);
  } catch (error) {
    console.error('Cache proxy error:', error.message);
    return res.status(500).json({ error: 'Error fetching translation' });
  }
});

// Serve static assets in production
if (process.env.NODE_ENV === 'production') {
  // Serve static files from the React app
  app.use(express.static(path.join(__dirname, '../build')));

  // The "catchall" handler: for any request that doesn't
  // match one above, send back React's index.html file.
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../build/index.html'));
  });
}

// Định nghĩa port - sử dụng PORT từ environment hoặc 3001 làm default
const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`API Proxy available at: http://localhost:${PORT}/api/translate`);
}); 