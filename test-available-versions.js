// Quick test to see what Bible versions are actually available with the API key
async function checkAvailableVersions() {
  const apiKey = '4f0d5dd0a9693a2f1a6a4dc880f58fb8';
  
  try {
    console.log('🔍 Checking what Bible versions are available...\n');
    
    const response = await fetch('https://api.scripture.api.bible/v1/bibles', {
      headers: {
        'api-key': apiKey,
        'Accept': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      const englishBibles = data.data.filter(bible => 
        bible.language.id === 'eng' && bible.type !== 'audiobible'
      );
      
      console.log('📚 English Text Bibles Available:');
      console.log('='.repeat(80));
      
      // Sort by name for better readability
      englishBibles
        .sort((a, b) => a.name.localeCompare(b.name))
        .forEach((bible, index) => {
          const name = bible.name.padEnd(50, ' ');
          const id = bible.id;
          console.log(`${(index + 1).toString().padStart(2, ' ')}. ${name} | ${id}`);
        });
      
      console.log('='.repeat(80));
      console.log(`Total: ${englishBibles.length} versions available\n`);
      
      // Test a specific passage with a few versions
      console.log('🧪 Testing John 3:16 with first 3 versions...\n');
      
      for (let i = 0; i < Math.min(3, englishBibles.length); i++) {
        const bible = englishBibles[i];
        await testPassage(apiKey, bible.id, bible.name);
      }
      
    } else {
      console.log(`❌ Failed to get versions: ${response.status} ${response.statusText}`);
    }
    
  } catch (error) {
    console.log(`❌ Error: ${error.message}`);
  }
}

async function testPassage(apiKey, bibleId, bibleName) {
  try {
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/JHN.3.16?content-type=text&include-notes=false&include-titles=false&include-chapter-numbers=false&include-verse-numbers=false&include-verse-spans=false&use-org-id=false`,
      {
        headers: {
          'api-key': apiKey,
          'Accept': 'application/json'
        }
      }
    );
    
    if (response.ok) {
      const data = await response.json();
      const text = data.data.content.replace(/\n/g, ' ').substring(0, 100);
      console.log(`✅ ${bibleName}`);
      console.log(`   "${text}..."`);
      console.log(`   Bible ID: ${bibleId}\n`);
    } else {
      console.log(`❌ ${bibleName} (${bibleId}): ${response.status} ${response.statusText}\n`);
    }
  } catch (error) {
    console.log(`❌ ${bibleName}: ${error.message}\n`);
  }
}

checkAvailableVersions().catch(console.error);
