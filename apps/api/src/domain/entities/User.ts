export interface User {
  id: string; // uuid
  githubId: string;
  githubLogin: string;
  name: string | null;
  email: string | null;
  avatarUrl: string | null;
  accessToken?: string | null;
  refreshToken?: string | null;
  createdAt: string;
  updatedAt: string;
}
