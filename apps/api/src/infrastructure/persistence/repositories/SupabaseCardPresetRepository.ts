import { SupabaseClient } from '@supabase/supabase-js';
import { CardPreset } from '../../../domain/entities/CardPreset.js';
import {
  ICardPresetRepository,
  ListPresetsParams,
} from '../../../domain/interfaces/ICardPresetRepository.js';
import { getSupabaseClient } from '../supabaseClient.js';

export class SupabaseCardPresetRepository implements ICardPresetRepository {
  constructor(private client: SupabaseClient | null = getSupabaseClient()) {}

  public async findById(id: string): Promise<CardPreset | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('card_presets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async findBySlug(slug: string): Promise<CardPreset | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('card_presets')
      .select('*')
      .eq('slug', slug)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async listByUser(params: ListPresetsParams): Promise<CardPreset[]> {
    if (!this.client) return [];
    const { userId, cursor, limit = 20 } = params;

    let query = this.client
      .from('card_presets')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(limit);

    // Keyset pagination (Rule 11.6)
    if (cursor) {
      query = query.lt('created_at', cursor);
    }

    const { data, error } = await query;
    if (error || !data) return [];
    return data.map((row) => this.mapToDomain(row));
  }

  public async create(
    preset: Omit<CardPreset, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<CardPreset> {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }

    const payload = {
      user_id: preset.userId,
      slug: preset.slug,
      card_type: preset.cardType,
      name: preset.name,
      options: preset.options,
      sponsor: preset.sponsor,
    };

    const { data, error } = await this.client
      .from('card_presets')
      .insert(payload)
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to create card preset: ${error?.message}`);
    }

    return this.mapToDomain(data);
  }

  public async update(
    id: string,
    userId: string,
    updates: Partial<Omit<CardPreset, 'id' | 'userId' | 'slug' | 'createdAt' | 'updatedAt'>>
  ): Promise<CardPreset | null> {
    if (!this.client) return null;

    const payload: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.options !== undefined) payload.options = updates.options;
    if (updates.cardType !== undefined) payload.card_type = updates.cardType;
    if (updates.sponsor !== undefined) payload.sponsor = updates.sponsor;

    const { data, error } = await this.client
      .from('card_presets')
      .update(payload)
      .eq('id', id)
      .eq('user_id', userId)
      .select()
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async delete(id: string, userId: string): Promise<boolean> {
    if (!this.client) return false;
    const { error } = await this.client
      .from('card_presets')
      .delete()
      .eq('id', id)
      .eq('user_id', userId);

    return !error;
  }

  private mapToDomain(row: any): CardPreset {
    return {
      id: row.id,
      userId: row.user_id,
      slug: row.slug,
      cardType: row.card_type,
      name: row.name,
      options: row.options || {},
      sponsor: Boolean(row.sponsor),
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
