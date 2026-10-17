import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authGuard.js';
import {
  GetUserProfileUseCase,
  UpdateUserSettingsUseCase,
} from '../../../application/use-cases/UserUseCases.js';

export class UserController {
  constructor(
    private getProfileUseCase: GetUserProfileUseCase,
    private updateSettingsUseCase: UpdateUserSettingsUseCase
  ) {}

  public async getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const profile = await this.getProfileUseCase.execute(userId);

    if (!profile) {
      res.status(404).json({ success: false, error: 'User profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  }

  public async updateSettings(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const { includePrivateRepos, defaultTheme } = req.body;

    const updated = await this.updateSettingsUseCase.execute(userId, {
      includePrivateRepos,
      defaultTheme,
    });

    if (!updated) {
      res.status(404).json({ success: false, error: 'User profile not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: updated,
    });
  }
}
