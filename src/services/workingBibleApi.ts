// Working Bible API Service - Only free versions that actually work
import { BiblePassage, BibleVerse } from '@/types/bibleApi';

export interface WorkingBibleVersion {
  id: string;
  name: string;
  category: string;
  apiProvider: 'bible-api.com';
  requiresApiKey: boolean;
  working: boolean;
}

// Only include versions that actually work from bible-api.com (all free, no API key required)
export const WORKING_BIBLE_VERSIONS: WorkingBibleVersion[] = [
  { id: 'kjv', name: 'King James Version', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },
  { id: 'web', name: 'World English Bible', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },
  { id: 'asv', name: 'American Standard Version (1901)', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },
  { id: 'bbe', name: 'Bible in Basic English', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },
  { id: 'ylt', name: 'Young\'s Literal Translation (NT only)', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },
  { id: 'darby', name: 'Darby Bible', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true }
];

class WorkingBibleApiService {
  private defaultVersion = 'kjv'; // Always working fallback

  async getPassage(reference: string, version: string = this.defaultVersion): Promise<BiblePassage> {
    const versionInfo = WORKING_BIBLE_VERSIONS.find(v => v.id === version);
    
    if (!versionInfo) {
      // Use KJV as fallback for any unknown version
      return this.getPassage(reference, this.defaultVersion);
    }

    try {
      // All versions are from bible-api.com, so use that directly
      return await this.getBibleApiComPassage(reference, version);
    } catch (error) {
      console.error(`Error fetching ${version}:`, error);
      // Always fallback to KJV from bible-api.com
      if (version !== this.defaultVersion) {
        return this.getPassage(reference, this.defaultVersion);
      }
      throw error;
    }
  }

  private async getBibleApiComPassage(reference: string, version: string): Promise<BiblePassage> {
    // Ensure the version is supported by bible-api.com
    const supportedVersions = ['kjv', 'web', 'asv', 'bbe', 'ylt', 'darby'];
    const actualVersion = supportedVersions.includes(version) ? version : this.defaultVersion;
    
    if (actualVersion !== version) {
      console.warn(`Version ${version} not supported by bible-api.com, using ${actualVersion}`);
    }
    
    const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${actualVersion}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`Bible API request failed: ${response.status}`);
    }
    
    const data = await response.json();
    
    return {
      reference: data.reference,
      verses: data.verses.map((verse: BibleVerse) => ({
        book_name: verse.book_name,
        book_id: verse.book_id,
        chapter: verse.chapter,
        verse: verse.verse,
        text: verse.text
      })),
      text: data.text,
      translation_id: actualVersion.toUpperCase(),
      translation_name: data.translation_name || WORKING_BIBLE_VERSIONS.find(v => v.id === actualVersion)?.name || actualVersion.toUpperCase(),
      translation_note: `Retrieved from bible-api.com using ${actualVersion.toUpperCase()}`
    };
  }

  getVersionInfo(version: string): WorkingBibleVersion | null {
    return WORKING_BIBLE_VERSIONS.find(v => v.id === version) || null;
  }

  getSupportedVersions(): WorkingBibleVersion[] {
    return WORKING_BIBLE_VERSIONS;
  }

  getWorkingVersions(): WorkingBibleVersion[] {
    return WORKING_BIBLE_VERSIONS.filter(v => v.working);
  }

  getVersionsByCategory(category: string): WorkingBibleVersion[] {
    return WORKING_BIBLE_VERSIONS.filter(v => v.category === category);
  }
}

export const workingBibleApi = new WorkingBibleApiService();
