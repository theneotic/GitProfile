import { ProfilePage } from '../../../domain/entities/ProfilePage.js';
import { IProfilePageRepository } from '../../../domain/interfaces/IProfilePageRepository.js';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository.js';

export class InMemoryProfilePageRepository implements IProfilePageRepository {
  private pages: Map<string, ProfilePage> = new Map(); // Keyed by userId

  constructor(private userRepo?: IUserRepository) {}

  public setUserRepository(userRepo: IUserRepository): void {
    this.userRepo = userRepo;
  }

  public async findByUserId(userId: string): Promise<ProfilePage | null> {
    return this.pages.get(userId) || null;
  }

  public async findByUsername(
    username: string
  ): Promise<{ profilePage: ProfilePage; githubLogin: string } | null> {
    if (!this.userRepo) return null;
    const user = await this.userRepo.findByGithubLogin(username);
    if (!user) return null;

    const page = this.pages.get(user.id);
    if (!page || !page.enabled) return null;

    return {
      profilePage: page,
      githubLogin: user.githubLogin,
    };
  }

  public async upsert(pageData: Omit<ProfilePage, 'updatedAt'>): Promise<ProfilePage> {
    const updated: ProfilePage = {
      ...pageData,
      updatedAt: new Date().toISOString(),
    };
    this.pages.set(pageData.userId, updated);
    return updated;
  }
}
