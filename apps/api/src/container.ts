import { IUserRepository } from './domain/interfaces/IUserRepository.js';
import { ICardPresetRepository } from './domain/interfaces/ICardPresetRepository.js';
import { IProfilePageRepository } from './domain/interfaces/IProfilePageRepository.js';

import { InMemoryUserRepository } from './infrastructure/persistence/repositories/InMemoryUserRepository.js';
import { InMemoryCardPresetRepository } from './infrastructure/persistence/repositories/InMemoryCardPresetRepository.js';
import { InMemoryProfilePageRepository } from './infrastructure/persistence/repositories/InMemoryProfilePageRepository.js';

import { SupabaseUserRepository } from './infrastructure/persistence/repositories/SupabaseUserRepository.js';
import { SupabaseCardPresetRepository } from './infrastructure/persistence/repositories/SupabaseCardPresetRepository.js';
import { SupabaseProfilePageRepository } from './infrastructure/persistence/repositories/SupabaseProfilePageRepository.js';
import { getSupabaseClient } from './infrastructure/persistence/supabaseClient.js';

import {
  CreateCardPresetUseCase,
  GetCardPresetUseCase,
  ListCardPresetsUseCase,
  UpdateCardPresetUseCase,
  DeleteCardPresetUseCase,
} from './application/use-cases/CardPresetUseCases.js';
import {
  GetProfilePageUseCase,
  UpdateProfilePageUseCase,
} from './application/use-cases/ProfilePageUseCases.js';
import {
  GetUserProfileUseCase,
  UpdateUserSettingsUseCase,
} from './application/use-cases/UserUseCases.js';

import { CardController } from './infrastructure/http/controllers/CardController.js';
import { AuthController } from './infrastructure/http/controllers/AuthController.js';
import { StatsController } from './infrastructure/http/controllers/StatsController.js';
import { PresetController } from './infrastructure/http/controllers/PresetController.js';
import { UserController } from './infrastructure/http/controllers/UserController.js';
import { ProfilePageController } from './infrastructure/http/controllers/ProfilePageController.js';

export class Container {
  public userRepo: IUserRepository;
  public presetRepo: ICardPresetRepository;
  public profilePageRepo: IProfilePageRepository;

  public createPresetUseCase: CreateCardPresetUseCase;
  public getPresetUseCase: GetCardPresetUseCase;
  public listPresetsUseCase: ListCardPresetsUseCase;
  public updatePresetUseCase: UpdateCardPresetUseCase;
  public deletePresetUseCase: DeleteCardPresetUseCase;

  public getProfilePageUseCase: GetProfilePageUseCase;
  public updateProfilePageUseCase: UpdateProfilePageUseCase;

  public getUserProfileUseCase: GetUserProfileUseCase;
  public updateUserSettingsUseCase: UpdateUserSettingsUseCase;

  public cardController: CardController;
  public authController: AuthController;
  public statsController: StatsController;
  public presetController: PresetController;
  public userController: UserController;
  public profilePageController: ProfilePageController;

  constructor() {
    const supabase = getSupabaseClient();
    if (supabase) {
      this.userRepo = new SupabaseUserRepository(supabase);
      this.presetRepo = new SupabaseCardPresetRepository(supabase);
      this.profilePageRepo = new SupabaseProfilePageRepository(supabase);
    } else {
      const inMemUser = new InMemoryUserRepository();
      this.userRepo = inMemUser;
      this.presetRepo = new InMemoryCardPresetRepository();
      const inMemProfile = new InMemoryProfilePageRepository(inMemUser);
      this.profilePageRepo = inMemProfile;
    }

    this.createPresetUseCase = new CreateCardPresetUseCase(this.presetRepo);
    this.getPresetUseCase = new GetCardPresetUseCase(this.presetRepo);
    this.listPresetsUseCase = new ListCardPresetsUseCase(this.presetRepo);
    this.updatePresetUseCase = new UpdateCardPresetUseCase(this.presetRepo);
    this.deletePresetUseCase = new DeleteCardPresetUseCase(this.presetRepo);

    this.getProfilePageUseCase = new GetProfilePageUseCase(this.profilePageRepo);
    this.updateProfilePageUseCase = new UpdateProfilePageUseCase(this.profilePageRepo);

    this.getUserProfileUseCase = new GetUserProfileUseCase(this.userRepo);
    this.updateUserSettingsUseCase = new UpdateUserSettingsUseCase(this.userRepo);

    this.cardController = new CardController(this.getPresetUseCase);
    this.authController = new AuthController(this.userRepo);
    this.statsController = new StatsController();
    this.presetController = new PresetController(
      this.createPresetUseCase,
      this.getPresetUseCase,
      this.listPresetsUseCase,
      this.updatePresetUseCase,
      this.deletePresetUseCase
    );
    this.userController = new UserController(
      this.getUserProfileUseCase,
      this.updateUserSettingsUseCase
    );
    this.profilePageController = new ProfilePageController(
      this.getProfilePageUseCase,
      this.updateProfilePageUseCase
    );
  }
}

export const container = new Container();
