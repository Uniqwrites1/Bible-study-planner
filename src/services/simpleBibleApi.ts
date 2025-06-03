import { BiblePassage } from '@/types/bibleApi';
import { workingBibleApi, WORKING_BIBLE_VERSIONS } from './workingBibleApi';

// Simple Bible API Service that actually works
class BibleApiService {
  
  async getPassage(reference: string, version: string = 'kjv'): Promise<BiblePassage> {
    return workingBibleApi.getPassage(reference, version);
  }

  async getReadingPortionText(
    bookName: string, 
    chapters?: number[], 
    verses?: string, 
    version: string = 'kjv'
  ): Promise<BiblePassage> {
    // Format the reference for the API
    let reference = bookName;
    
    if (chapters && chapters.length > 0) {
      if (chapters.length === 1) {
        reference = `${bookName} ${chapters[0]}`;
      } else {
        // For multiple chapters, get the first one
        reference = `${bookName} ${chapters[0]}`;
      }
    } else if (verses) {
      reference = `${bookName} ${verses}`;
    }

    return this.getPassage(reference, version);
  }

  getSupportedVersions() {
    return WORKING_BIBLE_VERSIONS;
  }

  getWorkingVersions() {
    return workingBibleApi.getWorkingVersions();
  }

  getVersionsByCategory(category: string) {
    return workingBibleApi.getVersionsByCategory(category);
  }

  isVersionSupported(version: string): boolean {
    return WORKING_BIBLE_VERSIONS.some(v => v.id === version && v.working);
  }

  getVersionInfo(version: string) {
    return workingBibleApi.getVersionInfo(version);
  }
}

export const bibleApiService = new BibleApiService();
