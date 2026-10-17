import { CardType } from '../../cards/engine/types.js';

export interface CardPreset {
  id: string; // uuid
  userId: string; // uuid, FK -> users.id
  slug: string; // 8-char url-safe, unique
  cardType: CardType; // the closed union from cards/engine/types.ts
  name: string; // user-given label, max 60 chars
  options: Record<string, unknown>; // validated against that cardType's Zod schema
  sponsor: boolean; // default false (Section 9)
  createdAt: string; // ISO
  updatedAt: string; // ISO
}
