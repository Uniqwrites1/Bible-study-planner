// Test script to verify API.Bible key and available versions
async function testApiKey() {
  const apiKey = '4f0d5dd0a9693a2f1a6a4dc880f58fb8';
  const baseUrl = 'https://api.scripture.api.bible/v1';
  
  console.log('🔑 Testing API.Bible Key...\n');
  console.log(`API Key: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}`);
  console.log(`Base URL: ${baseUrl}\n`);
  
  // Test 1: Get available Bibles
  try {
    console.log('📚 Testing: Get Available Bibles...');
    const response = await fetch(`${baseUrl}/bibles`, {
      headers: {
        'api-key': apiKey,
        'Accept': 'application/json'
      }
    });
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      const englishBibles = data.data.filter(bible => 
        bible.language.id === 'eng' && bible.type !== 'audiobible'
      );
      
      console.log(`✅ SUCCESS: Found ${englishBibles.length} English text Bibles`);
      console.log('\n📖 Available English Versions:');
      englishBibles.slice(0, 10).forEach(bible => {
        console.log(`   • ${bible.name} (${bible.nameLocal}) - ID: ${bible.id}`);
      });
      
      if (englishBibles.length > 10) {
        console.log(`   ... and ${englishBibles.length - 10} more`);
      }
      
      // Look for NIV specifically
      const niv = englishBibles.find(bible => 
        bible.name.toLowerCase().includes('international') ||
        bible.nameLocal.toLowerCase().includes('niv')
      );
      
      if (niv) {
        console.log(`\n🎯 Found NIV: ${niv.name} (ID: ${niv.id})`);
        await testSpecificPassage(apiKey, niv.id);
      } else {
        console.log('\n❌ NIV not found in available versions');
        // Test with first available version
        if (englishBibles.length > 0) {
          console.log(`\n🔄 Testing with first available version: ${englishBibles[0].name}`);
          await testSpecificPassage(apiKey, englishBibles[0].id);
        }
      }
      
    } else {
      const errorText = await response.text();
      console.log(`❌ FAILED: ${errorText}`);
      
      if (response.status === 403) {
        console.log('\n🚨 403 Forbidden Error - Possible causes:');
        console.log('   • API key is invalid or expired');
        console.log('   • API key doesn\'t have proper permissions');
        console.log('   • Account needs verification');
        console.log('   • Rate limit exceeded');
      }
    }
    
  } catch (error) {
    console.log(`❌ Network Error: ${error.message}`);
  }
}

async function testSpecificPassage(apiKey, bibleId) {
  try {
    console.log(`\n📖 Testing passage with Bible ID: ${bibleId}`);
    const response = await fetch(
      `https://api.scripture.api.bible/v1/bibles/${bibleId}/passages/JHN.3.16?content-type=text&include-notes=false&include-titles=true&include-chapter-numbers=false&include-verse-numbers=true&include-verse-spans=false&use-org-id=false`,
      {
        headers: {
          'api-key': apiKey,
          'Accept': 'application/json'
        }
      }
    );
    
    console.log(`Status: ${response.status} ${response.statusText}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log(`✅ SUCCESS: ${data.data.reference}`);
      console.log(`Text preview: "${data.data.content.substring(0, 100)}..."`);
    } else {
      const errorText = await response.text();
      console.log(`❌ Passage failed: ${errorText}`);
    }
  } catch (error) {
    console.log(`❌ Passage error: ${error.message}`);
  }
}

testApiKey().catch(console.error);
