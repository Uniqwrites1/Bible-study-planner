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
  
  // Organize versions by category
  const organizedVersions = {
    'Popular Contemporary': versions.filter(v => 
      ['niv', 'esv', 'nlt', 'msg', 'csb'].includes(v.id)
    ),
    'Classic': versions.filter(v => 
      ['kjv', 'nkjv', 'asv', 'rsv', 'nrsv'].includes(v.id)
    ),
    'Study & Reference': versions.filter(v => 
      ['nasb', 'amp', 'web'].includes(v.id)
    ),
    'Simple English': versions.filter(v => 
      ['bbe', 'cev', 'tpt'].includes(v.id)
    )
  };
  
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
      </button>      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-80 overflow-y-auto">
          <div className="py-1">
            {Object.entries(organizedVersions).map(([category, categoryVersions]) => (
              <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wide bg-gray-50 border-b border-gray-200">
                  {category}
                </div>                {categoryVersions.map((version) => {
                  const providerStatus = bibleApiService.getProviderStatus(version.id);
                  const hasFullSupport = providerStatus.primary || providerStatus.apiBible;
                  
                  return (
                    <button
                      key={version.id}
                      onClick={() => {
                        onVersionChange(version.id);
                        setIsOpen(false);
                      }}
                      className={`w-full px-3 py-2 text-left hover:bg-gray-50 focus:outline-none focus:bg-gray-50 ${
                        selectedVersion === version.id ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                      } ${version.id === 'msg' ? 'border-l-4 border-yellow-400' : ''}`}
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium">{version.abbreviation}</span>
                          {version.id === 'msg' && (
                            <span className="px-2 py-1 text-xs bg-yellow-100 text-yellow-800 rounded-full">
                              Popular
                            </span>
                          )}
                          {hasFullSupport ? (
                            <span className="px-2 py-1 text-xs bg-green-100 text-green-700 rounded-full">
                              ✓ Available
                            </span>
                          ) : providerStatus.bibleBrain ? (
                            <span className="px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full">
                              ⚡ Limited
                            </span>
                          ) : (
                            <span className="px-2 py-1 text-xs bg-orange-100 text-orange-600 rounded-full">
                              🔄 Coming Soon
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-gray-500">{version.name}</span>
                        <span className="text-xs text-gray-400">{version.description}</span>
                        {!hasFullSupport && (
                          <span className="text-xs text-gray-400 mt-1">
                            {providerStatus.bibleBrain ? 'Limited availability' : 'Expanding access soon'}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
