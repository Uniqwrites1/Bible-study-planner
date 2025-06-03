'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { BiblePassage } from '@/types/bibleApi';
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
  const [error, setError] = useState<string | null>(null);const loadBibleContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
      try {
      // Format reference for API call
      let reference = bookName;
      if (chapters && chapters.length > 0) {
        reference = `${bookName} ${chapters[0]}`;
      } else if (verses) {
        reference = `${bookName} ${verses}`;
      }
      
      const content = await workingBibleApi.getPassage(reference, selectedVersion);
      
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
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-3 text-gray-600 text-base sm:text-lg">Loading Bible text...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-16 sm:py-20">
          <div className="text-red-600 mb-6 text-base sm:text-lg px-4">{error}</div>
          <button
            onClick={loadBibleContent}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-base font-medium"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!bibleContent) {
      return (
        <div className="text-center py-16 sm:py-20 text-gray-600 text-base sm:text-lg">
          No content available
        </div>
      );
    }// Handle BiblePassage format (from bible-api.com)
        // Handle BiblePassage format (from bible-api.com)
    return (
      <div className="space-y-4 max-w-none">
        <div className="mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 border-b-2 border-blue-200 pb-3">
            {bibleContent.reference}
          </h3>
        </div>
        <div className="space-y-3 sm:space-y-4">
          {bibleContent.verses.map((verse, index) => (
            <div key={index} className="flex flex-col sm:flex-row sm:space-x-4 space-y-1 sm:space-y-0">
              <span className="text-sm font-medium text-blue-600 min-w-[3rem] flex-shrink-0 sm:text-right">
                {verse.verse}
              </span>
              <span className="text-gray-900 leading-relaxed text-base sm:text-lg flex-1 font-medium">
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
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen p-2 sm:p-4 lg:p-6">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal - Responsive sizing for mobile, tablet, and desktop */}
        <div className="relative z-10 bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all w-full h-full sm:h-auto sm:max-h-[90vh] sm:w-full sm:max-w-2xl md:max-w-4xl lg:max-w-6xl xl:max-w-7xl flex flex-col">
          {/* Header */}
          <div className="bg-white px-4 py-3 sm:px-6 sm:py-4 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 min-w-0 flex-1">
                <BookOpen className="h-6 w-6 text-blue-600 flex-shrink-0" />
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-medium text-gray-900 truncate">
                    {sectionName} - {getReadingReference()}
                  </h3>
                  <p className="text-sm text-gray-500">Bible Reading</p>
                </div>
              </div>
              <div className="flex items-center space-x-2 sm:space-x-3 flex-shrink-0">
                <div className="w-32 sm:w-40">
                  <SimpleBibleVersionSelector
                    selectedVersion={selectedVersion}
                    onVersionChange={setSelectedVersion}
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors p-1"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 flex-1 overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto px-4 py-4 sm:px-6 sm:py-6">
              {renderBibleContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 border-t border-gray-200 flex-shrink-0">
            <div className="flex justify-end">
              <button
                type="button"
                className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:text-sm transition-colors"
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
