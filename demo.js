// Demo script to test the Trending Token Tracker API endpoints
// Run this after starting the development server

const BASE_URL = 'http://localhost:3000';

async function testTrendingAPI() {
  console.log('🔄 Testing Trending Tokens API...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/trending`);
    const data = await response.json();
    
    console.log('✅ Trending Tokens API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    return data.tokens;
  } catch (error) {
    console.error('❌ Error fetching trending tokens:', error);
    return null;
  }
}

async function testSwapAPI(tokenSymbol = 'AIX', amount = 10) {
  console.log(`🔄 Testing Gasless Swap API for $${amount} of ${tokenSymbol}...`);
  
  try {
    const response = await fetch(`${BASE_URL}/api/swap`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        tokenSymbol,
        amountUSD: amount,
        userAddress: 'demo-user'
      }),
    });
    
    const data = await response.json();
    
    console.log('✅ Gasless Swap API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ Error executing gasless swap:', error);
    return null;
  }
}

async function testSwapStatus() {
  console.log('🔄 Testing Swap Service Status...');
  
  try {
    const response = await fetch(`${BASE_URL}/api/swap`);
    const data = await response.json();
    
    console.log('✅ Swap Service Status:');
    console.log(JSON.stringify(data, null, 2));
    
    return data;
  } catch (error) {
    console.error('❌ Error checking swap service status:', error);
    return null;
  }
}

async function runDemo() {
  console.log('🚀 Starting Trending Token Tracker Demo...\n');
  
  // Test trending tokens API
  const tokens = await testTrendingAPI();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test swap service status
  await testSwapStatus();
  console.log('\n' + '='.repeat(50) + '\n');
  
  // Test gasless swap API
  if (tokens && tokens.length > 0) {
    await testSwapAPI(tokens[0].symbol, 25);
  } else {
    await testSwapAPI('AIX', 25);
  }
  
  console.log('\n🎉 Demo completed!');
  console.log('💡 Open http://localhost:3000 in your browser to see the full application.');
}

// Run the demo if this script is executed directly
if (typeof window === 'undefined') {
  runDemo().catch(console.error);
}

module.exports = { testTrendingAPI, testSwapAPI, testSwapStatus };