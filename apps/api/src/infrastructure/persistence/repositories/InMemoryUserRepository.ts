import { User } from '../../../domain/entities/User.js';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository.js';
import crypto from 'crypto';

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, User> = new Map();

  public async findById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  public async findByGithubId(githubId: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.githubId === githubId) return user;
    }
    return null;
  }

  public async findByGithubLogin(login: string): Promise<User | null> {
    for (const user of this.users.values()) {
      if (user.githubLogin.toLowerCase() === login.toLowerCase()) return user;
    }
    return null;
  }

  public async upsert(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<User> {
    const existing = await this.findByGithubId(userData.githubId);
    const now = new Date().toISOString();

    if (existing) {
      const updated: User = {
        ...existing,
        ...userData,
        updatedAt: now,
      };
      this.users.set(existing.id, updated);
      return updated;
    }

    const newUser: User = {
      ...userData,
      id: userData.id || crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.users.set(newUser.id, newUser);
    return newUser;
  }
}
