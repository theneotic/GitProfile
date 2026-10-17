import { SupabaseClient } from '@supabase/supabase-js';
import { ProfilePage } from '../../../domain/entities/ProfilePage.js';
import { IProfilePageRepository } from '../../../domain/interfaces/IProfilePageRepository.js';
import { getSupabaseClient } from '../supabaseClient.js';

export class SupabaseProfilePageRepository implements IProfilePageRepository {
  constructor(private client: SupabaseClient | null = getSupabaseClient()) {}

  public async findByUserId(userId: string): Promise<ProfilePage | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('profile_pages')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async findByUsername(
    username: string
  ): Promise<{ profilePage: ProfilePage; githubLogin: string } | null> {
    if (!this.client) return null;

    // Single joined query without N+1 roundtrips (Rule 11.7)
    const { data, error } = await this.client
      .from('profile_pages')
      .select('*, users!inner(github_login)')
      .ilike('users.github_login', username)
      .eq('enabled', true)
      .maybeSingle();

    if (error || !data) return null;

    const userObj = Array.isArray(data.users) ? data.users[0] : data.users;
    return {
      profilePage: this.mapToDomain(data),
      githubLogin: userObj?.github_login || username,
    };
  }

  public async upsert(page: Omit<ProfilePage, 'updatedAt'>): Promise<ProfilePage> {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }

    const payload = {
      user_id: page.userId,
      enabled: page.enabled,
      bio_override: page.bioOverride,
      pinned_links: page.pinnedLinks,
      preset_ids: page.presetIds,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.client
      .from('profile_pages')
      .upsert(payload, { onConflict: 'user_id' })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to upsert profile page: ${error?.message}`);
    }

    return this.mapToDomain(data);
  }

  private mapToDomain(row: any): ProfilePage {
    return {
      userId: row.user_id,
      enabled: Boolean(row.enabled),
      bioOverride: row.bio_override || null,
      pinnedLinks: row.pinned_links || [],
      presetIds: row.preset_ids || [],
      updatedAt: row.updated_at,
    };
  }
}
