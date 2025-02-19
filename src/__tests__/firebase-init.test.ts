import { getFirebaseInstance } from '../lib/firebase/config';

describe('Firebase Configuration', () => {
  it('should initialize Firebase', () => {
    const firebase = getFirebaseInstance();
    expect(firebase).toBeDefined();
    expect(firebase.app).toBeDefined();
    expect(firebase.db).toBeDefined();
    expect(firebase.auth).toBeDefined();
  });
});
