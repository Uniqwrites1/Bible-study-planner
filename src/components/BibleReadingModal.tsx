'use client';

import { useState, useEffect, useCallback } from 'react';
import { X, BookOpen, Loader2 } from 'lucide-react';
import { BiblePassage } from '@/types/bibleApi';
import { bibleApiService } from '@/services/bibleApi';
import BibleVersionSelector from './BibleVersionSelector';

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
}: BibleReadingModalProps) {
  const [bibleContent, setBibleContent] = useState<BiblePassage | null>(null);
  const [selectedVersion, setSelectedVersion] = useState('kjv');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);  const loadBibleContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const content = await bibleApiService.getReadingPortionText(
        bookName,
        chapters,
        verses,
        selectedVersion
      );
      
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
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
          <span className="ml-2 text-gray-600">Loading Bible text...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-12">
          <div className="text-red-600 mb-4">{error}</div>
          <button
            onClick={loadBibleContent}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      );
    }

    if (!bibleContent) {
      return (
        <div className="text-center py-12 text-gray-600">
          No content available
        </div>
      );
    }

    // Handle BiblePassage format (from bible-api.com)
    return (
      <div className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          {bibleContent.translation_name} ({bibleContent.translation_id.toUpperCase()})
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
            {bibleContent.reference}
          </h3>
        </div>
        <div className="space-y-2">
          {bibleContent.verses.map((verse, index) => (
            <div key={index} className="flex space-x-3">
              <span className="text-sm font-medium text-gray-500 min-w-[2rem]">
                {verse.verse}
              </span>
              <span className="text-gray-900 leading-relaxed">{verse.text}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[9999] overflow-y-auto bg-black bg-opacity-50" style={{ zIndex: 9999 }}>
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" 
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full relative z-10">
          {/* Header */}
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <BookOpen className="h-6 w-6 text-blue-600" />
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {sectionName} - {getReadingReference()}
                  </h3>
                  <p className="text-sm text-gray-500">Bible Reading</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-40">
                  <BibleVersionSelector
                    selectedVersion={selectedVersion}
                    onVersionChange={setSelectedVersion}
                  />
                </div>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="bg-gray-50 px-4 py-5 sm:p-6">
            <div className="max-h-96 overflow-y-auto">
              {renderBibleContent()}
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
