import { CardPreset } from '../../../domain/entities/CardPreset.js';
import {
  ICardPresetRepository,
  ListPresetsParams,
} from '../../../domain/interfaces/ICardPresetRepository.js';
import crypto from 'crypto';

export class InMemoryCardPresetRepository implements ICardPresetRepository {
  private presets: Map<string, CardPreset> = new Map();

  public async findById(id: string): Promise<CardPreset | null> {
    return this.presets.get(id) || null;
  }

  public async findBySlug(slug: string): Promise<CardPreset | null> {
    for (const preset of this.presets.values()) {
      if (preset.slug === slug) return preset;
    }
    return null;
  }

  public async listByUser(params: ListPresetsParams): Promise<CardPreset[]> {
    const { userId, cursor, limit = 20 } = params;
    const userPresets = Array.from(this.presets.values())
      .filter((p) => p.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    let filtered = userPresets;
    if (cursor) {
      filtered = userPresets.filter((p) => p.createdAt < cursor);
    }

    return filtered.slice(0, limit);
  }

  public async create(
    data: Omit<CardPreset, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CardPreset> {
    const now = new Date().toISOString();
    const newPreset: CardPreset = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now,
    };
    this.presets.set(newPreset.id, newPreset);
    return newPreset;
  }

  public async update(
    id: string,
    userId: string,
    updates: Partial<Omit<CardPreset, 'id' | 'userId' | 'slug' | 'createdAt' | 'updatedAt'>>
  ): Promise<CardPreset | null> {
    const existing = this.presets.get(id);
    if (!existing || existing.userId !== userId) {
      return null;
    }

    const updated: CardPreset = {
      ...existing,
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    this.presets.set(id, updated);
    return updated;
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    const existing = this.presets.get(id);
    if (!existing || existing.userId !== userId) {
      return false;
    }
    return this.presets.delete(id);
  }
}
