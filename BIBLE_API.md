# Bible API Integration Guide

## Overview

This Bible Study Planner now supports multiple Bible API providers for comprehensive version coverage:

- **Primary API (bible-api.com)**: KJV, ASV, WEB, BBE - Full support
- **API.Bible**: 16+ contemporary versions - Premium support with API key
- **Bible Brain**: Additional versions - Free supplementary access

## Supported Bible Versions

### ✅ Fully Available (No API Key Required)
- **KJV** - King James Version (1769)
- **ASV** - American Standard Version (1901) 
- **WEB** - World English Bible
- **BBE** - Bible in Basic English

### 🔑 Premium Versions (API Key Required)
- **NIV** - New International Version
- **ESV** - English Standard Version
- **NLT** - New Living Translation
- **MSG** - The Message
- **NASB** - New American Standard Bible
- **CSB** - Christian Standard Bible
- **AMP** - Amplified Bible
- **NKJV** - New King James Version
- **RSV** - Revised Standard Version
- **NRSV** - New Revised Standard Version
- **CEV** - Contemporary English Version
- **TPT** - The Passion Translation

## Setup Instructions

### 1. Get API.Bible Access (Recommended)

1. Visit [https://scripture.api.bible/](https://scripture.api.bible/)
2. Sign up for a free account (1,000 requests/day)
3. Get your API key from the dashboard
4. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
5. Add your API key:
   ```env
   NEXT_PUBLIC_API_BIBLE_KEY=your_api_key_here
   ```

### 2. Optional: Bible Brain Access

1. Visit [https://4.dbt.io/docs](https://4.dbt.io/docs)
2. Register for additional free access
3. Add to `.env.local`:
   ```env
   NEXT_PUBLIC_BIBLE_BRAIN_KEY=your_bible_brain_key_here
   ```

## Features

### Intelligent Provider Fallback
The system automatically tries multiple providers in order of preference:
1. **API.Bible** for contemporary versions (NIV, ESV, NLT, etc.)
2. **Primary API** for classic versions (KJV, ASV, WEB, BBE)
3. **Bible Brain** for additional coverage
4. **Graceful fallback** with helpful messages

### Version Availability Indicators
- ✅ **Available**: Full text access
- ⚡ **Limited**: Partial or sample access
- 🔄 **Coming Soon**: Expanding access

### Enhanced User Experience
- Real-time availability status
- Organized version categories
- Popular version highlighting
- Responsive loading states
- Comprehensive error handling

## Usage

```typescript
import { bibleApiService } from '@/services/bibleApi';

// Get Bible passage with automatic provider selection
const passage = await bibleApiService.getPassage('John 3:16', 'niv');

// Check version availability
const status = bibleApiService.getProviderStatus('niv');
console.log(status.hasSupport); // true/false

// Get reading portion for study plan
const reading = await bibleApiService.getReadingPortionText(
  'Matthew', 
  [1, 2], // chapters 1-2
  undefined, 
  'esv'
);
```

## Development

### Testing API Integration

```bash
# Test Bible API service
node test-bible-api.js

# Check version availability
npm run test
```

### Adding New Versions

1. Update `BIBLE_VERSIONS` in `src/types/bibleApi.ts`
2. Add version mapping in `src/services/apiBibleService.ts`
3. Update provider priority in `src/services/bibleApi.ts`
4. Test availability and functionality

## API Limits & Considerations

### API.Bible Free Tier
- 1,000 requests per day
- Rate limiting: ~1 request per second
- 2,500+ versions available
- Commercial use allowed

### Bible Brain
- Free access to many versions
- No API key required for basic use
- Multimedia content available
- Good for supplementary access

### Primary API (bible-api.com)
- Unlimited free access
- Limited to 4 classic versions
- Fast and reliable
- Public domain content

## Error Handling

The system provides graceful degradation:
- **Network issues**: Retries with different providers
- **Version unavailable**: Clear user messaging
- **API limits**: Intelligent caching and fallback
- **Authentication errors**: Helpful setup guidance

## Contributing

To add support for new Bible versions:
1. Research API availability and terms
2. Add version metadata to types
3. Implement provider-specific handling
4. Update documentation and tests
5. Submit pull request with examples

## License

This integration respects all Bible translation copyrights and API terms of service. Bible text remains property of respective publishers and translation committees.
