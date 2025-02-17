import 'dotenv/config';
import { Adapter, AdapterUser, AdapterSession, AdapterAccount } from 'next-auth/adapters';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore, DocumentReference, QueryDocumentSnapshot, DocumentSnapshot, QuerySnapshot } from 'firebase-admin/firestore';

// Type-safe environment variable validation
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Prevent multiple initializations
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: getEnvVar('FIREBASE_PROJECT_ID'),
      clientEmail: getEnvVar('FIREBASE_CLIENT_EMAIL'),
      privateKey: getEnvVar('FIREBASE_PRIVATE_KEY').replace(/\\n/g, '\n')
    })
  });
}

const firestore: FirebaseFirestore.Firestore = getFirestore();

interface Account extends AdapterAccount {
  userId: string;
  provider: string;
  providerAccountId: string;
  access_token?: string;
  expires_at?: number;
  refresh_token?: string;
  token_type?: string;
  scope?: string;
}

interface Session extends AdapterSession {
  userId: string;
  expires: Date;
}

export function FirebaseAdapter(): Adapter {
  return {
    async createUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const userData: AdapterUser = {
        id: user.id,
        email: user.email || '',
        emailVerified: user.emailVerified || null,
        name: user.name || null,
        image: user.image || null
      };

      const userRef: DocumentReference<FirebaseFirestore.DocumentData> = firestore.collection('users').doc(user.id);
      await userRef.set({
        ...userData,
        createdAt: new Date().toISOString()
      });

      return userData;
    },

    async getUser(id: string): Promise<AdapterUser | null> {
      const userRef: DocumentReference<FirebaseFirestore.DocumentData> = firestore.collection('users').doc(id);
      const userDoc: DocumentSnapshot<FirebaseFirestore.DocumentData> = await userRef.get();

      if (!userDoc.exists) return null;

      const userData: AdapterUser = {
        id: userDoc.id,
        email: userDoc.data()?.email || '',
        emailVerified: userDoc.data()?.emailVerified || null,
        name: userDoc.data()?.name || null,
        image: userDoc.data()?.image || null
      };

      return userData;
    },

    async getUserByEmail(email: string): Promise<AdapterUser | null> {
      const querySnapshot: QuerySnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('users')
        .where('email', '==', email)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) return null;

      const userDoc: QueryDocumentSnapshot<FirebaseFirestore.DocumentData> = querySnapshot.docs[0];
      const userData: AdapterUser = userDoc.data() as AdapterUser;
      return {
        id: userDoc.id,
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name || null,
        image: userData.image || null
      };
    },

    async getUserByAccount({ providerAccountId, provider }): Promise<AdapterUser | null> {
      const querySnapshot: QuerySnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('accounts')
        .where('providerAccountId', '==', providerAccountId)
        .where('provider', '==', provider)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) return null;

      const accountDoc: QueryDocumentSnapshot<FirebaseFirestore.DocumentData> = querySnapshot.docs[0];
      const userDoc: DocumentSnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('users').doc(accountDoc.data().userId).get();
      
      if (!userDoc.exists) return null;

      const userData: AdapterUser = userDoc.data() as AdapterUser;
      return {
        id: userDoc.id,
        email: userData.email,
        emailVerified: userData.emailVerified,
        name: userData.name || null,
        image: userData.image || null
      };
    },

    async updateUser(user: Partial<AdapterUser> & { id: string }): Promise<AdapterUser> {
      const userRef: DocumentReference = firestore.collection('users').doc(user.id);
      const userDoc: DocumentSnapshot = await userRef.get();
      
      if (!userDoc.exists) {
        throw new Error('User not found');
      }

      const currentData = userDoc.data() as AdapterUser;
      const updatedData: AdapterUser = {
        id: user.id,
        email: user.email || currentData.email,
        emailVerified: user.emailVerified ?? currentData.emailVerified,
        name: user.name ?? currentData.name,
        image: user.image ?? currentData.image
      };

      // Convert AdapterUser to plain object for Firestore update
      const updatePayload = {
        email: updatedData.email,
        emailVerified: updatedData.emailVerified,
        name: updatedData.name,
        image: updatedData.image,
        updatedAt: new Date().toISOString()
      };

      await userRef.update(updatePayload);
      return updatedData;
    },

    async deleteUser(userId: string) {
      await firestore.collection('users').doc(userId).delete();
    },

    async linkAccount(account: AdapterAccount): Promise<AdapterAccount> {
      const accountRef = firestore.collection('accounts').doc();
      await accountRef.set({
        ...account,
        createdAt: new Date().toISOString()
      });
      return account;
    },

    async unlinkAccount({ providerAccountId, provider }: { providerAccountId: string; provider: string }): Promise<void> {
      const querySnapshot: QuerySnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('accounts')
        .where('providerAccountId', '==', providerAccountId)
        .where('provider', '==', provider)
        .get();
      
      querySnapshot.forEach(doc => doc.ref.delete());
    },

    async createSession(session: AdapterSession): Promise<AdapterSession> {
      const sessionRef = firestore.collection('sessions').doc();
      await sessionRef.set({
        ...session,
        createdAt: new Date().toISOString()
      });
      return session;
    },

    async getSessionAndUser(sessionToken: string): Promise<{ session: Session; user: AdapterUser } | null> {
      const sessionSnapshot: QuerySnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('sessions')
        .where('sessionToken', '==', sessionToken)
        .limit(1)
        .get();
      
      if (sessionSnapshot.empty) return null;

      const sessionDoc: QueryDocumentSnapshot<FirebaseFirestore.DocumentData> = sessionSnapshot.docs[0];
      const sessionData = sessionDoc.data() as Session;
      
      const userDoc: DocumentSnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('users').doc(sessionData.userId).get();
      
      if (!userDoc.exists) return null;

      const userData: AdapterUser = userDoc.data() as AdapterUser;
      return {
        session: sessionData,
        user: {
          id: userDoc.id,
          email: userData.email,
          emailVerified: userData.emailVerified,
          name: userData.name || null,
          image: userData.image || null
        }
      };
    },

    async updateSession(session: Partial<AdapterSession> & { sessionToken: string }): Promise<AdapterSession | null> {
      const sessionSnapshot = await firestore.collection('sessions')
        .where('sessionToken', '==', session.sessionToken)
        .limit(1)
        .get();
      
      if (!sessionSnapshot.empty) {
        const sessionDoc = sessionSnapshot.docs[0];
        await sessionDoc.ref.update(session);
        return { ...sessionDoc.data(), ...session } as AdapterSession;
      }
      
      return null;
    },

    async deleteSession(sessionToken: string) {
      const sessionSnapshot: QuerySnapshot<FirebaseFirestore.DocumentData> = await firestore.collection('sessions')
        .where('sessionToken', '==', sessionToken)
        .limit(1)
        .get();
      
      if (!sessionSnapshot.empty) {
        const sessionDoc: QueryDocumentSnapshot<FirebaseFirestore.DocumentData> = sessionSnapshot.docs[0];
        await sessionDoc.ref.delete();
      }
    },

    async createVerificationToken(verificationToken: {
      identifier: string;
      token: string;
      expires: Date;
    }): Promise<{
      identifier: string;
      token: string;
      expires: Date;
    }> {
      const tokenRef = firestore.collection('verification_tokens').doc();
      await tokenRef.set(verificationToken);
      return verificationToken;
    },

    async useVerificationToken({ 
      identifier, 
      token 
    }: {
      identifier: string;
      token: string;
    }): Promise<{
      identifier: string;
      token: string;
      expires: Date;
    } | null> {
      const querySnapshot = await firestore.collection('verification_tokens')
        .where('identifier', '==', identifier)
        .where('token', '==', token)
        .limit(1)
        .get();
      
      if (querySnapshot.empty) return null;

      const tokenDoc = querySnapshot.docs[0];
      const tokenData = tokenDoc.data() as { identifier: string; token: string; expires: Date };
      await tokenDoc.ref.delete();
      
      return tokenData;
    }
  };
}
