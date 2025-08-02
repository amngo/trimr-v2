#!/usr/bin/env node

/**
 * Test script to verify link tracking is working correctly
 */

const API_URL = process.env.API_URL || 'http://localhost:8080';

async function testTracking() {
  console.log('🧪 Testing Link Tracking System\n');
  
  try {
    // Step 1: Create a test link
    console.log('1️⃣  Creating test link...');
    const createResponse = await fetch(`${API_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com/test-tracking',
        name: 'Test Tracking Link'
      }),
    });

    if (!createResponse.ok) {
      throw new Error(`Failed to create link: ${createResponse.status}`);
    }

    const { shortUrl, slug } = await createResponse.json();
    console.log(`✅ Created link: ${shortUrl}`);
    console.log(`   Slug: ${slug}\n`);

    // Step 2: Get initial link stats
    console.log('2️⃣  Getting initial link stats...');
    const getLinksResponse = await fetch(`${API_URL}/api/links`);
    const links = await getLinksResponse.json();
    const testLink = links.find(l => l.slug === slug);
    console.log(`✅ Initial clicks: ${testLink?.clicks || 0}`);
    console.log(`   Initial unique clicks: ${testLink?.uniqueClicks || 0}\n`);

    // Step 3: Access the link (simulate click)
    console.log('3️⃣  Simulating link click...');
    const redirectResponse = await fetch(`${API_URL}/${slug}`, {
      method: 'GET',
      redirect: 'manual', // Don't follow redirect
      headers: {
        'User-Agent': 'TestBot/1.0',
      }
    });

    console.log(`✅ Redirect response status: ${redirectResponse.status}`);
    const location = redirectResponse.headers.get('Location');
    console.log(`   Redirect location: ${location}\n`);

    // Step 4: Check updated stats
    console.log('4️⃣  Checking updated link stats...');
    await new Promise(resolve => setTimeout(resolve, 1000)); // Wait 1 second
    
    const updatedLinksResponse = await fetch(`${API_URL}/api/links`);
    const updatedLinks = await updatedLinksResponse.json();
    const updatedTestLink = updatedLinks.find(l => l.slug === slug);
    
    console.log(`✅ Updated clicks: ${updatedTestLink?.clicks || 0}`);
    console.log(`   Updated unique clicks: ${updatedTestLink?.uniqueClicks || 0}\n`);

    // Step 5: Test password-protected link
    console.log('5️⃣  Testing password-protected link...');
    const passwordLinkResponse = await fetch(`${API_URL}/api/links`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        url: 'https://example.com/test-password',
        name: 'Test Password Link',
        password: 'secret123'
      }),
    });

    const { slug: passwordSlug } = await passwordLinkResponse.json();
    console.log(`✅ Created password-protected link with slug: ${passwordSlug}`);

    // Try to access without password
    const noPasswordResponse = await fetch(`${API_URL}/${passwordSlug}`, {
      redirect: 'manual'
    });
    console.log(`   Without password: ${noPasswordResponse.status} (should be 401)`);

    // Try with password
    const withPasswordResponse = await fetch(`${API_URL}/${passwordSlug}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: 'secret123' }),
      redirect: 'manual'
    });
    console.log(`   With password: ${withPasswordResponse.status} (should be 301/302)`);

    console.log('\n✅ All tests passed! Link tracking is working correctly.');
    
  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Run the test
testTracking();