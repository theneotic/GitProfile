import { SupabaseClient } from '@supabase/supabase-js';
import { User } from '../../../domain/entities/User.js';
import { IUserRepository } from '../../../domain/interfaces/IUserRepository.js';
import { getSupabaseClient } from '../supabaseClient.js';

export class SupabaseUserRepository implements IUserRepository {
  constructor(private client: SupabaseClient | null = getSupabaseClient()) {}

  public async findById(id: string): Promise<User | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async findByGithubId(githubId: string): Promise<User | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .eq('github_id', githubId)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async findByGithubLogin(login: string): Promise<User | null> {
    if (!this.client) return null;
    const { data, error } = await this.client
      .from('users')
      .select('*')
      .ilike('github_login', login)
      .maybeSingle();

    if (error || !data) return null;
    return this.mapToDomain(data);
  }

  public async upsert(
    userData: Omit<User, 'id' | 'createdAt' | 'updatedAt'> & { id?: string }
  ): Promise<User> {
    if (!this.client) {
      throw new Error('Supabase client not initialized');
    }

    const payload = {
      github_id: userData.githubId,
      github_login: userData.githubLogin,
      name: userData.name,
      email: userData.email,
      avatar_url: userData.avatarUrl,
      access_token: userData.accessToken,
      refresh_token: userData.refreshToken,
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await this.client
      .from('users')
      .upsert(payload, { onConflict: 'github_id' })
      .select()
      .single();

    if (error || !data) {
      throw new Error(`Failed to upsert user: ${error?.message}`);
    }

    return this.mapToDomain(data);
  }

  private mapToDomain(row: any): User {
    return {
      id: row.id,
      githubId: row.github_id,
      githubLogin: row.github_login,
      name: row.name,
      email: row.email,
      avatarUrl: row.avatar_url,
      accessToken: row.access_token,
      refreshToken: row.refresh_token,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }
}
