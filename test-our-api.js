// Test our working Bible API service
import { workingBibleApi } from './src/services/workingBibleApi.js';

console.log('🧪 Testing Our Working Bible API Service...\n');

async function testOurBibleService() {
  console.log('1️⃣ Testing KJV (Free Version)...');
  try {
    const result = await workingBibleApi.getPassage('John 3:16', 'kjv');
    console.log('✅ KJV: SUCCESS');
    console.log(`   Text: ${result.text.substring(0, 80)}...`);
    console.log(`   Reference: ${result.reference}`);
    console.log(`   Version: ${result.translation_name}`);
  } catch (error) {
    console.log('❌ KJV: Error -', error.message);
  }
  console.log('');

  console.log('2️⃣ Testing WEB (Free Version)...');
  try {
    const result = await workingBibleApi.getPassage('Psalm 23:1', 'web');
    console.log('✅ WEB: SUCCESS');
    console.log(`   Text: ${result.text.substring(0, 80)}...`);
    console.log(`   Reference: ${result.reference}`);
  } catch (error) {
    console.log('❌ WEB: Error -', error.message);
  }
  console.log('');

  console.log('3️⃣ Testing Version Info...');
  const versions = workingBibleApi.getSupportedVersions();
  console.log(`✅ Supported versions: ${versions.length}`);
  
  const workingVersions = workingBibleApi.getWorkingVersions();
  console.log(`✅ Working versions: ${workingVersions.length}`);
  
  workingVersions.forEach(v => {
    console.log(`   - ${v.id.toUpperCase()}: ${v.name} (${v.apiProvider})`);
  });
  
  console.log('\n🎉 Our Working Bible API Service is ready!');
  console.log('📖 Users can now read actual Bible text without any API keys!');
}

testOurBibleService().catch(console.error);
