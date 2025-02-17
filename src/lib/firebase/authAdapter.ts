import "dotenv/config";
import {
  Adapter,
  AdapterUser,
  AdapterSession,
  AdapterAccount,
} from "next-auth/adapters";
import { cert, getApps, initializeApp } from "firebase-admin/app";
import { 
  getFirestore, 
  QuerySnapshot, 
  QueryDocumentSnapshot 
} from "firebase-admin/firestore";

// Type-safe environment variable validation
function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`Missing required environment variable: ${name}`);
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

// Initialize Firebase with error handling
function initializeFirebase() {
  try {
    if (!getApps().length) {
      const projectId = getEnvVar("FIREBASE_PROJECT_ID");
      const clientEmail = getEnvVar("FIREBASE_CLIENT_EMAIL");
      const privateKey = getEnvVar("FIREBASE_PRIVATE_KEY").replace(
        /\\n/g,
        "\n"
      );

      console.log("Initializing Firebase Admin with:", {
        projectId,
        clientEmail: clientEmail.substring(0, 10) + "...",
      });

      initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey,
        }),
      });
    }

    const db = getFirestore();
    console.log("Firebase Admin initialized successfully");
    return db;
  } catch (error) {
    console.error("Firebase initialization error:", error);
    throw error;
  }
}

const firestore = initializeFirebase();

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
    async createUser(user: {
      email: any;
      emailVerified: any;
      name: any;
      image: any;
      id: string;
    }) {
      try {
        const userData = {
          email: user.email,
          emailVerified: user.emailVerified || null,
          name: user.name || null,
          image: user.image || null,
          createdAt: new Date().toISOString(),
        };

        console.log("Creating user:", { email: user.email });
        const userRef = firestore.collection("users").doc(user.id);
        await userRef.set(userData);

        return {
          id: user.id,
          ...userData,
        };
      } catch (error) {
        console.error("Error creating user:", error);
        throw error;
      }
    },

    async getUser(id) {
      try {
        const userDoc = await firestore.collection("users").doc(id).get();
        if (!userDoc.exists) return null;

        const userData = userDoc.data();
        return {
          id,
          email: userData?.email || "",
          emailVerified: userData?.emailVerified?.toDate() || null,
          name: userData?.name || null,
          image: userData?.image || null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user:", error);
        throw error;
      }
    },

    async getUserByEmail(email) {
      try {
        const userSnapshot = await firestore
          .collection("users")
          .where("email", "==", email)
          .limit(1)
          .get();

        if (userSnapshot.empty) return null;

        const userDoc = userSnapshot.docs[0];
        const userData = userDoc.data();

        return {
          id: userDoc.id,
          email: userData?.email || "",
          emailVerified: userData?.emailVerified?.toDate() || null,
          name: userData?.name || null,
          image: userData?.image || null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by email:", error);
        throw error;
      }
    },

    async getUserByAccount({ providerAccountId, provider }) {
      try {
        console.log("Getting user by account:", {
          provider,
          providerAccountId,
        });

        const accountSnapshot = await firestore
          .collection("accounts")
          .where("provider", "==", provider)
          .where("providerAccountId", "==", providerAccountId)
          .limit(1)
          .get();

        if (accountSnapshot.empty) {
          console.log("No account found");
          return null;
        }

        const accountData = accountSnapshot.docs[0].data();
        const userId = accountData?.userId;

        if (!userId) {
          console.log("No user ID found in account");
          return null;
        }

        const userDoc = await firestore.collection("users").doc(userId).get();

        if (!userDoc.exists) {
          console.log("User not found");
          return null;
        }

        const userData = userDoc.data();
        return {
          id: userDoc.id,
          email: userData?.email || "",
          emailVerified: userData?.emailVerified?.toDate() || null,
          name: userData?.name || null,
          image: userData?.image || null,
        } as AdapterUser;
      } catch (error) {
        console.error("Error getting user by account:", error);
        throw error;
      }
    },

    async updateUser(user) {
      try {
        // Fetch current user data to preserve existing values
        const currentUserDoc = await firestore
          .collection("users")
          .doc(user.id)
          .get();
        const currentUserData = currentUserDoc.data() || {};

        // Merge existing data with new updates
        const userData: AdapterUser = {
          id: user.id,
          email: user.email || currentUserData.email || "",
          emailVerified:
            user.emailVerified || currentUserData.emailVerified || null,
          name: user.name || currentUserData.name || null,
          image: user.image || currentUserData.image || null,
        };

        // Prepare update payload
        const updatePayload = {
          email: userData.email,
          emailVerified: userData.emailVerified,
          name: userData.name,
          image: userData.image,
          updatedAt: new Date().toISOString(),
        };

        // Update Firestore document
        await firestore.collection("users").doc(user.id).update(updatePayload);

        return userData;
      } catch (error) {
        console.error("Error updating user:", error);
        throw error;
      }
    },

    async deleteUser(userId: string) {
      try {
        await firestore.collection("users").doc(userId).delete();
      } catch (error) {
        console.error("Error deleting user:", error);
        throw error;
      }
    },

    async linkAccount(account: Account): Promise<Account> {
      try {
        console.log("Linking account:", {
          provider: account.provider,
          userId: account.userId,
        });

        const accountRef = firestore.collection("accounts").doc();
        await accountRef.set({
          userId: account.userId,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          type: account.type,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          refresh_token: account.refresh_token,
          createdAt: new Date().toISOString(),
        });
        return account;
      } catch (error) {
        console.error("Error linking account:", error);
        throw error;
      }
    },

    async unlinkAccount(params: {
      providerAccountId: string;
      provider: string;
    }): Promise<void> {
      try {
        const { providerAccountId, provider } = params;
        const querySnapshot: QuerySnapshot = await firestore
          .collection("accounts")
          .where("providerAccountId", "==", providerAccountId)
          .where("provider", "==", provider)
          .get();

        querySnapshot.forEach((doc) => doc.ref.delete());
      } catch (error) {
        console.error("Error unlinking account:", error);
        throw error;
      }
    },

    async createSession(session: Session): Promise<Session> {
      try {
        const sessionRef = firestore
          .collection("sessions")
          .doc(session.sessionToken);
        await sessionRef.set({
          userId: session.userId,
          expires: session.expires,
          createdAt: new Date().toISOString(),
        });
        return session;
      } catch (error) {
        console.error("Error creating session:", error);
        throw error;
      }
    },

    async getSessionAndUser(
      sessionToken: string
    ): Promise<{ session: Session; user: AdapterUser } | null> {
      try {
        const sessionDoc = await firestore
          .collection("sessions")
          .doc(sessionToken)
          .get();

        if (!sessionDoc.exists) return null;

        const sessionData = sessionDoc.data();
        if (!sessionData) return null;

        const userId = sessionData.userId;
        const expires = sessionData.expires?.toDate();

        if (!userId || !expires) return null;

        const session: Session = {
          sessionToken,
          userId,
          expires,
        };

        const user = await this.getUser(userId);
        if (!user) return null;

        return { session, user };
      } catch (error) {
        console.error("Error getting session and user:", error);
        throw error;
      }
    },

    async updateSession(
      session: Partial<Session> & { sessionToken: string }
    ): Promise<Session | null> {
      try {
        const sessionSnapshot = await firestore
          .collection("sessions")
          .where("sessionToken", "==", session.sessionToken)
          .limit(1)
          .get();

        if (!sessionSnapshot.empty) {
          const sessionDoc = sessionSnapshot.docs[0];
          await sessionDoc.ref.update(session);
          return { ...sessionDoc.data(), ...session } as Session;
        }

        return null;
      } catch (error) {
        console.error("Error updating session:", error);
        throw error;
      }
    },

    async deleteSession(sessionToken: string) {
      try {
        const sessionSnapshot: QuerySnapshot = await firestore
          .collection("sessions")
          .where("sessionToken", "==", sessionToken)
          .limit(1)
          .get();

        if (!sessionSnapshot.empty) {
          const sessionDoc: QueryDocumentSnapshot = sessionSnapshot.docs[0];
          await sessionDoc.ref.delete();
        }
      } catch (error) {
        console.error("Error deleting session:", error);
        throw error;
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
      try {
        const tokenRef = firestore.collection("verification_tokens").doc();
        await tokenRef.set(verificationToken);
        return verificationToken;
      } catch (error) {
        console.error("Error creating verification token:", error);
        throw error;
      }
    },

    async useVerificationToken({
      identifier,
      token,
    }: {
      identifier: string;
      token: string;
    }): Promise<{
      identifier: string;
      token: string;
      expires: Date;
    } | null> {
      try {
        const querySnapshot = await firestore
          .collection("verification_tokens")
          .where("identifier", "==", identifier)
          .where("token", "==", token)
          .limit(1)
          .get();

        if (querySnapshot.empty) return null;

        const tokenDoc = querySnapshot.docs[0];
        const tokenData = tokenDoc.data() as {
          identifier: string;
          token: string;
          expires: Date;
        };
        await tokenDoc.ref.delete();

        return tokenData;
      } catch (error) {
        console.error("Error using verification token:", error);
        throw error;
      }
    },
  };
}
