export interface BibleSection {
  name: string;
  books: BibleBook[];
  totalVerses: number;
}

export interface BibleBook {
  name: string;
  chapters: number[];
}

export interface StudyPlan {
  duration: number;
  sections: BibleSection[];
  dailyPlan: DailyReading[];
}

export interface DailyReading {
  day: number;
  sections: {
    [sectionName: string]: ReadingPortion;
  };
  completed: boolean;
}

export interface SectionProgress {
  [sectionName: string]: boolean;
}

export interface DayProgress {
  [day: number]: SectionProgress;
}

export interface ReadingPortion {
  books: {
    book: string;
    chapters?: number[];
    verses?: string;
  }[];
  versesCount: number;
}
