import { useState, useEffect } from 'react'
import axios from 'axios'
interface Quote {
  quote: string
  author: string
}

const useQuote = () => {
  const lang = localStorage.getItem('i18nextLng') || 'cn_zh'
  const [quote, setQuote] = useState<Quote>({
    quote: "Life is like Shuijiao, every move counts.",
    author: "Anonymous"
  })
  const [isLoading, setIsLoading] = useState(true)
  // get lang from local storage  
  useEffect(() => {
    const fetchQuote = async () => {
      try {
        const response = await axios.get(
          `https://quotes-blond.vercel.app/api/quote?lang=${lang}`
        )
        setQuote(response.data)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to fetch quote', error)
        setIsLoading(false)
      }
    }

    fetchQuote()
  }, [lang])

  return { quote, isLoading }
}

export default useQuote 