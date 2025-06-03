/**
 * API.Bible service integration for comprehensive Bible version support
 * API.Bible provides 2,500+ Bible versions in 1,700+ languages
 * Free tier: 1,000 requests/day
 */

import { BiblePassage, BibleChapter } from '@/types/bibleApi';

interface ApiBibleVersion {
  id: string;
  dblId: string;
  abbreviation: string;
  abbreviationLocal: string;
  name: string;
  nameLocal: string;
  description: string;
  descriptionLocal: string;
  language: {
    id: string;
    name: string;
    nameLocal: string;
    script: string;
    scriptDirection: string;
  };
  countries: Array<{
    id: string;
    name: string;
    nameLocal: string;
  }>;
  type: string;
  updatedAt: string;  relatedDbl: string | null;
  audioBibles: unknown[];
}

interface ApiBibleBook {
  id: string;
  bibleId: string;
  abbreviation: string;
  name: string;
  nameLong: string;
}

interface ApiBibleChapter {
  id: string;
  bibleId: string;
  bookId: string;
  number: string;
  content: string;
  copyright: string;
  verseCount: number;
}

interface ApiBiblePassageResponse {
  data: {
    id: string;
    bibleId: string;
    orgId: string;
    content: string;
    reference: string;
    verseCount: number;
    copyright: string;
  };
}

interface ApiBibleVersionsResponse {
  data: ApiBibleVersion[];
}

interface ApiBibleBooksResponse {
  data: ApiBibleBook[];
}

interface ApiBibleChapterResponse {
  data: ApiBibleChapter;
}

class ApiBibleService {
  private baseUrl = 'https://api.scripture.api.bible/v1';
  private apiKey = process.env.NEXT_PUBLIC_API_BIBLE_KEY || '';
    // Common Bible version mappings to API.Bible IDs - Updated with available free versions
  private versionMappings: { [key: string]: string } = {
    // Free versions available with API key
    'kjv': 'de4e12af7f28f599-02', // King James Version
    'asv': '685d1470fe4d5c3b-01', // American Standard Version (Byzantine Text)
    'web': 'web-f8b77b007b1b08a8', // World English Bible (if available)
    'bbe': 'bbe-f9c89977ba0b4d84', // Bible in Basic English (if available)
    
    // Premium versions (may not be available with free API key)
    'niv': '71c6eab17ae5b667-01', // New International Version (Premium)
    'esv': '01b29f4b342acc35-01', // English Standard Version (Premium)
    'nlt': '1849868e14bea1de-02', // New Living Translation (Premium)
    'msg': '65eec8e0b60e656b-01', // The Message (Premium)
    'nasb': '49afb36a1e77eb13-01', // New American Standard Bible (Premium)
    'csb': 'bce611a49f3d81b0-01', // Christian Standard Bible (Premium)
    'amp': '825cbfa17dd6dcb5-01', // Amplified Bible (Premium)
    'nkjv': '114c1c8f6e04acfb-02', // New King James Version (Premium)
    'rsv': '40072c4a5aba4022-01', // Revised Standard Version (Premium)
    'nrsv': '7142879509583d59-01', // New Revised Standard Version (Premium)
    'cev': 'ba11d4e34e68ee7d-01', // Contemporary English Version
    'tpt': '01f0b75396c3c8ad-01'  // The Passion Translation (if available)
  };

  constructor() {
    // For development, we'll use a demo API key or provide graceful fallback
    if (!this.apiKey) {
      console.warn('API.Bible key not found. Using fallback methods.');
    }
  }  private async makeRequest<T = unknown>(endpoint: string): Promise<T> {
    if (!this.apiKey) {
      throw new Error('API key not configured');
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      headers: {
        'api-key': this.apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      throw new Error(`API.Bible request failed: ${response.status} ${response.statusText}`);
    }

    return response.json() as T;
  }

  /**
   * Get available Bible versions from API.Bible
   */
  async getAvailableVersions(): Promise<ApiBibleVersion[]> {    try {
      const response = await this.makeRequest<ApiBibleVersionsResponse>('/bibles');
      return response.data.filter(version => 
        version.language.id === 'eng' && // English only for now
        version.type !== 'audiobible' // Text versions only
      );
    } catch (error) {
      console.error('Error fetching API.Bible versions:', error);
      return [];
    }
  }

  /**
   * Get books for a specific Bible version
   */
  async getBooks(bibleId: string): Promise<ApiBibleBook[]> {
    try {
      const response = await this.makeRequest<ApiBibleBooksResponse>(`/bibles/${bibleId}/books`);
      return response.data;
    } catch (error) {
      console.error('Error fetching books:', error);
      return [];
    }
  }

  /**
   * Get a Bible passage using API.Bible
   */
  async getPassage(reference: string, version: string): Promise<BiblePassage | null> {
    try {
      const bibleId = this.versionMappings[version.toLowerCase()];
      if (!bibleId) {
        throw new Error(`Version ${version} not mapped to API.Bible`);
      }      // Format reference for API.Bible (e.g., "JHN.3.16" or "GEN.1")
      const formattedRef = this.formatReferenceForApi(reference);
      
      const response = await this.makeRequest<ApiBiblePassageResponse>(
        `/bibles/${bibleId}/passages/${formattedRef}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`
      );

      return this.transformApiBibleResponse(response.data, version);
    } catch (error) {
      console.error('Error fetching passage from API.Bible:', error);
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
        throw new Error(`Version ${version} not mapped to API.Bible`);
      }      const bookCode = this.getBookCodeForApi(book);
      const chapterId = `${bookCode}.${chapter}`;
      
      const response = await this.makeRequest<ApiBibleChapterResponse>(
        `/bibles/${bibleId}/chapters/${chapterId}?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false`
      );

      return this.transformChapterResponse(response.data, book, chapter);
    } catch (error) {
      console.error('Error fetching chapter from API.Bible:', error);
      return null;
    }
  }

  /**
   * Format reference for API.Bible format (e.g., "JHN.3.16" or "GEN.1-3")
   */
  private formatReferenceForApi(reference: string): string {
    // Parse reference like "John 3:16" or "Genesis 1-3"
    const parts = reference.trim().split(' ');
    if (parts.length < 2) return reference;

    const bookName = parts.slice(0, -1).join(' ');
    const chapterVerse = parts[parts.length - 1];
    
    const bookCode = this.getBookCodeForApi(bookName);
    
    // Handle different formats
    if (chapterVerse.includes(':')) {
      // Format: "Chapter:Verse" or "Chapter:Verse-Verse"
      const [chapter, verses] = chapterVerse.split(':');
      if (verses.includes('-')) {
        const [startVerse, endVerse] = verses.split('-');
        return `${bookCode}.${chapter}.${startVerse}-${bookCode}.${chapter}.${endVerse}`;
      } else {
        return `${bookCode}.${chapter}.${verses}`;
      }
    } else if (chapterVerse.includes('-')) {
      // Format: "Chapter-Chapter"
      const [startChapter, endChapter] = chapterVerse.split('-');
      return `${bookCode}.${startChapter}-${bookCode}.${endChapter}`;
    } else {
      // Format: "Chapter"
      return `${bookCode}.${chapterVerse}`;
    }
  }

  /**
   * Get book code for API.Bible format (3-letter uppercase)
   */
  private getBookCodeForApi(bookName: string): string {
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
   * Transform API.Bible response to our format
   */
  private transformApiBibleResponse(data: {
    id: string;
    bibleId: string;
    orgId: string;
    content: string;
    reference: string;
    verseCount: number;
    copyright: string;
  }, version: string): BiblePassage {
    // Parse the content to extract verses
    const verses = this.parseContentForVerses(data.content, data.reference);
    
    return {
      reference: data.reference,
      verses,
      text: this.stripHtmlTags(data.content),
      translation_id: version,
      translation_name: version.toUpperCase(),
      translation_note: data.copyright || ''
    };
  }

  /**
   * Transform API.Bible chapter response to our format
   */
  private transformChapterResponse(data: {
    id: string;
    bibleId: string;
    bookId: string;
    number: string;
    content: string;
    copyright: string;
    verseCount: number;
  }, book: string, chapter: number): BibleChapter {
    const verses = this.parseContentForVerses(data.content, `${book} ${chapter}`);
    
    return {
      book,
      chapter,
      verses: verses.map(v => ({
        verse: v.verse,
        text: v.text
      }))
    };
  }
  /**
   * Parse API.Bible content to extract individual verses
   */
  private parseContentForVerses(content: string, reference: string): Array<{
    book_name: string;
    book_id: string;
    chapter: number;
    verse: number;
    text: string;
  }> {
    // Remove HTML tags and parse verses
    const cleanContent = this.stripHtmlTags(content);
    const verses: Array<{
      book_name: string;
      book_id: string;
      chapter: number;
      verse: number;
      text: string;
    }> = [];
    
    // API.Bible includes verse numbers in the content
    // This is a simplified parser - in production you'd want more robust parsing
    const versePattern = /(\d+)\s+([^0-9]+?)(?=\s*\d+|$)/g;
    let match;
    let verseNumber = 1;
    
    while ((match = versePattern.exec(cleanContent)) !== null) {
      verses.push({
        book_name: reference.split(' ')[0] || 'Unknown',
        book_id: reference.split(' ')[0]?.toLowerCase() || 'unknown',
        chapter: parseInt(reference.split(' ')[1] || '1'),
        verse: parseInt(match[1]) || verseNumber++,
        text: match[2].trim()
      });
    }
    
    // If no verses found, treat entire content as one verse
    if (verses.length === 0) {
      verses.push({
        book_name: reference.split(' ')[0] || 'Unknown',
        book_id: reference.split(' ')[0]?.toLowerCase() || 'unknown',
        chapter: parseInt(reference.split(' ')[1] || '1'),
        verse: 1,
        text: cleanContent
      });
    }
    
    return verses;
  }

  /**
   * Strip HTML tags from content
   */
  private stripHtmlTags(html: string): string {
    return html.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
  }

  /**
   * Check if version is supported by API.Bible
   */
  isVersionSupported(version: string): boolean {
    return Object.hasOwnProperty.call(this.versionMappings, version.toLowerCase());
  }
}

export const apiBibleService = new ApiBibleService();
