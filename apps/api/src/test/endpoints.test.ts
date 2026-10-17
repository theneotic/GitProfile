import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { app } from '../main.js';
import { container } from '../container.js';
import { defaultSessionService } from '../application/services/SessionService.js';

describe('API Endpoints Suite (Section 10 & 24)', () => {
  let userAToken: string;
  let userBToken: string;
  let userAId: string;
  let userBId: string;

  beforeAll(async () => {
    // Seed two test users in memory repository
    const userA = await container.userRepo.upsert({
      githubId: '1001',
      githubLogin: 'user-alpha',
      name: 'User Alpha',
      email: 'alpha@test.com',
      avatarUrl: 'https://example.com/alpha.png',
    });
    userAId = userA.id;
    userAToken = defaultSessionService.generateTokens({
      sub: userA.id,
      login: userA.githubLogin,
    }).accessToken;

    const userB = await container.userRepo.upsert({
      githubId: '1002',
      githubLogin: 'user-beta',
      name: 'User Beta',
      email: 'beta@test.com',
      avatarUrl: 'https://example.com/beta.png',
    });
    userBId = userB.id;
    userBToken = defaultSessionService.generateTokens({
      sub: userB.id,
      login: userB.githubLogin,
    }).accessToken;
  });

  it('GET /health returns 200 OK', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.text).toBe('OK');
  });

  const getSvg = (res: request.Response): string => res.text || (res.body ? res.body.toString('utf-8') : '');

  describe('Card Endpoints (/cards/*)', () => {
    it('serves stats.svg with Content-Type: image/svg+xml and caching headers', async () => {
      const res = await request(app)
        .get('/cards/stats.svg?username=theneotic&mock=true')
        .expect('Content-Type', /image\/svg\+xml/);

      expect(res.status).toBe(200);
      expect(res.headers['cache-control']).toContain('max-age=300');
      const svg = getSvg(res);
      expect(svg).toContain('<svg');
      expect(svg).toContain('instrumentstats.dev');
    });

    it('gracefully handles invalid username with a valid Error SVG instead of 500 HTML', async () => {
      const res = await request(app)
        .get('/cards/stats.svg?username=-invalid--username-')
        .expect('Content-Type', /image\/svg\+xml/);

      expect(res.status).toBe(200);
      const svg = getSvg(res);
      expect(svg).toContain('<svg');
      expect(svg).toContain('Card Render Notice');
    });

    it('renders all 10 card endpoints via /cards/:type.svg', async () => {
      const types = [
        'profile',
        'stats',
        'languages',
        'streak',
        'repository?owner=theneotic&repo=instrument-stats',
        'rankings',
        'trophies',
        'topContributed',
        'wrapped',
        'activityGraph',
      ];

      for (const t of types) {
        const url = `/cards/${t}${t.includes('?') ? '&' : '?'}username=theneotic&mock=true`;
        const res = await request(app).get(url);
        expect(res.status).toBe(200);
        expect(res.headers['content-type']).toContain('image/svg+xml');
        const svg = getSvg(res);
        expect(svg).toContain('<svg');
      }
    });
  });

  describe('Preset CRUD & Isolation (/api/v1/presets)', () => {
    let presetId: string;
    let presetSlug: string;

    it('creates a new card preset with an 8-character unique slug', async () => {
      const res = await request(app)
        .post('/api/v1/presets')
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          cardType: 'stats',
          name: 'My Dark Terminal Card',
          options: {
            username: 'theneotic',
            theme: 'terminal',
            layout: 'cozy',
          },
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.id).toBeDefined();
      expect(res.body.data.slug).toHaveLength(8);
      expect(res.body.data.name).toBe('My Dark Terminal Card');

      presetId = res.body.data.id;
      presetSlug = res.body.data.slug;
    });

    it('serves the saved preset card via /cards/by-preset/:slug.svg', async () => {
      const res = await request(app)
        .get(`/cards/by-preset/${presetSlug}.svg?mock=true`)
        .expect('Content-Type', /image\/svg\+xml/);

      expect(res.status).toBe(200);
      const svg = getSvg(res);
      expect(svg).toContain('<svg');
    });

    it('lists presets for the authenticated user with keyset pagination', async () => {
      const res = await request(app)
        .get('/api/v1/presets')
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.items.length).toBeGreaterThanOrEqual(1);
    });

    it('ENFORCES ISOLATION: User B CANNOT edit User A preset (Rule 11.5)', async () => {
      const res = await request(app)
        .put(`/api/v1/presets/${presetId}`)
        .set('Authorization', `Bearer ${userBToken}`)
        .send({
          name: 'Hacked by User B',
        });

      expect(res.status).toBe(404);
    });

    it('ENFORCES ISOLATION: User B CANNOT delete User A preset', async () => {
      const res = await request(app)
        .delete(`/api/v1/presets/${presetId}`)
        .set('Authorization', `Bearer ${userBToken}`);

      expect(res.status).toBe(404);
    });

    it('Owner (User A) CAN update preset while preserving the original slug', async () => {
      const res = await request(app)
        .put(`/api/v1/presets/${presetId}`)
        .set('Authorization', `Bearer ${userAToken}`)
        .send({
          name: 'Renamed Preset',
        });

      expect(res.status).toBe(200);
      expect(res.body.data.name).toBe('Renamed Preset');
      expect(res.body.data.slug).toBe(presetSlug); // Slug unchanged!
    });

    it('Owner (User A) CAN delete their own preset', async () => {
      const res = await request(app)
        .delete(`/api/v1/presets/${presetId}`)
        .set('Authorization', `Bearer ${userAToken}`);

      expect(res.status).toBe(204);
    });
  });

  describe('Session & Token Security (Section 8)', () => {
    it('rotates refresh tokens and detects reuse', async () => {
      const initialTokens = defaultSessionService.generateTokens({
        sub: userAId,
        login: 'user-alpha',
      });

      // Legitimate rotation
      const rotatedTokens = await defaultSessionService.refreshTokens(
        initialTokens.refreshToken,
        'user-alpha'
      );
      expect(rotatedTokens).not.toBeNull();
      expect(rotatedTokens!.accessToken).toBeDefined();

      // Malicious or accidental reuse of already rotated token
      const replayed = await defaultSessionService.refreshTokens(
        initialTokens.refreshToken,
        'user-alpha'
      );
      expect(replayed).toBeNull(); // Immediately rejected!
    });
  });
});
