import { NextApiRequest, NextApiResponse } from 'next';
import { getFirebaseInstance } from '@/lib/firebase/config';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    console.log('Initializing Firebase...');
    const firebase = getFirebaseInstance();
    
    console.log('Firebase initialized successfully');
    console.log('Testing connectivity...');
    
    const connectivityStatus = await firebase.diagnoseConnectivity();
    console.log('Connectivity status:', connectivityStatus);
    
    res.status(200).json({ 
      status: 'success',
      message: 'Firebase initialized successfully',
      connectivityStatus 
    });
  } catch (error) {
    console.error('Error testing Firebase:', error);
    res.status(500).json({ 
      status: 'error',
      message: 'Failed to initialize Firebase',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
