import React from 'react';
import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogUrl?: string;
  ogType?: string;
  canonicalUrl?: string;
  lang?: string;
}

const SEO: React.FC<SEOProps> = ({
  title = 'Shuijiao - Học đa ngôn ngữ qua đọc tin tức thực tế',
  description = 'Nền tảng học đa ngôn ngữ thông qua đọc tin tức thực tế hàng ngày với bản dịch tiếng Việt. Hỗ trợ tiếng Anh, Trung, Hàn, Pháp, Đức và nhiều ngôn ngữ khác.',
  keywords = 'học ngoại ngữ, học đa ngôn ngữ, học qua tin tức, shuijiao, tin tức tiếng anh, tin tức tiếng trung, học tiếng trung, học tiếng anh, tin tức đa ngôn ngữ',
  ogImage = '/logo.png',
  ogUrl = window.location.href,
  ogType = 'website',
  canonicalUrl = window.location.href,
  lang = 'vi'
}) => {
  const siteName = 'Shuijiao';
  
  return (
    <Helmet>
      {/* Thẻ tiêu đề cơ bản */}
      <title>{title}</title>
      <html lang={lang} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
      {/* Canonical Link */}
      <link rel="canonical" href={canonicalUrl} />
      
      {/* Open Graph Tags */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content={siteName} />
      
      {/* Twitter Card Tags */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
      
      {/* Các thẻ bổ sung khác */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="robots" content="index, follow" />
    </Helmet>
  );
};

export default SEO; 