'use client';

import { useFirebase } from '@/components/providers/FirebaseProvider';
import { collection, getDocs } from 'firebase/firestore';
import { useEffect, useState } from 'react';

export default function TestFirebasePage() {
  const { db } = useFirebase();
  const [documents, setDocuments] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDocuments() {
      if (!db) {
        setError('Firestore not initialized');
        return;
      }

      try {
        // Replace 'your_collection' with an actual collection in your Firestore
        const collectionRef = collection(db, 'test_collection');
        const snapshot = await getDocs(collectionRef);
        
        const docs = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));

        setDocuments(docs);
      } catch (err) {
        console.error('Error fetching documents:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      }
    }

    fetchDocuments();
  }, [db]);

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-800">
        Firebase Test Error: {error}
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Firebase Test Page</h1>
      {documents.length === 0 ? (
        <p>No documents found or collection is empty.</p>
      ) : (
        <ul>
          {documents.map(doc => (
            <li key={doc.id} className="mb-2 p-2 bg-gray-100 rounded">
              Document ID: {doc.id}
              <pre className="text-sm">{JSON.stringify(doc, null, 2)}</pre>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
