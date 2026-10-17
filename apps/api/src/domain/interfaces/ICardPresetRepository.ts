import { CardPreset } from '../entities/CardPreset.js';

export interface ListPresetsParams {
  userId: string;
  cursor?: string; // ISO createdAt cursor for keyset pagination
  limit?: number;
}

export interface ICardPresetRepository {
  findById(id: string): Promise<CardPreset | null>;
  findBySlug(slug: string): Promise<CardPreset | null>;
  listByUser(params: ListPresetsParams): Promise<CardPreset[]>;
  create(preset: Omit<CardPreset, 'id' | 'createdAt' | 'updatedAt'>): Promise<CardPreset>;
  update(id: string, userId: string, updates: Partial<Omit<CardPreset, 'id' | 'userId' | 'slug' | 'createdAt' | 'updatedAt'>>): Promise<CardPreset | null>;
  delete(id: string, userId: string): Promise<boolean>;
}
