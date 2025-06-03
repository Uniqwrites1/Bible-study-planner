// Test Bible API chapter range handling
console.log('Testing Bible API chapter range handling...\n');

async function testChapterRange() {
  const testCases = [
    'Genesis 1-3',
    'Psalm 1-3', 
    'Matthew 1-2',
    'Genesis 1',
    'Genesis 2'
  ];
  
  for (const reference of testCases) {
    try {
      console.log(`\n=== Testing: ${reference} ===`);
      const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=kjv`;
      console.log(`URL: ${url}`);
      
      const response = await fetch(url);
      if (!response.ok) {
        console.log(`❌ HTTP Error: ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      console.log(`✅ Reference: ${data.reference}`);
      console.log(`📖 Total verses: ${data.verses ? data.verses.length : 0}`);
      
      if (data.verses && data.verses.length > 0) {
        // Check which chapters are included
        const chapters = [...new Set(data.verses.map(v => v.chapter))];
        console.log(`📚 Chapters included: ${chapters.join(', ')}`);
        
        // Show first and last verse
        const firstVerse = data.verses[0];
        const lastVerse = data.verses[data.verses.length - 1];
        console.log(`🔸 First verse: Chapter ${firstVerse.chapter}, Verse ${firstVerse.verse}`);
        console.log(`🔸 Last verse: Chapter ${lastVerse.chapter}, Verse ${lastVerse.verse}`);
        
        // Sample text
        console.log(`📝 Sample text: "${firstVerse.text.substring(0, 80)}..."`);
      }
      
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

testChapterRange().then(() => {
  console.log('\n🏁 Test completed!');
}).catch(console.error);
