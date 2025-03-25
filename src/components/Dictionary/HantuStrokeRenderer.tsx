// @ts-nocheck
import React, { useState, useEffect } from 'react';
import {
  Box,
  Text,
  IconButton,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

interface HantuStrokeRendererProps {
  strokesData: string;
  strokesKey: number;
}

const HantuStrokeRenderer: React.FC<HantuStrokeRendererProps> = ({ strokesData, strokesKey }) => {
  // State to manage stroke display
  const [visibleStrokes, setVisibleStrokes] = useState<number>(0);
  // State variable to store different types of strokes
  const [strokes, setStrokes] = useState<string[]>([]);
  const [medians, setMedians] = useState<string[]>([]);
  const [currentStrokeIndex, setCurrentStrokeIndex] = useState<number>(-1);
  
  // Parse stroke data when strokesData changes
  useEffect(() => {
    if (!strokesData) return;
    
    try {
      // Parse the strokesData
      const data = JSON.parse(strokesData);
      
      // Process medians for animation path
      if (data.medians && Array.isArray(data.medians)) {
        const parsedMedians = data.medians.map((median: number[][]) => {
          return median.reduce((path: string, point: number[], index: number) => {
            const [x, y] = point;
            return `${path}${index === 0 ? 'M' : 'L'} ${x} ${y} `;
          }, '');
        });
        setMedians(parsedMedians);
      }

      // Process strokes for final shape
      if (data.strokes && Array.isArray(data.strokes)) {
        setStrokes(data.strokes);
      } else if (Array.isArray(data)) {
        setStrokes(data);
      }
      
    } catch (error) {
      console.error('Error parsing strokes data:', error);
      
      // Fallback for string format
      try {
        let cleanData = strokesData;
        if (cleanData.includes('strokes:')) {
          cleanData = cleanData.split('strokes:')[1].trim();
        }
        
        const pathsArray: string[] = [];
        let currentPath = '';
        
        const parts = cleanData.split(',');
        
        for (let i = 0; i < parts.length; i++) {
          const part = parts[i].trim();
          if (part.startsWith('M ')) {
            if (currentPath) {
              pathsArray.push(currentPath);
            }
            currentPath = part;
          } else if (currentPath) {
            currentPath += ', ' + part;
          }
        }
        
        if (currentPath) {
          pathsArray.push(currentPath);
        }
        
        if (pathsArray.length > 0) {
          setStrokes(pathsArray);
        }
      } catch (innerError) {
        console.error('Error parsing string format:', innerError);
        setStrokes([]);
      }
    }
  }, [strokesData]);
  
  // Effect to display each stroke when strokesKey changes
  useEffect(() => {
    if (!strokesData || (strokes.length === 0 && medians.length === 0)) return;
    
    setVisibleStrokes(0);
    setCurrentStrokeIndex(-1);
    
    const totalStrokes = Math.max(strokes.length, medians.length);
    let strokeIndex = 0;
    
    const intervalId = setInterval(() => {
      setVisibleStrokes((prev: number) => {
        strokeIndex = prev + 1;
        if (strokeIndex >= totalStrokes) {
          clearInterval(intervalId);
        }
        return strokeIndex;
      });
    }, 700); // Increased delay between strokes
    
    return () => clearInterval(intervalId);
  }, [strokesKey, strokesData, strokes, medians]);

  // Effect to handle animation of current stroke
  useEffect(() => {
    if (currentStrokeIndex >= 0) {
      const timer = setTimeout(() => {
        setCurrentStrokeIndex(-1);
      }, 700); // Duration of median animation
      
      return () => clearTimeout(timer);
    }
  }, [currentStrokeIndex]);
  
  if (!strokesData || (strokes.length === 0 && medians.length === 0)) return null;
  
  const keyframes = `
    @keyframes drawStroke {
      0% {
        stroke-dasharray: 700;
        stroke-dashoffset: 700;
      }
      100% {
        stroke-dasharray: 700;
        stroke-dashoffset: 0;
      }
    }
  `;
  
  const totalStrokes = Math.max(strokes.length, medians.length);
  
  return (
    <Box width="100%" display="flex" flexDirection="column" alignItems="center" my={4}>
      <Box position="relative" width="200px" height="200px">
        <IconButton
          aria-label="Vẽ lại hán tự"
          icon={<RepeatIcon />}
          size="sm"
          colorScheme="blue"
          variant="ghost"
          position="absolute"
          top="0"
          right="0"
          zIndex="1"
          onClick={() => window.location.reload()}
        />
        <style dangerouslySetInnerHTML={{ __html: keyframes }} />
        <svg 
          viewBox="0 0 1024 1024" 
          width="200" 
          height="200"
        >
          <defs>
            <filter id="blur">
              <feGaussianBlur in="SourceGraphic" stdDeviation="1" />
            </filter>
          </defs>
          <g transform="scale(1, -1) translate(0, -900)">
            {/* Render completed strokes */}
            {strokes.slice(0, visibleStrokes).map((path, index) => (
              <path
                key={`stroke-${index}`}
                d={path}
                fill="black"
                stroke="none"
                strokeWidth="0"
                opacity="1"
              />
            ))}
            
            {/* Render current animating median */}
            {currentStrokeIndex >= 0 && medians[currentStrokeIndex] && (
              <path
                key={`median-current`}
                d={medians[currentStrokeIndex]}
                fill="none"
                stroke="black"
                strokeWidth="30"
                strokeLinecap="round"
                strokeLinejoin="round"
                opacity="0.8"
                style={{
                  animation: `drawStroke 1.2s ease forwards`,
                }}
              />
            )}
          </g>
        </svg>
      </Box>
      <Text fontSize="sm" color="gray.600" mt={2}>
        {`${visibleStrokes}/${totalStrokes} nét`}
      </Text>
    </Box>
  );
};

export default HantuStrokeRenderer; 