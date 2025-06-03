import { BiblePassage, BibleChapter, BibleVersion, BOOK_MAPPINGS, BIBLE_VERSIONS } from '@/types/bibleApi';
import { apiBibleService } from './apiBibleService';
import { bibleBrainService } from './bibleBrainService';

class BibleApiService {
  private baseUrl = 'https://bible-api.com';
  private cdnUrl = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';
  
  // Provider priority for different versions
  private providerPriority: { [key: string]: ('primary' | 'apiBible' | 'bibleBrain')[] } = {
    // Versions best supported by primary API (bible-api.com)
    'kjv': ['primary', 'apiBible', 'bibleBrain'],
    'asv': ['primary', 'apiBible', 'bibleBrain'],
    'web': ['primary', 'bibleBrain', 'apiBible'],
    'bbe': ['primary', 'bibleBrain', 'apiBible'],
    
    // Contemporary versions best supported by API.Bible
    'niv': ['apiBible', 'primary', 'bibleBrain'],
    'esv': ['apiBible', 'primary', 'bibleBrain'],
    'nlt': ['apiBible', 'primary', 'bibleBrain'],
    'nasb': ['apiBible', 'primary', 'bibleBrain'],
    'csb': ['apiBible', 'primary', 'bibleBrain'],
    'nkjv': ['apiBible', 'primary', 'bibleBrain'],
    'nrsv': ['apiBible', 'primary', 'bibleBrain'],
    'rsv': ['apiBible', 'primary', 'bibleBrain'],
    'amp': ['apiBible', 'primary', 'bibleBrain'],
    'msg': ['apiBible', 'primary', 'bibleBrain'],
    'tpt': ['apiBible', 'primary', 'bibleBrain'],
    'cev': ['apiBible', 'primary', 'bibleBrain']
  };
  /**
   * Get available Bible versions
   */
  getVersions(): BibleVersion[] {
    return BIBLE_VERSIONS;
  }

  /**
   * Check if version is supported by primary API
   */
  private isPrimarySupportedVersion(version: string): boolean {
    const primarySupported = ['kjv', 'asv', 'web', 'bbe'];
    return primarySupported.includes(version.toLowerCase());
  }

  /**
   * Get provider priority for a version
   */
  private getProviderPriority(version: string): ('primary' | 'apiBible' | 'bibleBrain')[] {
    return this.providerPriority[version.toLowerCase()] || ['primary', 'apiBible', 'bibleBrain'];
  }

  /**
   * Get a Bible passage using multiple providers with intelligent fallback
   */
  async getPassage(reference: string, version: string = 'niv'): Promise<BiblePassage | null> {
    const providers = this.getProviderPriority(version);
    
    for (const provider of providers) {
      try {
        let result: BiblePassage | null = null;
        
        switch (provider) {
          case 'primary':
            if (this.isPrimarySupportedVersion(version)) {
              result = await this.getPrimaryPassage(reference, version);
            }
            break;
            
          case 'apiBible':
            if (apiBibleService.isVersionSupported(version)) {
              result = await apiBibleService.getPassage(reference, version);
            }
            break;
            
          case 'bibleBrain':
            if (bibleBrainService.isVersionSupported(version)) {
              result = await bibleBrainService.getPassage(reference, version);
            }
            break;
        }
        
        if (result && result.verses && result.verses.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Provider ${provider} failed for ${version}:`, error);
        continue; // Try next provider
      }
    }
    
    // If all providers fail, return fallback response
    return this.createFallbackResponse(reference, version);
  }

  /**
   * Get passage from primary API (bible-api.com)
   */
  private async getPrimaryPassage(reference: string, version: string): Promise<BiblePassage | null> {
    const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${version}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  }
  /**
   * Create a fallback response for unsupported versions
   */
  private createFallbackResponse(reference: string, version: string): BiblePassage {
    const versionData = BIBLE_VERSIONS.find(v => v.id === version);
    const versionName = versionData?.name || version.toUpperCase();
    
    return {
      reference,
      verses: [{
        book_name: reference.split(' ')[0] || 'Bible',
        book_id: reference.split(' ')[0]?.toLowerCase() || 'bible',
        chapter: 1,
        verse: 1,
        text: `📖 The ${versionName} is temporarily unavailable. We're working to provide access to more Bible versions. You can find this version on Bible Gateway, YouVersion, or other Bible apps. Thank you for your patience!`
      }],
      text: `📖 The ${versionName} is temporarily unavailable. We're working to provide access to more Bible versions. You can find this version on Bible Gateway, YouVersion, or other Bible apps. Thank you for your patience!`,
      translation_id: version,
      translation_name: versionName,
      translation_note: `This is a placeholder for ${versionName}. We're working to expand version availability.`
    };
  }

  /**
   * Get a specific chapter using multiple providers with intelligent fallback
   */
  async getChapter(book: string, chapter: number, version: string = 'niv'): Promise<BibleChapter | null> {
    const providers = this.getProviderPriority(version);
    
    for (const provider of providers) {
      try {
        let result: BibleChapter | null = null;
        
        switch (provider) {
          case 'primary':
            if (this.isPrimarySupportedVersion(version)) {
              result = await this.getPrimaryChapter(book, chapter, version);
            }
            break;
            
          case 'apiBible':
            if (apiBibleService.isVersionSupported(version)) {
              result = await apiBibleService.getChapter(book, chapter, version);
            }
            break;
            
          case 'bibleBrain':
            if (bibleBrainService.isVersionSupported(version)) {
              result = await bibleBrainService.getChapter(book, chapter, version);
            }
            break;
        }
        
        if (result && result.verses && result.verses.length > 0) {
          return result;
        }
      } catch (error) {
        console.warn(`Provider ${provider} failed for chapter ${book} ${chapter} in ${version}:`, error);
        continue; // Try next provider
      }
    }
    
    // If all providers fail, return fallback chapter
    return this.createFallbackChapter(book, chapter, version);
  }

  /**
   * Get chapter from primary API (CDN)
   */
  private async getPrimaryChapter(book: string, chapter: number, version: string): Promise<BibleChapter | null> {
    const bookCode = BOOK_MAPPINGS[book] || book.toLowerCase();
    const url = `${this.cdnUrl}/en-${version}/books/${bookCode}/chapters/${chapter}.json`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Transform the data to our format
    const verses = Object.entries(data.verses || {}).map(([verseNum, text]) => ({
      verse: parseInt(verseNum),
      text: text as string
    })).sort((a, b) => a.verse - b.verse);

    return {
      book,
      chapter,
      verses
    };
  }

  /**
   * Create a fallback chapter for unsupported versions
   */
  private createFallbackChapter(book: string, chapter: number, version: string): BibleChapter {
    const versionData = BIBLE_VERSIONS.find(v => v.id === version);
    const versionName = versionData?.name || version.toUpperCase();
    
    return {
      book,
      chapter,
      verses: [{
        verse: 1,
        text: `📖 ${book} ${chapter} in ${versionName} is temporarily unavailable. We're working to provide access to more Bible versions. Thank you for your patience!`
      }]
    };
  }

  /**
   * Get multiple chapters for a book
   */
  async getChapters(book: string, chapters: number[], version: string = 'kjv'): Promise<BibleChapter[]> {
    const promises = chapters.map(chapter => this.getChapter(book, chapter, version));
    const results = await Promise.all(promises);
    return results.filter((chapter): chapter is BibleChapter => chapter !== null);
  }

  /**
   * Get a range of verses using bible-api.com
   */
  async getVerseRange(book: string, chapter: number, startVerse: number, endVerse: number, version: string = 'kjv'): Promise<BiblePassage | null> {
    try {
      const reference = `${book} ${chapter}:${startVerse}-${endVerse}`;
      return await this.getPassage(reference, version);
    } catch (error) {
      console.error('Error fetching verse range:', error);
      return null;
    }
  }

  /**
   * Search for verses containing specific text
   */
  async searchVerses(query: string, version: string = 'kjv'): Promise<BiblePassage | null> {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(query)}?translation=${version}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error searching verses:', error);
      return null;
    }
  }

  /**
   * Format a reading portion for API calls
   */
  formatReadingReference(bookName: string, chapters?: number[], verses?: string): string {
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
  }  /**
   * Get Bible text for a reading portion using multiple providers
   */
  async getReadingPortionText(bookName: string, chapters?: number[], verses?: string, version: string = 'niv'): Promise<BiblePassage | null> {
    try {
      let reference = '';
      
      if (chapters && chapters.length > 0) {
        // Format reference for multiple chapters
        if (chapters.length === 1) {
          reference = `${bookName} ${chapters[0]}`;
        } else {
          // For multiple chapters, we'll request the range
          reference = `${bookName} ${chapters[0]}-${chapters[chapters.length - 1]}`;
        }
      } else if (verses) {
        // Get specific verses
        reference = `${bookName} ${verses}`;
      } else {
        // Get the entire book (first chapter as sample)
        reference = `${bookName} 1`;
      }
      
      return await this.getPassage(reference, version);
    } catch (error) {
      console.error('Error getting reading portion text:', error);
      return this.createFallbackResponse(`${bookName} ${chapters?.[0] || verses || '1'}`, version);
    }
  }

  /**
   * Check if a version has enhanced support (multiple providers)
   */
  hasEnhancedSupport(version: string): boolean {
    const providers = this.getProviderPriority(version);
    return providers.some(provider => 
      (provider === 'apiBible' && apiBibleService.isVersionSupported(version)) ||
      (provider === 'bibleBrain' && bibleBrainService.isVersionSupported(version)) ||
      (provider === 'primary' && this.isPrimarySupportedVersion(version))
    );
  }

  /**
   * Get provider status for a version
   */
  getProviderStatus(version: string): { 
    primary: boolean; 
    apiBible: boolean; 
    bibleBrain: boolean; 
    hasSupport: boolean 
  } {
    return {
      primary: this.isPrimarySupportedVersion(version),
      apiBible: apiBibleService.isVersionSupported(version),
      bibleBrain: bibleBrainService.isVersionSupported(version),
      hasSupport: this.hasEnhancedSupport(version)
    };
  }
}

export const bibleApiService = new BibleApiService();
