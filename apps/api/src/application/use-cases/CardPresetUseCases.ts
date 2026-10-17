import crypto from 'crypto';
import { CardPreset } from '../../domain/entities/CardPreset.js';
import {
  ICardPresetRepository,
  ListPresetsParams,
} from '../../domain/interfaces/ICardPresetRepository.js';
import { schemaFor } from '../../validators/index.js';
import { CardType } from '../../cards/engine/types.js';

export function generateUrlSafeSlug(length = 8): string {
  return crypto
    .randomBytes(Math.ceil((length * 3) / 4))
    .toString('base64url')
    .substring(0, length);
}

export class CreateCardPresetUseCase {
  constructor(private presetRepo: ICardPresetRepository) {}

  public async execute(params: {
    userId: string;
    cardType: CardType;
    name: string;
    options: Record<string, unknown>;
  }): Promise<CardPreset> {
    const validator = schemaFor(params.cardType);
    const validatedOptions = validator.parse(params.options);

    // Generate unique 8-char slug
    let slug = generateUrlSafeSlug(8);
    let attempts = 0;
    while (attempts < 5) {
      const existing = await this.presetRepo.findBySlug(slug);
      if (!existing) break;
      slug = generateUrlSafeSlug(8);
      attempts++;
    }

    return this.presetRepo.create({
      userId: params.userId,
      slug,
      cardType: params.cardType,
      name: params.name,
      options: validatedOptions,
      sponsor: false,
    });
  }
}

export class GetCardPresetUseCase {
  constructor(private presetRepo: ICardPresetRepository) {}

  public async getById(id: string, userId?: string): Promise<CardPreset | null> {
    const preset = await this.presetRepo.findById(id);
    if (!preset) return null;
    if (userId && preset.userId !== userId) return null;
    return preset;
  }

  public async getBySlug(slug: string): Promise<CardPreset | null> {
    return this.presetRepo.findBySlug(slug);
  }
}

export class ListCardPresetsUseCase {
  constructor(private presetRepo: ICardPresetRepository) {}

  public async execute(params: ListPresetsParams): Promise<CardPreset[]> {
    return this.presetRepo.listByUser(params);
  }
}

export class UpdateCardPresetUseCase {
  constructor(private presetRepo: ICardPresetRepository) {}

  public async execute(params: {
    id: string;
    userId: string;
    name?: string;
    options?: Record<string, unknown>;
    cardType?: CardType;
  }): Promise<CardPreset | null> {
    const existing = await this.presetRepo.findById(params.id);
    if (!existing || existing.userId !== params.userId) {
      return null;
    }

    const targetType = params.cardType || existing.cardType;
    let validatedOptions = params.options;
    if (params.options) {
      const validator = schemaFor(targetType);
      validatedOptions = validator.parse(params.options);
    }

    return this.presetRepo.update(params.id, params.userId, {
      name: params.name,
      options: validatedOptions,
      cardType: targetType,
    });
  }
}

export class DeleteCardPresetUseCase {
  constructor(private presetRepo: ICardPresetRepository) {}

  public async execute(id: string, userId: string): Promise<boolean> {
    return this.presetRepo.delete(id, userId);
  }
}
