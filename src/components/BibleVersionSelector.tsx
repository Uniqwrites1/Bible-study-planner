'use client';

import { useState } from 'react';
import { bibleApiService } from '@/services/bibleApi';
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
  const versions = bibleApiService.getVersions();
  
  const selectedVersionData = versions.find(v => v.id === selectedVersion);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        <div className="flex flex-col items-start">
          <span className="text-sm font-medium text-gray-900">
            {selectedVersionData?.abbreviation || selectedVersion.toUpperCase()}
          </span>
          <span className="text-xs text-gray-500">
            {selectedVersionData?.name || 'Bible Version'}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
          <div className="py-1">
            {versions.map((version) => (
              <button
                key={version.id}
                onClick={() => {
                  onVersionChange(version.id);
                  setIsOpen(false);
                }}
                className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                  selectedVersion === version.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                }`}
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{version.abbreviation}</span>
                  <span className="text-xs text-gray-500">{version.name}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
