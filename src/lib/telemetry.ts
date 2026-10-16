import { CyberStatsData } from './types';

export interface ClearanceTier {
  code: string;
  level: string;
  title: string;
  color: string;
  score: number;
}

/**
 * Computes Cybercore Security / Operator Clearance Level based on activity telemetry
 */
export function calculateClearance(stats: CyberStatsData): ClearanceTier {
  const score = Math.round(
    stats.totalCommits * 1.0 +
    stats.totalStars * 12.0 +
    stats.pullRequests * 6.0 +
    stats.issues * 2.0 +
    stats.currentStreak * 5.0
  );

  if (score >= 5000) {
    return {
      code: 'LVL-0 / BLACK-ICE',
      level: 'CLASS-S',
      title: 'ARCHITECT PRIME',
      color: '#ff0055',
      score,
    };
  }
  if (score >= 2500) {
    return {
      code: 'LVL-1 / CIPHER',
      level: 'CLASS-A',
      title: 'SENTINEL SPECIALIST',
      color: '#00f0ff',
      score,
    };
  }
  if (score >= 1000) {
    return {
      code: 'LVL-2 / NETRUNNER',
      level: 'CLASS-B',
      title: 'OPERATIVE ELITE',
      color: '#39ff14',
      score,
    };
  }
  if (score >= 400) {
    return {
      code: 'LVL-3 / SYNDICATE',
      level: 'CLASS-C',
      title: 'TACTICAL INGENIEUR',
      color: '#ffaa00',
      score,
    };
  }
  return {
    code: 'LVL-4 / RECON',
    level: 'CLASS-D',
    title: 'FIELD PROTOCOL',
    color: '#00f0ff',
    score,
  };
}

/**
 * Generates coordinate telemetry string based on username
 */
export function generateCoordinates(username: string): string {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = (hash << 5) - hash + username.charCodeAt(i);
    hash |= 0;
  }
  const lat = (Math.abs(hash % 9000) / 100).toFixed(2);
  const lon = (Math.abs((hash * 31) % 18000) / 100).toFixed(2);
  return `SEC-GRID // ${lat}°N, ${lon}°E [SYS_ONLINE]`;
}
