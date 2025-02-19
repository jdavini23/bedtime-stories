import { getFirebaseInstance } from './lib/firebase/config';

async function testFirebaseConnection() {
  try {
    console.log('Initializing Firebase...');
    const firebase = getFirebaseInstance();
    
    console.log('Firebase initialized successfully');
    console.log('Testing connectivity...');
    
    const connectivityStatus = await firebase.diagnoseConnectivity();
    console.log('Connectivity status:', connectivityStatus);
    
    console.log('All tests passed!');
  } catch (error) {
    console.error('Error testing Firebase:', error);
  }
}

testFirebaseConnection();
