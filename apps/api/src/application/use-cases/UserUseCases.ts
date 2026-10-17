import { IUserRepository } from '../../domain/interfaces/IUserRepository.js';

export interface UserProfileDTO {
  id: string;
  githubLogin: string;
  name: string | null;
  avatarUrl: string | null;
  email: string | null;
  includePrivateRepos: boolean;
  defaultTheme: string;
  createdAt: string;
}

export class GetUserProfileUseCase {
  constructor(private userRepo: IUserRepository) {}

  public async execute(userId: string): Promise<UserProfileDTO | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;

    return {
      id: user.id,
      githubLogin: user.githubLogin,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
      includePrivateRepos: false,
      defaultTheme: 'terminal',
      createdAt: user.createdAt,
    };
  }
}

export class UpdateUserSettingsUseCase {
  constructor(private userRepo: IUserRepository) {}

  public async execute(
    userId: string,
    settings: { includePrivateRepos?: boolean; defaultTheme?: string }
  ): Promise<UserProfileDTO | null> {
    const user = await this.userRepo.findById(userId);
    if (!user) return null;

    return {
      id: user.id,
      githubLogin: user.githubLogin,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
      includePrivateRepos: Boolean(settings.includePrivateRepos),
      defaultTheme: settings.defaultTheme || 'terminal',
      createdAt: user.createdAt,
    };
  }
}
