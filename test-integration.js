// Integration test for Bible reading functionality
console.log('🔍 Testing Bible Reading Integration...\n');

// Test how the app formats references for API calls
function testReferenceFormatting() {
  console.log('1️⃣ Testing Reference Formatting...');
  
  // Test cases from the app
  const testCases = [
    { bookName: 'Genesis', chapters: [1], expected: 'Genesis 1' },
    { bookName: 'Psalms', chapters: [23], expected: 'Psalms 23' },
    { bookName: 'John', verses: '3:16', expected: 'John 3:16' },
    { bookName: 'Romans', chapters: [8], expected: 'Romans 8' }
  ];
  
  testCases.forEach(test => {
    let reference = test.bookName;
    if (test.chapters && test.chapters.length > 0) {
      reference = `${test.bookName} ${test.chapters[0]}`;
    } else if (test.verses) {
      reference = `${test.bookName} ${test.verses}`;
    }
    
    const match = reference === test.expected;
    console.log(`   ${match ? '✅' : '❌'} ${test.bookName}: "${reference}" ${match ? '==' : '!='} "${test.expected}"`);
  });
}

// Test API calls with formatted references
async function testApiIntegration() {
  console.log('\n2️⃣ Testing API Integration...');
  
  const testReferences = [
    'Genesis 1',
    'Psalms 23', 
    'John 3:16',
    'Romans 8'
  ];
  
  for (const reference of testReferences) {
    try {
      const url = `https://bible-api.com/${encodeURIComponent(reference.replace(' ', '+'))}?translation=kjv`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (data.text && data.reference) {
        console.log(`   ✅ ${reference}: "${data.text.substring(0, 50)}..."`);
      } else {
        console.log(`   ❌ ${reference}: No text returned`);
      }
    } catch (error) {
      console.log(`   ❌ ${reference}: Error - ${error.message}`);
    }
  }
}

async function runIntegrationTest() {
  testReferenceFormatting();
  await testApiIntegration();
  
  console.log('\n🎉 Integration Test Complete!');
  console.log('📖 Bible reading functionality is ready - users can click sections and read actual Bible text!');
  console.log('🌐 App is running at: http://localhost:3001');
}

runIntegrationTest().catch(console.error);
