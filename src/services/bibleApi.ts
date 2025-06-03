import { BiblePassage, BibleChapter, BibleVersion, BOOK_MAPPINGS, BIBLE_VERSIONS } from '@/types/bibleApi';

class BibleApiService {
  private baseUrl = 'https://bible-api.com';
  private cdnUrl = 'https://cdn.jsdelivr.net/gh/wldeh/bible-api/bibles';

  /**
   * Get available Bible versions
   */
  getVersions(): BibleVersion[] {
    return BIBLE_VERSIONS;
  }

  /**
   * Get a Bible passage using bible-api.com
   */
  async getPassage(reference: string, version: string = 'kjv'): Promise<BiblePassage | null> {
    try {
      const url = `${this.baseUrl}/${encodeURIComponent(reference)}?translation=${version}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching Bible passage:', error);
      return null;
    }
  }

  /**
   * Get a specific chapter using the CDN API
   */
  async getChapter(book: string, chapter: number, version: string = 'kjv'): Promise<BibleChapter | null> {
    try {
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
    } catch (error) {
      console.error('Error fetching Bible chapter:', error);
      return null;
    }
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
  }
  /**
   * Get Bible text for a reading portion
   */
  async getReadingPortionText(bookName: string, chapters?: number[], verses?: string, version: string = 'kjv'): Promise<BiblePassage | null> {
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
      return null;
    }
  }
}

export const bibleApiService = new BibleApiService();
