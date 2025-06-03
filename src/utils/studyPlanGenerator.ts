import { bibleData } from '@/data/bibleData';
import { StudyPlan, DailyReading, ReadingPortion, BibleSection, BibleBook, DayProgress } from '@/types/bible';

export function generateStudyPlan(duration: number): StudyPlan {
  const totalVerses = bibleData.reduce((sum, section) => sum + section.totalVerses, 0);
  const versesPerDay = Math.ceil(totalVerses / duration);

  const dailyPlan: DailyReading[] = [];

  for (let day = 1; day <= duration; day++) {
    const dailyReading: DailyReading = {
      day,
      sections: {},
      completed: false
    };

    // Calculate verses per section per day based on proportional distribution
    bibleData.forEach(section => {
      const sectionVersesPerDay = Math.ceil((section.totalVerses / totalVerses) * versesPerDay);
      const startVerse = (day - 1) * sectionVersesPerDay + 1;
      const endVerse = Math.min(day * sectionVersesPerDay, section.totalVerses);

      if (startVerse <= section.totalVerses) {
        const portion = generateReadingPortion(section, startVerse, Math.min(endVerse, section.totalVerses));
        if (portion.versesCount > 0) {
          dailyReading.sections[section.name] = portion;
        }
      }
    });

    dailyPlan.push(dailyReading);
  }

  return {
    duration,
    sections: bibleData,
    dailyPlan
  };
}

function generateReadingPortion(section: BibleSection, startVerse: number, endVerse: number): ReadingPortion {
  const books: { book: string; chapters?: number[]; verses?: string }[] = [];
  let currentVerse = 1;
  const versesNeeded = endVerse - startVerse + 1;
  let versesCollected = 0;

  for (const book of section.books) {
    const bookVerses = book.chapters.reduce((sum: number, chapterVerses: number) => sum + chapterVerses, 0);
    
    if (currentVerse + bookVerses >= startVerse && versesCollected < versesNeeded) {
      // This book contains verses we need
      const bookStartVerse = Math.max(1, startVerse - currentVerse + 1);
      const bookEndVerse = Math.min(bookVerses, endVerse - currentVerse + 1);
      
      if (bookStartVerse <= bookEndVerse) {
        const chapters = getChaptersForVerseRange(book, bookStartVerse, bookEndVerse);
        books.push({
          book: book.name,
          chapters: chapters.length > 0 ? chapters : undefined,
          verses: `${bookStartVerse}-${bookEndVerse}`
        });
        
        versesCollected += bookEndVerse - bookStartVerse + 1;
      }
    }
    
    currentVerse += bookVerses;
    
    if (currentVerse > endVerse) break;
  }

  return {
    books,
    versesCount: versesCollected
  };
}

function getChaptersForVerseRange(book: BibleBook, startVerse: number, endVerse: number): number[] {
  const chapters: number[] = [];
  let currentVerse = 1;
  
  for (let i = 0; i < book.chapters.length; i++) {
    const chapterVerses = book.chapters[i];
    const chapterStart = currentVerse;
    const chapterEnd = currentVerse + chapterVerses - 1;
    
    if (chapterEnd >= startVerse && chapterStart <= endVerse) {
      chapters.push(i + 1);
    }
    
    currentVerse += chapterVerses;
    if (currentVerse > endVerse) break;
  }
  
  return chapters;
}

export function saveSectionProgress(planId: string, day: number, sectionName: string, completed: boolean): void {
  const savedPlans = JSON.parse(localStorage.getItem('bible-study-section-progress') || '{}');
  if (!savedPlans[planId]) {
    savedPlans[planId] = {};
  }
  if (!savedPlans[planId][day]) {
    savedPlans[planId][day] = {};
  }
  savedPlans[planId][day][sectionName] = completed;
  localStorage.setItem('bible-study-section-progress', JSON.stringify(savedPlans));
}

export function loadSectionProgress(planId: string): DayProgress {
  const savedPlans = JSON.parse(localStorage.getItem('bible-study-section-progress') || '{}');
  return savedPlans[planId] || {};
}

export function saveProgress(planId: string, day: number, completed: boolean): void {
  const savedPlans = JSON.parse(localStorage.getItem('bible-study-plans') || '{}');
  if (!savedPlans[planId]) {
    savedPlans[planId] = {};
  }
  savedPlans[planId][day] = completed;
  localStorage.setItem('bible-study-plans', JSON.stringify(savedPlans));
}

export function loadProgress(planId: string): { [day: number]: boolean } {
  const savedPlans = JSON.parse(localStorage.getItem('bible-study-plans') || '{}');
  return savedPlans[planId] || {};
}
