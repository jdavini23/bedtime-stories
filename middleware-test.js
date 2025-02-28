// Simple test script to check if Clerk middleware is working
import axios from 'axios';

// Helper function to make requests
async function testRoute(route) {
  console.log(`Testing route: ${route}`);
  try {
    const response = await axios.get(`http://localhost:3004${route}`, {
      maxRedirects: 0,
      validateStatus: function (status) {
        return status >= 200 && status < 500; // Accept all status codes except 5xx
      }
    });
    console.log(`Status: ${response.status}`);
    return response;
  } catch (error) {
    if (error.response) {
      console.log(`Status: ${error.response.status}`);
      if (error.response.status === 302) {
        console.log(`Redirect location: ${error.response.headers.location}`);
      }
    } else {
      console.error(`Error testing ${route}:`, error.message);
    }
  }
}

// Test various routes
async function runTests() {
  console.log('=== Testing Clerk Middleware ===');
  
  // Test public route
  await testRoute('/');
  
  // Test protected route (should redirect to sign-in if middleware is working)
  await testRoute('/dashboard');
  
  console.log('=== Tests Complete ===');
}

runTests();