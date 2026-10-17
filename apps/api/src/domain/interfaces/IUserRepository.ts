import { User } from '../entities/User.js';

export interface IUserRepository {
  findById(id: string): Promise<User | null>;
  findByGithubId(githubId: string): Promise<User | null>;
  findByGithubLogin(login: string): Promise<User | null>;
  upsert(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }): Promise<User>;
}
