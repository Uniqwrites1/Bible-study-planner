'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { X, BookOpen, Loader2, Plus, Minus, ChevronUp } from 'lucide-react';
import { BiblePassage, BibleVerse } from '@/types/bibleApi';
import { workingBibleApi } from '@/services/workingBibleApi';
import SimpleBibleVersionSelector from './SimpleBibleVersionSelector';

interface BibleReadingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookName: string;
  chapters?: number[];
  verses?: string;
  sectionName: string;
}

export default function BibleReadingModal({
  isOpen,
  onClose,
  bookName,
  chapters,
  verses,
  sectionName
}: BibleReadingModalProps) {  const [bibleContent, setBibleContent] = useState<BiblePassage | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('kjv'); // Default to working version
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(16); // Font size in pixels
    // Dynamic header state
  const [headerVisible, setHeaderVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showFloatingControls, setShowFloatingControls] = useState(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Font size options
  const fontSizeOptions = [
    { size: 12, label: 'Very Small' },
    { size: 14, label: 'Small' },
    { size: 16, label: 'Normal' },
    { size: 18, label: 'Large' },
    { size: 20, label: 'Very Large' },
    { size: 24, label: 'Extra Large' }
  ];

  const increaseFontSize = () => {
    const currentIndex = fontSizeOptions.findIndex(option => option.size === fontSize);
    if (currentIndex < fontSizeOptions.length - 1) {
      setFontSize(fontSizeOptions[currentIndex + 1].size);
    }
  };
  const decreaseFontSize = () => {
    const currentIndex = fontSizeOptions.findIndex(option => option.size === fontSize);
    if (currentIndex > 0) {
      setFontSize(fontSizeOptions[currentIndex - 1].size);
    }
  };
  // Handle scroll for dynamic header
  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;
      
      const currentScrollY = scrollContainerRef.current.scrollTop;
      const scrollDirection = currentScrollY > lastScrollY ? 'down' : 'up';
      
      // Show header when scrolling up or at the top
      // Hide header when scrolling down and not at the top
      if (currentScrollY <= 10) {
        setHeaderVisible(true);
        setShowFloatingControls(false);
      } else if (scrollDirection === 'down' && currentScrollY > lastScrollY + 5) {
        setHeaderVisible(false);
        setShowFloatingControls(true);
      } else if (scrollDirection === 'up' && lastScrollY > currentScrollY + 5) {
        setHeaderVisible(true);
        setShowFloatingControls(false);
      }
      
      setLastScrollY(currentScrollY);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener('scroll', handleScroll, { passive: true });
      return () => scrollContainer.removeEventListener('scroll', handleScroll);
    }
  }, [lastScrollY]);

  // Reset header visibility when modal opens
  useEffect(() => {
    if (isOpen) {
      setHeaderVisible(true);
      setShowFloatingControls(false);
      setLastScrollY(0);
    }
  }, [isOpen]);const loadBibleContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let content: BiblePassage | null = null;
        if (chapters && chapters.length > 1) {
        // For multiple chapters, request each chapter individually and combine
        console.log(`Loading multiple chapters: ${chapters.join(', ')} for ${bookName}`);
        const allVerses: BibleVerse[] = [];
        let combinedText = '';
        
        for (const chapter of chapters) {
          const reference = `${bookName} ${chapter}`;
          const chapterContent = await workingBibleApi.getPassage(reference, selectedVersion);
          
          if (chapterContent && chapterContent.verses) {
            allVerses.push(...chapterContent.verses);
            if (combinedText) combinedText += '\n\n';
            combinedText += chapterContent.text;
          }
        }
          if (allVerses.length > 0) {
          content = {
            reference: `${bookName} ${chapters[0]}-${chapters[chapters.length - 1]}`,
            verses: allVerses,
            text: combinedText,
            translation_id: selectedVersion.toUpperCase(),
            translation_name: selectedVersion.toUpperCase(),
            translation_note: `Combined chapters ${chapters.join(', ')}`
          };
        }
      } else {
        // Single chapter or verses - use original logic
        let reference = bookName;
        if (chapters && chapters.length === 1) {
          reference = `${bookName} ${chapters[0]}`;
        } else if (verses) {
          reference = `${bookName} ${verses}`;
        }
        
        content = await workingBibleApi.getPassage(reference, selectedVersion);
      }
      
      if (content) {
        setBibleContent(content);
      } else {
        setError('Unable to load Bible text. Please try again.');
      }
    } catch (err) {
      console.error('Error loading Bible content:', err);
      setError('Failed to load Bible text. Please check your connection and try again.');
    } finally {
      setIsLoading(false);
    }
  }, [bookName, chapters, verses, selectedVersion]);  useEffect(() => {
    if (isOpen && bookName) {
      loadBibleContent();
    }
  }, [isOpen, bookName, loadBibleContent]);

  const getReadingReference = () => {
    if (chapters && chapters.length > 0) {
      if (chapters.length === 1) {
        return `${bookName} ${chapters[0]}`;
      } else {
        return `${bookName} ${chapters[0]}-${chapters[chapters.length - 1]}`;
      }
    } else if (verses) {
      return `${bookName} ${verses}`;
    }
    return bookName;
  };  const renderBibleContent = () => {
    if (isLoading) {
      return (
        <div className="flex items-center justify-center py-16 sm:py-20">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 dark:text-blue-400" />
          <span 
            className="ml-3 text-gray-600 dark:text-gray-400"
            style={{ fontSize: `${fontSize}px` }}
          >
            Loading Bible text...
          </span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 sm:py-20">
          <div 
            className="text-red-600 dark:text-red-400 mb-6 px-4"
            style={{ fontSize: `${fontSize}px` }}
          >
            {error}
          </div>
          <button
            onClick={loadBibleContent}
            className="px-6 py-3 bg-blue-600 dark:bg-blue-700 text-white rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors text-base font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!bibleContent) {
      return (
        <div 
          className="text-center py-16 sm:py-20 text-gray-600 dark:text-gray-400"
          style={{ fontSize: `${fontSize}px` }}
        >
          No content available
        </div>
      );
    }

    // Handle BiblePassage format (from bible-api.com)
    return (
      <div className="space-y-4 max-w-none">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white border-b-2 border-blue-200 dark:border-blue-700 pb-3 transition-colors">
            {bibleContent.reference}
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {bibleContent.verses.map((verse, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
              <span 
                className="text-sm font-medium text-blue-600 dark:text-blue-400 min-w-[3rem] flex-shrink-0 sm:text-right"
                style={{ fontSize: `${Math.max(12, fontSize - 2)}px` }}
              >
                {verse.verse}
              </span>
              <span 
                className="text-gray-900 dark:text-gray-100 leading-relaxed flex-1 font-medium"
                style={{ fontSize: `${fontSize}px`, lineHeight: '1.6' }}
              >
                {verse.text}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 transition-colors" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>        {/* Modal - Responsive sizing for mobile, tablet, and desktop */}
        <div className="relative z-10 bg-white dark:bg-gray-900 rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl flex flex-col border dark:border-gray-700">
          {/* Header - with dynamic visibility */}
          <div className={`bg-white dark:bg-gray-900 px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 dark:border-gray-700 flex-shrink-0 transition-all duration-300 ease-in-out transform ${
            headerVisible 
              ? 'translate-y-0 opacity-100' 
              : '-translate-y-full opacity-0 pointer-events-none'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <BookOpen className="h-6 w-6 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                    {sectionName} - {getReadingReference()}
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Bible Reading</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                {/* Font Size Controls */}
                <div className="flex items-center space-x-1 border border-gray-300 dark:border-gray-600 rounded-md">
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize <= fontSizeOptions[0].size}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-l-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Decrease font size"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="px-2 py-1 text-xs font-medium text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-800 min-w-[2.5rem] text-center">
                    {fontSize}px
                  </span>
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize >= fontSizeOptions[fontSizeOptions.length - 1].size}
                    className="p-1.5 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-r-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Increase font size"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
                <div className="w-32 sm:w-40">
                  <SimpleBibleVersionSelector
                    selectedVersion={selectedVersion}
                    onVersionChange={setSelectedVersion}
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>          {/* Content */}
          <div className="bg-gray-50 dark:bg-gray-800 flex-1 overflow-hidden flex flex-col transition-colors relative">
            <div 
              ref={scrollContainerRef}
              className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6"
            >
              {renderBibleContent()}
            </div>
            
            {/* Floating Controls - shown when header is hidden */}
            {showFloatingControls && (
              <div className="fixed top-4 right-4 z-20 flex flex-col space-y-2">
                {/* Show Header Button */}
                <button
                  onClick={() => {
                    setHeaderVisible(true);
                    setShowFloatingControls(false);
                    if (scrollContainerRef.current) {
                      scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
                    }
                  }}
                  className="p-3 bg-blue-600 dark:bg-blue-700 text-white rounded-full shadow-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors"
                  title="Show controls"
                >
                  <ChevronUp className="h-5 w-5" />
                </button>
                
                {/* Font Size Controls */}
                <div className="flex flex-col space-y-1 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-2 border dark:border-gray-600">
                  <button
                    onClick={increaseFontSize}
                    disabled={fontSize >= fontSizeOptions[fontSizeOptions.length - 1].size}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Increase font size"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                  <span className="text-xs text-center text-gray-600 dark:text-gray-400 px-1">
                    {fontSize}
                  </span>
                  <button
                    onClick={decreaseFontSize}
                    disabled={fontSize <= fontSizeOptions[0].size}
                    className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    title="Decrease font size"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                </div>
                
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="p-3 bg-gray-600 dark:bg-gray-700 text-white rounded-full shadow-lg hover:bg-gray-700 dark:hover:bg-gray-600 transition-colors"
                  title="Close"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="bg-gray-50 dark:bg-gray-800 px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-700 flex-shrink-0 transition-colors">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 dark:bg-blue-700 text-base font-medium text-white hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-blue-400 sm:text-sm transition-colors"
                onClick={onClose}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
