import { currentUser as getClerkUser } from '@clerk/nextjs/server';
import { getAuth } from '@clerk/nextjs/server';
import type { NextRequest } from 'next/server';

export class ServerAuthService {
  static async getCurrentUser() {
    const user = await getClerkUser();
    if (!user) return null;

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      name: user.firstName ? `${user.firstName} ${user.lastName}` : undefined,
      image: user.imageUrl,
    };
  }

  static async getToken(request?: NextRequest) {
    if (!request) {
      return null;
    }
    const auth = getAuth(request);
    return auth.getToken();
  }

  static async getUserId() {
    const user = await getClerkUser();
    return user?.id;
  }
}

export default ServerAuthService;
