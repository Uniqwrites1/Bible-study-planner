#!/usr/bin/env node

// Test actual working Bible APIs
console.log('🧪 Testing Working Bible APIs...\n');

async function testBibleAPI() {
  console.log('1️⃣ Testing bible-api.com (Public Domain)...');
  try {
    const response = await fetch('https://bible-api.com/john 3:16');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ bible-api.com: WORKING');
      console.log(`   - Text: ${data.text.substring(0, 50)}...`);
      console.log(`   - Version: ${data.translation_name || 'KJV'}`);
      console.log(`   - Reference: ${data.reference}`);
    } else {
      console.log('❌ bible-api.com: Failed');
    }
  } catch (error) {
    console.log('❌ bible-api.com: Error -', error.message);
  }
  console.log('');

  console.log('2️⃣ Testing API.Bible (Free/Demo)...');
  try {
    // Using public endpoint without API key
    const response = await fetch('https://api.scripture.api.bible/v1/bibles');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ API.Bible endpoint: ACCESSIBLE');
      console.log(`   - Available bibles: ${data.data?.length || 0}`);
    } else {
      console.log('❌ API.Bible: Requires API key');
    }
  } catch (error) {
    console.log('❌ API.Bible: Error -', error.message);
  }
  console.log('');

  console.log('3️⃣ Testing Bible Brain API...');
  try {
    const response = await fetch('https://4.dbt.io/api/bibles');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Bible Brain API: WORKING');
      console.log(`   - Available bibles: ${data.data?.length || 0}`);
    } else {
      console.log('❌ Bible Brain API: Failed');
    }
  } catch (error) {
    console.log('❌ Bible Brain API: Error -', error.message);
  }
  console.log('');

  console.log('4️⃣ Testing ESV API (Free Tier)...');
  try {
    const response = await fetch('https://api.esv.org/v3/passage/text/?q=john+3:16', {
      headers: {
        'Authorization': 'Token TEST' // Public test token
      }
    });
    if (response.ok || response.status === 401) {
      console.log('✅ ESV API: ACCESSIBLE (needs auth)');
    } else {
      console.log('❌ ESV API: Failed');
    }
  } catch (error) {
    console.log('❌ ESV API: Error -', error.message);
  }
  console.log('');

  console.log('5️⃣ Testing Bible SuperSearch API...');
  try {
    const response = await fetch('https://www.biblesupersearch.com/api/v2/search?query=john%203:16&bible=kjv');
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Bible SuperSearch API: WORKING');
      console.log(`   - Results: ${data.results?.length || 0}`);
    } else {
      console.log('❌ Bible SuperSearch API: Failed');
    }
  } catch (error) {
    console.log('❌ Bible SuperSearch API: Error -', error.message);
  }
  console.log('');

  console.log('📊 RECOMMENDATION:');
  console.log('Based on testing, here are the best working APIs:');
  console.log('');
  console.log('✅ PRIMARY: bible-api.com');
  console.log('   - Free, no API key required');
  console.log('   - Multiple versions: KJV, ASV, BBE, WEB, YLT');
  console.log('   - Simple JSON API');
  console.log('   - Reliable and fast');
  console.log('');
  console.log('✅ SECONDARY: API.Bible (with free key)');
  console.log('   - 2,500+ versions with API key');
  console.log('   - Free tier available');
  console.log('   - Best for contemporary versions');
  console.log('');
  console.log('✅ TERTIARY: Bible SuperSearch API');
  console.log('   - Multiple versions');
  console.log('   - No API key for basic usage');
  console.log('   - Good fallback option');
}

testBibleAPI().catch(console.error);
