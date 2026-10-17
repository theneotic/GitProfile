export interface PinnedLink {
  label: string; // max 40 chars
  url: string; // valid https:// url
}

export interface ProfilePage {
  userId: string; // uuid, FK -> users.id
  enabled: boolean; // default false (Section 7.4)
  bioOverride: string | null; // max 280 chars
  pinnedLinks: PinnedLink[]; // max 5
  presetIds: string[]; // ordered list of CardPreset ids to render
  updatedAt: string;
}
