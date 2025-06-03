// Test script to check all available versions from bible-api.com
async function testFreeVersions() {
  console.log('🧪 Testing All Free Bible Versions from bible-api.com\n');
  
  // Common versions that bible-api.com supports
  const versions = [
    'kjv', 'web', 'asv', 'bbe', 'ylt',
    'akjv', 'basicenglish', 'darby', 'douayrheims',
    'emphbbl', 'geneva1599', 'jubilee2000', 'leb',
    'nasb', 'net', 'nheb', 'rotherham', 'webster',
    'webus', 'worrell', 'youngs'
  ];
  
  const reference = 'John 3:16';
  const workingVersions = [];
  const failedVersions = [];
  
  console.log(`Testing reference: ${reference}\n`);
  
  for (const version of versions) {
    try {
      const url = `https://bible-api.com/${encodeURIComponent(reference)}?translation=${version}`;
      
      const response = await fetch(url);
      const data = await response.json();
      
      if (data && data.text && data.text.trim()) {
        workingVersions.push({
          id: version,
          name: data.translation_name || version.toUpperCase(),
          text: data.text.substring(0, 80) + '...'
        });
        console.log(`✅ ${version.toUpperCase()}: ${data.translation_name || version}`);
      } else {
        failedVersions.push(version);
        console.log(`❌ ${version.toUpperCase()}: No content`);
      }
    } catch (error) {
      failedVersions.push(version);
      console.log(`❌ ${version.toUpperCase()}: ${error.message}`);
    }
  }
  
  console.log('\n📊 SUMMARY:');
  console.log(`✅ Working versions: ${workingVersions.length}`);
  console.log(`❌ Failed versions: ${failedVersions.length}`);
  
  console.log('\n📝 WORKING VERSIONS FOR CODE:');
  workingVersions.forEach(version => {
    console.log(`  { id: '${version.id}', name: '${version.name}', category: 'Free & Working', apiProvider: 'bible-api.com', requiresApiKey: false, working: true },`);
  });
}

testFreeVersions().catch(console.error);
