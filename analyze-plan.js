// Simple analysis without import issues
const bibleData = [
  {
    name: "History",
    totalVerses: 14394,
    books: [
      { name: "Genesis", chapters: [31, 25, 24, 26, 32, 22, 24, 22, 29, 32, 32, 20, 18, 24, 21, 16, 27, 33, 38, 23, 29, 32, 31, 30, 18, 10, 22, 17, 19, 12, 12, 17] },
      { name: "Exodus", chapters: [22, 25, 22, 31, 23, 30, 25, 32, 35, 29, 10, 51, 22, 31, 27, 36, 16, 27, 25, 26, 36, 31, 33, 18, 40, 37, 21, 43, 46, 38, 18, 35, 23, 35, 35, 38, 29, 31, 43, 38] }
    ]
  },
  {
    name: "Revelation",
    totalVerses: 404,
    books: [
      { name: "Revelation", chapters: [20, 29, 22, 11, 14, 17, 17, 13, 21, 11, 19, 17, 18, 20, 8, 21, 18, 24, 21, 15, 27, 21] }
    ]
  }
];

// Simplified study plan generation for analysis
function generateReadingPortion(section, startVerse, endVerse) {
  const books = [];
  let currentVerse = 1;
  const versesNeeded = endVerse - startVerse + 1;
  let versesCollected = 0;

  for (const book of section.books) {
    const bookVerses = book.chapters.reduce((sum, chapterVerses) => sum + chapterVerses, 0);
    
    if (currentVerse + bookVerses >= startVerse && versesCollected < versesNeeded) {
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

  return { books, versesCount: versesCollected };
}

function getChaptersForVerseRange(book, startVerse, endVerse) {
  const chapters = [];
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

console.log('=== Analyzing when verses are populated ===');

// Test different scenarios
const totalVerses = bibleData.reduce((sum, section) => sum + section.totalVerses, 0);
const versesPerDay = Math.ceil(totalVerses / 365);

console.log(`Total verses: ${totalVerses}, Verses per day: ${versesPerDay}`);

// Day 1 - should start with History
console.log('\n--- Day 1 (History section) ---');
const historySection = bibleData[0];
const day1StartVerse = 1;
const day1EndVerse = Math.ceil((historySection.totalVerses / totalVerses) * versesPerDay);
console.log(`Day 1: verses ${day1StartVerse}-${day1EndVerse} from History`);
const day1Portion = generateReadingPortion(historySection, day1StartVerse, day1EndVerse);
day1Portion.books.forEach(book => {
  console.log(`  ${book.book}: chapters=${JSON.stringify(book.chapters)}, verses=${JSON.stringify(book.verses)}`);
});

// Day 300 - should be later in plan
console.log('\n--- Day 300 (later in plan) ---');
const day300StartVerse = 299 * versesPerDay + 1;
const day300EndVerse = 300 * versesPerDay;
console.log(`Day 300: verses ${day300StartVerse}-${day300EndVerse}`);

// Check if this hits Revelation
const revelationSection = bibleData[1];
if (day300StartVerse <= totalVerses) {
  console.log('This would include Revelation section');
  const revStartInTotal = historySection.totalVerses + 1; // Simplified
  if (day300StartVerse >= revStartInTotal) {
    const revStartVerse = day300StartVerse - revStartInTotal + 1;
    const revEndVerse = Math.min(day300EndVerse - revStartInTotal + 1, revelationSection.totalVerses);
    console.log(`Revelation verses: ${revStartVerse}-${revEndVerse}`);
    const revPortion = generateReadingPortion(revelationSection, revStartVerse, revEndVerse);
    revPortion.books.forEach(book => {
      console.log(`  ${book.book}: chapters=${JSON.stringify(book.chapters)}, verses=${JSON.stringify(book.verses)}`);
    });
  }
}


