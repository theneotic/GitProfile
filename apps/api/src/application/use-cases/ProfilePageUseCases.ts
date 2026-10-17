import { ProfilePage, PinnedLink } from '../../domain/entities/ProfilePage.js';
import { IProfilePageRepository } from '../../domain/interfaces/IProfilePageRepository.js';

export class GetProfilePageUseCase {
  constructor(private profilePageRepo: IProfilePageRepository) {}

  public async getByUserId(userId: string): Promise<ProfilePage | null> {
    return this.profilePageRepo.findByUserId(userId);
  }

  public async getByUsername(
    username: string
  ): Promise<{ profilePage: ProfilePage; githubLogin: string } | null> {
    return this.profilePageRepo.findByUsername(username);
  }
}

export class UpdateProfilePageUseCase {
  constructor(private profilePageRepo: IProfilePageRepository) {}

  public async execute(params: {
    userId: string;
    enabled: boolean;
    bioOverride?: string | null;
    pinnedLinks?: PinnedLink[];
    presetIds?: string[];
  }): Promise<ProfilePage> {
    return this.profilePageRepo.upsert({
      userId: params.userId,
      enabled: params.enabled,
      bioOverride: params.bioOverride || null,
      pinnedLinks: params.pinnedLinks || [],
      presetIds: params.presetIds || [],
    });
  }
}
