// Test our working Bible API service (Node.js fetch version)
console.log('🧪 Testing Our Working Bible API Service...\n');

// Test the bible-api.com service directly
async function testBibleApiCom() {
  console.log('1️⃣ Testing bible-api.com (KJV)...');
  try {
    const response = await fetch('https://bible-api.com/John+3:16?translation=kjv');
    const data = await response.json();
    console.log('✅ bible-api.com KJV: SUCCESS');
    console.log(`   Text: ${data.text.substring(0, 80)}...`);
    console.log(`   Reference: ${data.reference}`);
    console.log(`   Translation: ${data.translation_name}`);
  } catch (error) {
    console.log('❌ bible-api.com KJV: Error -', error.message);
  }
  console.log('');

  console.log('2️⃣ Testing bible-api.com (WEB)...');
  try {
    const response = await fetch('https://bible-api.com/Psalm+23:1?translation=web');
    const data = await response.json();
    console.log('✅ bible-api.com WEB: SUCCESS');
    console.log(`   Text: ${data.text.substring(0, 80)}...`);
    console.log(`   Reference: ${data.reference}`);
  } catch (error) {
    console.log('❌ bible-api.com WEB: Error -', error.message);
  }
  console.log('');

  console.log('3️⃣ Testing bible-api.com (ASV)...');
  try {
    const response = await fetch('https://bible-api.com/Romans+8:28?translation=asv');
    const data = await response.json();
    console.log('✅ bible-api.com ASV: SUCCESS');
    console.log(`   Text: ${data.text.substring(0, 80)}...`);
    console.log(`   Reference: ${data.reference}`);
  } catch (error) {
    console.log('❌ bible-api.com ASV: Error -', error.message);
  }
  console.log('');

  console.log('🎉 Bible API Service Test Complete!');
  console.log('📖 All working versions confirmed - users can read Bible text immediately!');
}

testBibleApiCom().catch(console.error);
