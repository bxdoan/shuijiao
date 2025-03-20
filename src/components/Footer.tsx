import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  
  // Theo dõi thay đổi kích thước màn hình
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  const styles = {
    footer: {
      background: 'linear-gradient(to right, #991b1b, #b91c1c, #ca8a04)',
      color: 'white',
      padding: '1.5rem 0',
      marginTop: '2rem',
      boxShadow: '0 -4px 12px rgba(0, 0, 0, 0.2)'
    },
    container: {
      display: 'flex',
      flexWrap: 'wrap' as const,
      justifyContent: 'space-between',
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '0 2rem',
      gap: '1.5rem'
    },
    section: {
      flex: '1 1 0',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start'
    },
    sectionMiddle: {
      flex: '1 1 0',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      paddingLeft: '1rem',
      paddingRight: '1rem'
    },
    sectionRight: {
      flex: '1 1 0',
      minWidth: '200px',
      display: 'flex',
      flexDirection: 'column' as const,
      alignItems: 'flex-start',
      paddingRight: '2rem'
    },
    brand: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '0.5rem'
    },
    logo: {
      width: '32px',
      height: '32px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: '0.5rem',
      transition: 'all 0.3s',
      overflow: 'hidden'
    },
    logoImage: {
      width: '100%',
      height: '100%',
      objectFit: 'cover' as const
    },
    brandText: {
      fontSize: '1.1rem',
      fontWeight: 'bold',
      color: '#facc15',
      margin: 0
    },
    normalText: {
      color: '#fef9c3',
      margin: '0.3rem 0',
      fontSize: '0.9rem'
    },
    title: {
      color: '#facc15',
      fontSize: '1.1rem',
      fontWeight: 'bold',
      marginBottom: '0.5rem',
      margin: '0 0 0.5rem 0'
    },
    contactInfo: {
      marginTop: '0.5rem'
    },
    contactItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#fef9c3',
      margin: '0.3rem 0'
    },
    contactLink: {
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      color: '#fef9c3',
      margin: '0.3rem 0',
      textDecoration: 'none',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    navLink: {
      color: '#fef9c3',
      textDecoration: 'none',
      margin: '0.3rem 0',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      transition: 'color 0.2s ease',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    icon: {
      color: '#facc15',
      width: '16px',
      height: '16px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    socialIcons: {
      display: 'flex',
      gap: '0.8rem',
      marginTop: '0.5rem'
    },
    socialButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '32px',
      height: '32px',
      borderRadius: '4px',
      border: '1px solid #facc15',
      color: '#facc15',
      textDecoration: 'none',
      fontSize: '0.9rem',
      fontWeight: 'bold',
      transition: 'all 0.3s'
    },
    socialIcon: {
      width: '16px',
      height: '16px',
      fill: 'currentColor'
    },
    divider: {
      borderTop: '1px solid rgba(236, 201, 75, 0.3)',
      margin: '1rem 0'
    },
    footer_bottom: {
      textAlign: 'center' as const
    },
    mediaIcons: {
      display: 'flex',
      flexDirection: 'column' as const,
      gap: '0.3rem'
    }
  };

  // Styles dành riêng cho mobile
  const mobileStyles = {
    container: {
      flexDirection: 'column' as const,
      alignItems: 'center',
      padding: '0 1rem',
      gap: '1rem'
    },
    section: {
      width: '100%',
      alignItems: 'center',
      textAlign: 'center' as const,
      padding: '0',
      minWidth: 'unset'
    },
    brand: {
      justifyContent: 'center'
    },
    contactLink: {
      justifyContent: 'center'
    },
    navLink: {
      justifyContent: 'center'
    },
    socialIcons: {
      justifyContent: 'center'
    }
  };

  return (
    <footer style={styles.footer}>
      <div style={isMobile ? {...styles.container, ...mobileStyles.container} : styles.container}>
        <div style={isMobile ? {...styles.section, ...mobileStyles.section} : styles.section}>
          <div style={isMobile ? {...styles.brand, ...mobileStyles.brand} : styles.brand}>
            <div 
              style={styles.logo}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'scale(1.1)';
                e.currentTarget.style.boxShadow = '0 0 0 2px #ef4444, 0 0 10px #facc15';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = '';
                e.currentTarget.style.boxShadow = '0 0 0 2px #ecc94b';
              }}
            >
              <img 
                src={process.env.PUBLIC_URL + '/shuijiao.png'}
                alt="Shuijiao Logo" 
                style={styles.logoImage}
              />
            </div>
            <h3 style={styles.brandText}>Shuijiao</h3>
          </div>
          <p style={styles.normalText}>Learn languages with real-world news articles</p>
          <div style={styles.contactInfo}>
            <a 
              href="mailto:contact@shuijiao.vn" 
              style={isMobile ? {...styles.contactLink, ...mobileStyles.contactLink} : styles.contactLink}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#facc15';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#fef9c3';
              }}
            >
              <span style={styles.icon}>
                <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                  <path d="M20 4H4C2.9 4 2.01 4.9 2.01 6L2 18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4ZM20 8L12 13L4 8V6L12 11L20 6V8Z" />
                </svg>
              </span>
              <span>contact@shuijiao.vn</span>
            </a>
            <a 
              href="tel:+84904195065" 
              style={isMobile ? {...styles.contactLink, ...mobileStyles.contactLink} : styles.contactLink}
              onMouseOver={(e) => {
                e.currentTarget.style.color = '#facc15';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.color = '#fef9c3';
              }}
            >
              <span style={styles.icon}>
                <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                  <path d="M6.62 10.79C8.06 13.62 10.38 15.94 13.21 17.38L15.41 15.18C15.69 14.9 16.08 14.82 16.43 14.93C17.55 15.3 18.75 15.5 20 15.5C20.55 15.5 21 15.95 21 16.5V20C21 20.55 20.55 21 20 21C10.61 21 3 13.39 3 4C3 3.45 3.45 3 4 3H7.5C8.05 3 8.5 3.45 8.5 4C8.5 5.25 8.7 6.45 9.07 7.57C9.18 7.92 9.1 8.31 8.82 8.59L6.62 10.79Z" />
                </svg>
              </span>
              <span>+84 904 195 065</span>
            </a>
          </div>
        </div>
        
        <div style={isMobile ? {...styles.sectionMiddle, ...mobileStyles.section} : styles.sectionMiddle}>
          <h3 style={styles.title}>Thông tin</h3>
          <Link 
            to="/about" 
            style={isMobile ? {...styles.navLink, ...mobileStyles.navLink} : styles.navLink}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#facc15';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#fef9c3';
            }}
          >
            <span style={styles.icon}>
              <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V11H13V17ZM13 9H11V7H13V9Z" />
              </svg>
            </span>
            <span>Giới thiệu</span>
          </Link>
          <Link 
            to="/contact" 
            style={isMobile ? {...styles.navLink, ...mobileStyles.navLink} : styles.navLink}
            onMouseOver={(e) => {
              e.currentTarget.style.color = '#facc15';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#fef9c3';
            }}
          >
            <span style={styles.icon}>
              <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                <path d="M21 8V7L18 9L15 7V8L18 10L21 8ZM22 3H2C0.9 3 0 3.9 0 5V19C0 20.1 0.9 21 2 21H22C23.1 21 24 20.1 24 19V5C24 3.9 23.1 3 22 3ZM8 6C9.66 6 11 7.34 11 9C11 10.66 9.66 12 8 12C6.34 12 5 10.66 5 9C5 7.34 6.34 6 8 6ZM14 18H2V17C2 15 6 13.9 8 13.9C10 13.9 14 15 14 17V18ZM22 12H14V6H22V12Z" />
              </svg>
            </span>
            <span>Liên hệ</span>
          </Link>
        </div>
        
        <div style={isMobile ? {...styles.sectionRight, ...mobileStyles.section} : styles.sectionRight}>
          <h3 style={styles.title}>Follow Us</h3>
          <div style={isMobile ? {...styles.socialIcons, ...mobileStyles.socialIcons} : styles.socialIcons}>
            <a 
              href="https://www.facebook.com/shuijiaochinese" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Facebook"
              style={styles.socialButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(236, 201, 75, 0.15)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                <path d="M22 12C22 6.48 17.52 2 12 2C6.48 2 2 6.48 2 12C2 16.84 5.44 20.87 10 21.8V15H8V12H10V9.5C10 7.57 11.57 6 13.5 6H16V9H14C13.45 9 13 9.45 13 10V12H16V15H13V21.95C18.05 21.45 22 17.19 22 12Z" />
              </svg>
            </a>
            <a 
              href="https://www.instagram.com/shuijiaochinese" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="Instagram"
              style={styles.socialButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(236, 201, 75, 0.15)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
            </a>
            <a 
              href="https://github.com/bxdoan" 
              target="_blank" 
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={styles.socialButton}
              onMouseOver={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(236, 201, 75, 0.15)';
                e.currentTarget.style.transform = 'scale(1.1)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.backgroundColor = '';
                e.currentTarget.style.transform = '';
              }}
            >
              <svg viewBox="0 0 24 24" style={styles.socialIcon}>
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
      
      <div style={styles.divider}></div>
      
      <div style={styles.footer_bottom}>
        <p style={styles.normalText}>© {currentYear} Shuijiao Chinese. All rights reserved.</p>
      </div>
    </footer>
  );
};
