import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authGuard.js';
import {
  GetProfilePageUseCase,
  UpdateProfilePageUseCase,
} from '../../../application/use-cases/ProfilePageUseCases.js';
import { updateProfilePageSchema } from '../../../validators/index.js';

export class ProfilePageController {
  constructor(
    private getUseCase: GetProfilePageUseCase,
    private updateUseCase: UpdateProfilePageUseCase
  ) {}

  public async getMyProfilePage(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const page = await this.getUseCase.getByUserId(userId);

    res.status(200).json({
      success: true,
      data: page,
    });
  }

  public async updateMyProfilePage(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.sub;
      const parsed = updateProfilePageSchema.parse(req.body);

      const page = await this.updateUseCase.execute({
        userId,
        enabled: parsed.enabled,
        bioOverride: parsed.bioOverride,
        pinnedLinks: parsed.pinnedLinks,
        presetIds: parsed.presetIds,
      });

      res.status(200).json({
        success: true,
        data: page,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Validation error',
      });
    }
  }

  public async getPublicProfilePage(req: Request, res: Response): Promise<void> {
    const username = req.params.username;
    const result = await this.getUseCase.getByUsername(username);

    if (!result || !result.profilePage.enabled) {
      res.status(404).json({
        success: false,
        error: `Public profile page for '${username}' not found or disabled.`,
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: result.profilePage,
    });
  }
}
