import { describe, it, expect } from 'vitest';
import { CARD_REGISTRY, renderCardByType } from './registry.js';
import { CardType } from './engine/types.js';
import { THEMES } from './engine/theme.js';
import { computeRank } from './engine/rank.js';
import { escapeXml } from './engine/helpers.js';

describe('Card Engine & 10 Card Renderers', () => {
  const cardTypes = Object.keys(CARD_REGISTRY) as CardType[];

  it('contains all 10 required card types in registry', () => {
    expect(cardTypes).toHaveLength(10);
    expect(cardTypes).toContain('profile');
    expect(cardTypes).toContain('stats');
    expect(cardTypes).toContain('languages');
    expect(cardTypes).toContain('streak');
    expect(cardTypes).toContain('repository');
    expect(cardTypes).toContain('rankings');
    expect(cardTypes).toContain('trophies');
    expect(cardTypes).toContain('topContributed');
    expect(cardTypes).toContain('wrapped');
    expect(cardTypes).toContain('activityGraph');
  });

  cardTypes.forEach((type) => {
    it(`renders valid SVG for card type: ${type}`, () => {
      const svg = renderCardByType(type, null, { mock: true });
      expect(svg).toBeDefined();
      expect(svg.startsWith('<svg')).toBe(true);
      expect(svg.endsWith('</svg>')).toBe(true);
      expect(svg).toContain('xmlns="http://www.w3.org/2000/svg"');
      expect(svg).toContain('instrumentstats.dev');
    });

    it(`renders across densities (compact, cozy, detailed) for: ${type}`, () => {
      const compactSvg = renderCardByType(type, null, { mock: true, layout: 'compact' });
      const cozySvg = renderCardByType(type, null, { mock: true, layout: 'cozy' });
      const detailedSvg = renderCardByType(type, null, { mock: true, layout: 'detailed' });

      expect(compactSvg).toContain('<svg');
      expect(cozySvg).toContain('<svg');
      expect(detailedSvg).toContain('<svg');
    });

    it(`renders with theme=auto and embeds prefers-color-scheme for: ${type}`, () => {
      const autoSvg = renderCardByType(type, null, { mock: true, theme: 'auto' });
      expect(autoSvg).toContain('@media (prefers-color-scheme: light)');
      expect(autoSvg).toContain('@media (prefers-color-scheme: dark)');
      expect(autoSvg).toContain('var(--card-bg)');
    });
  });

  it('supports all 14 published community themes without throwing', () => {
    const themeNames = Object.keys(THEMES);
    expect(themeNames.length).toBeGreaterThanOrEqual(14);
    expect(themeNames).toContain('terminal');
    expect(themeNames).toContain('dracula');
    expect(themeNames).toContain('nord');
    expect(themeNames).toContain('tokyo-night');
    expect(themeNames).toContain('catppuccin-mocha');

    themeNames.forEach((theme) => {
      const svg = renderCardByType('stats', null, { mock: true, theme });
      expect(svg).toContain('<svg');
    });
  });

  it('escapes XML special characters to prevent injection', () => {
    const malicious = '<script>alert("xss")</script> & \' "';
    const escaped = escapeXml(malicious);
    expect(escaped).toBe('&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt; &amp; &apos; &quot;');
  });

  it('computes transparent rank score and letter grade deterministically', () => {
    const highRank = computeRank({
      commits: 2200,
      stars: 800,
      prs: 90,
      issues: 70,
      followers: 400,
      contributedTo: 20,
    });
    expect(highRank.score).toBeGreaterThanOrEqual(80);
    expect(['S', 'A+']).toContain(highRank.grade);
    expect(highRank.driverDescription).toContain('Driven mostly by');

    const lowRank = computeRank({
      commits: 10,
      stars: 0,
      prs: 0,
      issues: 0,
      followers: 2,
      contributedTo: 0,
    });
    expect(lowRank.grade).toBe('C');
  });

  it('renders progressive CSS animations on stats and streak cards when animated=true', () => {
    const animatedStats = renderCardByType('stats', null, { mock: true, animated: true });
    expect(animatedStats).toContain('anim-pulse');
    expect(animatedStats).toContain('@keyframes pulseLanding');

    const animatedStreak = renderCardByType('streak', null, { mock: true, animated: true });
    expect(animatedStreak).toContain('anim-streak-center');
    expect(animatedStreak).toContain('@keyframes streakGlow');
  });
});
