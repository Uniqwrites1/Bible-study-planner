// Bible API types
export interface BibleVerse {
  book_name: string;
  book_id: string;
  chapter: number;
  verse: number;
  text: string;
}

export interface BiblePassage {
  reference: string;
  verses: BibleVerse[];
  text: string;
  translation_id: string;
  translation_name: string;
  translation_note: string;
}

export interface BibleVersion {
  id: string;
  name: string;
  abbreviation: string;
  language: string;
  description: string;
}

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: Array<{
    verse: number;
    text: string;
  }>;
}

// Book name mappings for different APIs
export const BOOK_MAPPINGS: { [key: string]: string } = {
  // Old Testament
  'Genesis': 'gen',
  'Exodus': 'exo',
  'Leviticus': 'lev',
  'Numbers': 'num',
  'Deuteronomy': 'deu',
  'Joshua': 'jos',
  'Judges': 'jdg',
  'Ruth': 'rut',
  '1 Samuel': '1sa',
  '2 Samuel': '2sa',
  '1 Kings': '1ki',
  '2 Kings': '2ki',
  '1 Chronicles': '1ch',
  '2 Chronicles': '2ch',
  'Ezra': 'ezr',
  'Nehemiah': 'neh',
  'Esther': 'est',
  'Job': 'job',
  'Psalms': 'psa',
  'Proverbs': 'pro',
  'Ecclesiastes': 'ecc',
  'Song of Songs': 'sng',
  'Isaiah': 'isa',
  'Jeremiah': 'jer',
  'Lamentations': 'lam',
  'Ezekiel': 'ezk',
  'Daniel': 'dan',
  'Hosea': 'hos',
  'Joel': 'jol',
  'Amos': 'amo',
  'Obadiah': 'oba',
  'Jonah': 'jon',
  'Micah': 'mic',
  'Nahum': 'nam',
  'Habakkuk': 'hab',
  'Zephaniah': 'zep',
  'Haggai': 'hag',
  'Zechariah': 'zec',
  'Malachi': 'mal',
  
  // New Testament
  'Matthew': 'mat',
  'Mark': 'mrk',
  'Luke': 'luk',
  'John': 'jhn',
  'Acts': 'act',
  'Romans': 'rom',
  '1 Corinthians': '1co',
  '2 Corinthians': '2co',
  'Galatians': 'gal',
  'Ephesians': 'eph',
  'Philippians': 'php',
  'Colossians': 'col',
  '1 Thessalonians': '1th',
  '2 Thessalonians': '2th',
  '1 Timothy': '1ti',
  '2 Timothy': '2ti',
  'Titus': 'tit',
  'Philemon': 'phm',
  'Hebrews': 'heb',
  'James': 'jas',
  '1 Peter': '1pe',
  '2 Peter': '2pe',
  '1 John': '1jn',
  '2 John': '2jn',
  '3 John': '3jn',
  'Jude': 'jud',
  'Revelation': 'rev'
};

export const BIBLE_VERSIONS: BibleVersion[] = [
  // Classic Translations
  {
    id: 'kjv',
    name: 'King James Version',
    abbreviation: 'KJV',
    language: 'English',
    description: 'The classic 1769 King James Version'
  },
  {
    id: 'asv',
    name: 'American Standard Version',
    abbreviation: 'ASV',
    language: 'English',
    description: 'The 1901 American Standard Version'
  },
  
  // Contemporary Translations
  {
    id: 'niv',
    name: 'New International Version',
    abbreviation: 'NIV',
    language: 'English',
    description: 'Popular modern translation for clarity and accuracy'
  },
  {
    id: 'esv',
    name: 'English Standard Version',
    abbreviation: 'ESV',
    language: 'English',
    description: 'Literal accuracy with readable English'
  },
  {
    id: 'nlt',
    name: 'New Living Translation',
    abbreviation: 'NLT',
    language: 'English',
    description: 'Thought-for-thought translation for clarity'
  },
  {
    id: 'msg',
    name: 'The Message',
    abbreviation: 'MSG',
    language: 'English',
    description: 'Contemporary paraphrase by Eugene Peterson'
  },
  {
    id: 'nasb',
    name: 'New American Standard Bible',
    abbreviation: 'NASB',
    language: 'English',
    description: 'Word-for-word literal translation'
  },
  {
    id: 'csb',
    name: 'Christian Standard Bible',
    abbreviation: 'CSB',
    language: 'English',
    description: 'Balance of accuracy and readability'
  },
  
  // Modern Paraphrases
  {
    id: 'amp',
    name: 'Amplified Bible',
    abbreviation: 'AMP',
    language: 'English',
    description: 'Expanded meanings and clarifications'
  },
  {
    id: 'tpt',
    name: 'The Passion Translation',
    abbreviation: 'TPT',
    language: 'English',
    description: 'Heart-level translation emphasizing God\'s love'
  },
  {
    id: 'nkjv',
    name: 'New King James Version',
    abbreviation: 'NKJV',
    language: 'English',
    description: 'Updated KJV with modern English'
  },
  
  // Study and Reference
  {
    id: 'rsv',
    name: 'Revised Standard Version',
    abbreviation: 'RSV',
    language: 'English',
    description: 'Scholarly revision of ASV'
  },
  {
    id: 'nrsv',
    name: 'New Revised Standard Version',
    abbreviation: 'NRSV',
    language: 'English',
    description: 'Gender-inclusive scholarly translation'
  },
  
  // Simple English
  {
    id: 'web',
    name: 'World English Bible',
    abbreviation: 'WEB',
    language: 'English',
    description: 'A modern public domain translation'
  },
  {
    id: 'bbe',
    name: 'Bible in Basic English',
    abbreviation: 'BBE',
    language: 'English',
    description: 'A simple English translation'
  },
  {
    id: 'cev',
    name: 'Contemporary English Version',
    abbreviation: 'CEV',
    language: 'English',
    description: 'Clear and natural English'
  }
];
