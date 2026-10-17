import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/authGuard.js';
import {
  CreateCardPresetUseCase,
  GetCardPresetUseCase,
  ListCardPresetsUseCase,
  UpdateCardPresetUseCase,
  DeleteCardPresetUseCase,
} from '../../../application/use-cases/CardPresetUseCases.js';
import { createPresetSchema, updatePresetSchema } from '../../../validators/index.js';

export class PresetController {
  constructor(
    private createUseCase: CreateCardPresetUseCase,
    private getUseCase: GetCardPresetUseCase,
    private listUseCase: ListCardPresetsUseCase,
    private updateUseCase: UpdateCardPresetUseCase,
    private deleteUseCase: DeleteCardPresetUseCase
  ) {}

  public async listPresets(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const cursor = req.query.cursor as string | undefined;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    const items = await this.listUseCase.execute({ userId, cursor, limit });
    const nextCursor = items.length === limit ? items[items.length - 1].createdAt : null;

    res.status(200).json({
      success: true,
      data: {
        items,
        nextCursor,
      },
    });
  }

  public async createPreset(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.sub;
      const parsed = createPresetSchema.parse(req.body);

      const preset = await this.createUseCase.execute({
        userId,
        cardType: parsed.cardType,
        name: parsed.name,
        options: parsed.options,
      });

      res.status(201).json({
        success: true,
        data: preset,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Validation error',
      });
    }
  }

  public async getPreset(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const id = req.params.id;

    const preset = await this.getUseCase.getById(id, userId);
    if (!preset) {
      res.status(404).json({ success: false, error: 'Preset not found' });
      return;
    }

    res.status(200).json({
      success: true,
      data: preset,
    });
  }

  public async updatePreset(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const userId = req.user!.sub;
      const id = req.params.id;
      const parsed = updatePresetSchema.parse(req.body);

      const updated = await this.updateUseCase.execute({
        id,
        userId,
        name: parsed.name,
        options: parsed.options,
        cardType: parsed.cardType,
      });

      if (!updated) {
        res.status(404).json({ success: false, error: 'Preset not found or not owned by user' });
        return;
      }

      res.status(200).json({
        success: true,
        data: updated,
      });
    } catch (err: any) {
      res.status(400).json({
        success: false,
        error: err.message || 'Validation error',
      });
    }
  }

  public async deletePreset(req: AuthenticatedRequest, res: Response): Promise<void> {
    const userId = req.user!.sub;
    const id = req.params.id;

    const deleted = await this.deleteUseCase.execute(id, userId);
    if (!deleted) {
      res.status(404).json({ success: false, error: 'Preset not found or not owned by user' });
      return;
    }

    res.status(204).send();
  }
}
