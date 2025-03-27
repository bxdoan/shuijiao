import {
  VocabularyCategoryResponse,
  VocabularyResponse
} from '../types';

export const fetchVocabularyCategories = async (): Promise<VocabularyCategoryResponse> => {
    const response = await fetch('https://api.hanzii.net/api/category/premium', {
      headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
        'authorization': '37783281518601508919736764542798',
        'content-type': 'application/json',
        'origin': 'https://hanzii.net',
        'referer': 'https://hanzii.net/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
      }
    });
    return response.json();
};
  
export const fetchVocabularyItems = async (category: string, page: number = 1, limit: number = 10): Promise<VocabularyResponse> => {
    const response = await fetch(`https://api.hanzii.net/api/notebooks/premium/${category}?page=${page}&limit=${limit}`, {
        headers: {
        'accept': 'application/json, text/plain, */*',
        'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
        'authorization': '37783281518601508919736764542798',
        'content-type': 'application/json',
        'origin': 'https://hanzii.net',
        'referer': 'https://hanzii.net/',
        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
        }
    });
    return response.json();
};
  
export const fetchHSKVocabulary = async (level: string, page: number, limit: number) => {
    try {
        const response = await fetch(
        `https://api.hanzii.net/api/hsk/${level}?page=${page}&limit=${limit}&lang=vi&version=2`,
        {
            headers: {
            'accept': 'application/json, text/plain, */*',
            'accept-language': 'en-US,en;q=0.9,vi;q=0.8',
            'authorization': '37783281518601508919736764542798',
            'content-type': 'application/json',
            'origin': 'https://hanzii.net',
            'referer': 'https://hanzii.net/',
            'sec-ch-ua': '"Chromium";v="134", "Not:A-Brand";v="24", "Google Chrome";v="134"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'same-site',
            'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/134.0.0.0 Safari/537.36'
            }
        }
        );

        if (!response.ok) {
        throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return {
            result: data.data.map((item: any) => ({
                w: item.word,
                p: item.detail?.pinyin || '',
                m: item.detail?.content?.[0]?.means?.[0]?.mean || '',
                isLoading: false
            })),
            total: data.total
        };
    } catch (error) {
        console.error('Error fetching HSK vocabulary:', error);
        throw error;
    }
};
  
  