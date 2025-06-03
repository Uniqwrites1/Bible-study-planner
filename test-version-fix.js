// Test script to verify Bible version selection is working correctly

// Test different versions with bible-api.com
async function testBibleVersions() {
  console.log('🧪 Testing Bible Version Selection Fix\n');
  
  const versions = ['kjv', 'web', 'asv', 'bbe'];
  const reference = 'John 3:16';
  
  console.log(`Testing reference: ${reference}\n`);
  
  for (const version of versions) {
    try {
      const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${version}`;
      console.log(`📖 Testing ${version.toUpperCase()}...`);
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.text) {
        // Get first 80 characters of the text
        const preview = data.text.substring(0, 80) + (data.text.length > 80 ? '...' : '');
        console.log(`   ✅ SUCCESS: "${preview}"`);
        console.log(`   📚 Translation: ${data.translation_name || version.toUpperCase()}`);
      } else {
        console.log(`   ❌ FAILED: No text returned`);
      }
    } catch (error) {
      console.log(`   ❌ ERROR: ${error.message}`);
    }
    console.log('');
  }
  
  console.log('🎯 EXPECTED RESULTS:');
  console.log('- Each version should return DIFFERENT text');
  console.log('- KJV: "For God so loved the world, that he gave his only begotten Son..."');
  console.log('- WEB: "For God so loved the world, that he gave his one and only Son..."');
  console.log('- ASV: "For God so loved the world, that he gave his only begotten Son..."');
  console.log('- BBE: "For God had such love for the world that he gave his only Son..."');
  console.log('');
  console.log('💡 If all versions show the same text, there\'s still an issue!');
}

testBibleVersions().catch(console.error);
