import { ProfilePage } from '../entities/ProfilePage.js';

export interface IProfilePageRepository {
  findByUserId(userId: string): Promise<ProfilePage | null>;
  findByUsername(username: string): Promise<{ profilePage: ProfilePage; githubLogin: string } | null>;
  upsert(page: Omit<ProfilePage, 'updatedAt'>): Promise<ProfilePage>;
}
