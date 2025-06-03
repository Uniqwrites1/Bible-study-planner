/**
 * Bible Brain API service integration for additional Bible version support
 * Bible Brain provides free access to many Bible versions and audio Bibles
 * No API key required for basic access
 */

import { BiblePassage, BibleChapter } from '@/types/bibleApi';

interface BibleBrainBible {
  abbr: string;
  name: string;
  vname: string;
  language: string;
  autonym: string;
  language_id: number;
  iso: string;
  date: string;
  filesets: unknown[];
}

interface BibleBrainBook {
  book_id: string;
  book_id_usfx: string;
  book_id_osis: string;
  name: string;
  testament: string;
  testament_order: number;
  book_order: number;
  book_group: string;
  chapters: number[];
}

class BibleBrainService {
  private baseUrl = 'https://4.dbt.io/api';
  private apiKey = 'your-api-key-here'; // Bible Brain provides free access
  
  // Version mappings for Bible Brain
  private versionMappings: { [key: string]: string } = {
    'kjv': 'ENGESV', // King James Version equivalent
    'web': 'ENGWEB', // World English Bible
    'bbe': 'ENGBBE', // Bible in Basic English
    'asv': 'ENGASV', // American Standard Version
    // Add more mappings as available from Bible Brain
  };  private async makeRequest<T = unknown>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`Bible Brain request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as T;
  }  /**
   * Get available Bibles from Bible Brain
   */
  async getAvailableBibles(): Promise<BibleBrainBible[]> {
    try {
      const response = await this.makeRequest<{ data?: BibleBrainBible[] }>('/bibles');
      return response.data || [];
    } catch (error) {
      console.error('Error fetching Bible Brain Bibles:', error);
      return [];
    }
  }

  /**
   * Get books for a specific Bible
   */
  async getBooks(bibleId: string): Promise<BibleBrainBook[]> {
    try {
      const response = await this.makeRequest<{ data?: BibleBrainBook[] }>(`/bibles/${bibleId}/books`);
      return response.data || [];
    } catch (error) {
      console.error('Error fetching books from Bible Brain:', error);
      return [];
    }
  }

  /**
   * Get a Bible passage using Bible Brain API
   */
  async getPassage(reference: string, version: string): Promise<BiblePassage | null> {
    try {
      const bibleId = this.versionMappings[version.toLowerCase()];
      if (!bibleId) {
        throw new Error(`Version ${version} not available in Bible Brain`);
      }

      // Parse reference
      const { book, chapter, verses } = this.parseReference(reference);
      const bookId = this.getBookId(book);
      
      let endpoint = `/bibles/${bibleId}/books/${bookId}/chapters/${chapter}`;
      if (verses) {
        endpoint += `?verse_start=${verses.start}&verse_end=${verses.end}`;
      }      const response = await this.makeRequest<{ 
        data?: {
          book_name?: string;
          book_id?: string;
          chapter?: number;
          verses?: Array<{
            verse_start?: number;
            verse_text?: string;
          }>;
        }
      }>(endpoint);
      return this.transformBibleBrainResponse(response.data, reference, version);
    } catch (error) {
      console.error('Error fetching passage from Bible Brain:', error);
      return null;
    }
  }

  /**
   * Get a specific chapter
   */
  async getChapter(book: string, chapter: number, version: string): Promise<BibleChapter | null> {
    try {
      const bibleId = this.versionMappings[version.toLowerCase()];
      if (!bibleId) {
        throw new Error(`Version ${version} not available in Bible Brain`);
      }      const bookId = this.getBookId(book);
      const response = await this.makeRequest<{
        data?: {
          book_name?: string;
          book_id?: string;
          chapter?: number;
          verses?: Array<{
            verse_start?: number;
            verse_text?: string;
          }>;
        }
      }>(`/bibles/${bibleId}/books/${bookId}/chapters/${chapter}`);
      
      return this.transformChapterResponse(response.data, book, chapter);
    } catch (error) {
      console.error('Error fetching chapter from Bible Brain:', error);
      return null;
    }
  }

  /**
   * Parse reference string to extract components
   */
  private parseReference(reference: string): { book: string; chapter: number; verses?: { start: number; end: number } } {
    const parts = reference.trim().split(' ');
    const book = parts.slice(0, -1).join(' ');
    const chapterVerse = parts[parts.length - 1];
    
    if (chapterVerse.includes(':')) {
      const [chapterStr, verseStr] = chapterVerse.split(':');
      const chapter = parseInt(chapterStr);
      
      if (verseStr.includes('-')) {
        const [start, end] = verseStr.split('-').map(v => parseInt(v));
        return { book, chapter, verses: { start, end } };
      } else {
        const verse = parseInt(verseStr);
        return { book, chapter, verses: { start: verse, end: verse } };
      }
    } else {
      return { book, chapter: parseInt(chapterVerse) };
    }
  }

  /**
   * Get book ID for Bible Brain format
   */
  private getBookId(bookName: string): string {
    const bookMappings: { [key: string]: string } = {
      'Genesis': 'GEN', 'Exodus': 'EXO', 'Leviticus': 'LEV', 'Numbers': 'NUM',
      'Deuteronomy': 'DEU', 'Joshua': 'JOS', 'Judges': 'JDG', 'Ruth': 'RUT',
      '1 Samuel': '1SA', '2 Samuel': '2SA', '1 Kings': '1KI', '2 Kings': '2KI',
      '1 Chronicles': '1CH', '2 Chronicles': '2CH', 'Ezra': 'EZR', 'Nehemiah': 'NEH',
      'Esther': 'EST', 'Job': 'JOB', 'Psalms': 'PSA', 'Proverbs': 'PRO',
      'Ecclesiastes': 'ECC', 'Song of Songs': 'SNG', 'Isaiah': 'ISA', 'Jeremiah': 'JER',
      'Lamentations': 'LAM', 'Ezekiel': 'EZK', 'Daniel': 'DAN', 'Hosea': 'HOS',
      'Joel': 'JOL', 'Amos': 'AMO', 'Obadiah': 'OBA', 'Jonah': 'JON',
      'Micah': 'MIC', 'Nahum': 'NAM', 'Habakkuk': 'HAB', 'Zephaniah': 'ZEP',
      'Haggai': 'HAG', 'Zechariah': 'ZEC', 'Malachi': 'MAL',
      'Matthew': 'MAT', 'Mark': 'MRK', 'Luke': 'LUK', 'John': 'JHN',
      'Acts': 'ACT', 'Romans': 'ROM', '1 Corinthians': '1CO', '2 Corinthians': '2CO',
      'Galatians': 'GAL', 'Ephesians': 'EPH', 'Philippians': 'PHP', 'Colossians': 'COL',
      '1 Thessalonians': '1TH', '2 Thessalonians': '2TH', '1 Timothy': '1TI', '2 Timothy': '2TI',
      'Titus': 'TIT', 'Philemon': 'PHM', 'Hebrews': 'HEB', 'James': 'JAS',
      '1 Peter': '1PE', '2 Peter': '2PE', '1 John': '1JN', '2 John': '2JN',
      '3 John': '3JN', 'Jude': 'JUD', 'Revelation': 'REV'
    };
    
    return bookMappings[bookName] || bookName.toUpperCase().substring(0, 3);
  }
  /**
   * Transform Bible Brain response to our format
   */
  private transformBibleBrainResponse(data: {
    book_name?: string;
    book_id?: string;
    chapter?: number;
    verses?: Array<{
      verse_start?: number;
      verse_text?: string;
    }>;
  } | undefined, reference: string, version: string): BiblePassage {
    const verses = data?.verses?.map((verse, index) => ({
      book_name: data.book_name || reference.split(' ')[0],
      book_id: data.book_id || reference.split(' ')[0]?.toLowerCase(),
      chapter: data.chapter || 1,
      verse: verse.verse_start || index + 1,
      text: verse.verse_text || ''
    })) || [];

    return {
      reference,
      verses,
      text: verses.map((v) => v.text).join(' '),
      translation_id: version,
      translation_name: version.toUpperCase(),
      translation_note: `Provided by Bible Brain API`
    };
  }

  /**
   * Transform Bible Brain chapter response to our format
   */
  private transformChapterResponse(data: {
    book_name?: string;
    book_id?: string;
    chapter?: number;
    verses?: Array<{
      verse_start?: number;
      verse_text?: string;
    }>;
  } | undefined, book: string, chapter: number): BibleChapter {
    const verses = data?.verses?.map((verse, index) => ({
      verse: verse.verse_start || index + 1,
      text: verse.verse_text || ''
    })) || [];

    return {
      book,
      chapter,
      verses
    };
  }

  /**
   * Check if version is supported by Bible Brain
   */
  isVersionSupported(version: string): boolean {
    return Object.hasOwnProperty.call(this.versionMappings, version.toLowerCase());
  }
}

export const bibleBrainService = new BibleBrainService();
