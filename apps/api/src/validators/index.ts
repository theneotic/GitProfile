import { z } from 'zod';
import { CardType } from '../cards/engine/types.js';

// GitHub username: 1-39 alphanumeric or single hyphens, cannot start or end with hyphen
export const githubUsernameRegex = /^[a-zA-Z0-9](?:[a-zA-Z0-9]|-(?=[a-zA-Z0-9])){0,38}$/;

export const githubUsernameSchema = z
  .string()
  .min(1)
  .max(39)
  .regex(githubUsernameRegex, 'Invalid GitHub username format');

export const baseCardOptionsSchema = z.object({
  theme: z.string().optional(),
  accent: z.string().optional(),
  background: z.string().optional(),
  border: z.string().optional(),
  primary_text: z.string().optional(),
  secondary_text: z.string().optional(),
  border_radius: z.union([z.number(), z.string()]).optional(),
  hide_border: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' || v === '1' : Boolean(v)))
    .optional(),
  font_family: z.string().optional(),
  font_style: z.enum(['sans', 'serif', 'mono', 'rounded']).optional(),
  layout: z.enum(['compact', 'cozy', 'detailed']).optional(),
  animated: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' || v === '1' : Boolean(v)))
    .optional(),
  sponsor: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' || v === '1' : Boolean(v)))
    .optional(),
  mock: z
    .union([z.boolean(), z.string()])
    .transform((v) => (typeof v === 'string' ? v === 'true' || v === '1' : Boolean(v)))
    .optional(),
});

export const profileCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
});

export const statsCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
  modules: z.string().optional(),
});

export const languagesCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
  layout_mode: z.enum(['compact', 'detailed']).optional(),
  limit: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
});

export const streakCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
});

export const repositoryCardOptionsSchema = baseCardOptionsSchema.extend({
  owner: githubUsernameSchema,
  repo: z.string().min(1).max(100),
});

export const rankingsCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
});

export const trophiesCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
});

export const topContributedCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
  limit: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
});

export const wrappedCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
  year: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
});

export const activityGraphCardOptionsSchema = baseCardOptionsSchema.extend({
  username: githubUsernameSchema,
  year: z.union([z.number(), z.string()]).transform((v) => Number(v)).optional(),
});

export function schemaFor(cardType: CardType): z.ZodObject<any> {
  switch (cardType) {
    case 'profile':
      return profileCardOptionsSchema;
    case 'stats':
      return statsCardOptionsSchema;
    case 'languages':
      return languagesCardOptionsSchema;
    case 'streak':
      return streakCardOptionsSchema;
    case 'repository':
      return repositoryCardOptionsSchema;
    case 'rankings':
      return rankingsCardOptionsSchema;
    case 'trophies':
      return trophiesCardOptionsSchema;
    case 'topContributed':
      return topContributedCardOptionsSchema;
    case 'wrapped':
      return wrappedCardOptionsSchema;
    case 'activityGraph':
      return activityGraphCardOptionsSchema;
    default:
      return baseCardOptionsSchema;
  }
}

// Preset CRUD schemas
export const createPresetSchema = z.object({
  cardType: z.enum([
    'profile',
    'stats',
    'languages',
    'streak',
    'repository',
    'rankings',
    'trophies',
    'topContributed',
    'wrapped',
    'activityGraph',
  ]),
  name: z.string().min(1).max(60),
  options: z.record(z.unknown()),
});

export const updatePresetSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  options: z.record(z.unknown()).optional(),
  cardType: z
    .enum([
      'profile',
      'stats',
      'languages',
      'streak',
      'repository',
      'rankings',
      'trophies',
      'topContributed',
      'wrapped',
      'activityGraph',
    ])
    .optional(),
});

export const updateProfilePageSchema = z.object({
  enabled: z.boolean(),
  bioOverride: z.string().max(280).nullable().optional(),
  pinnedLinks: z
    .array(
      z.object({
        label: z.string().max(40),
        url: z.string().url(),
      })
    )
    .max(5)
    .optional(),
  presetIds: z.array(z.string()).optional(),
});
