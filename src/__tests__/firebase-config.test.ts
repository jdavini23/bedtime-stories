import { getFirebaseInstance } from '../lib/firebase/config';

describe('Firebase Configuration', () => {
  it('should initialize Firebase successfully', async () => {
    try {
      const firebase = getFirebaseInstance();
      expect(firebase).toBeDefined();
      expect(firebase.app).toBeDefined();
      expect(firebase.db).toBeDefined();
      expect(firebase.auth).toBeDefined();

      // Test connectivity
      const connectivityStatus = await firebase.diagnoseConnectivity();
      expect(connectivityStatus.isFullyConnected).toBe(true);
      expect(connectivityStatus.navigatorOnline).toBe(true);
      expect(connectivityStatus.firebaseConnectivity).toBe(true);

      console.log('Firebase initialized successfully:', connectivityStatus);
    } catch (error) {
      console.error('Firebase initialization failed:', error);
      throw error;
    }
  });
});
