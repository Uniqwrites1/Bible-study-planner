'use client';

import { useState } from 'react';
import { WORKING_BIBLE_VERSIONS } from '@/services/workingBibleApi';
import { ChevronDown } from 'lucide-react';

interface BibleVersionSelectorProps {
  selectedVersion: string;
  onVersionChange: (version: string) => void;
}

export default function BibleVersionSelector({ 
  selectedVersion, 
  onVersionChange 
}: BibleVersionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  
  const selectedVersionData = WORKING_BIBLE_VERSIONS.find(v => v.id === selectedVersion);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900 dark:text-white">
            {selectedVersionData?.id.toUpperCase() || selectedVersion.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {selectedVersionData?.name || 'Bible Version'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 dark:text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg max-h-80 overflow-y-auto transition-colors">
          <div className="py-1">
            <div>
              <div className="px-3 py-2 text-xs font-semibold text-green-600 dark:text-green-400 uppercase tracking-wide bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800">
                ✅ Available Bible Versions
              </div>
              {WORKING_BIBLE_VERSIONS.map((version) => (
                <button
                  key={version.id}
                  onClick={() => {
                    onVersionChange(version.id);
                    setIsOpen(false);
                  }}
                  className={`w-full px-3 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-50 dark:focus:bg-gray-700 transition-colors ${
                    selectedVersion === version.id ? 'bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  <div className="flex flex-col">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">{version.id.toUpperCase()}</span>
                      <span className="px-2 py-1 text-xs bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-300 rounded-full">
                        ✓ Free
                      </span>
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{version.name}</span>
                    <span className="text-xs text-gray-400 dark:text-gray-500">via {version.apiProvider}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
