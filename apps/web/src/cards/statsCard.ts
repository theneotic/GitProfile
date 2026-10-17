import {
  CardOptions,
  Density,
  Theme,
  IconName,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  icon,
  formatCompact,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
  generateAnimationCss,
  computeRank,
} from './engine/index';
import { StatsCardData, MOCK_STATS } from './mock-data';

interface StatModuleConfig {
  id: string;
  label: string;
  detailedSubtext: string;
  icon: IconName;
  getValue: (data: StatsCardData) => string;
}

const ALL_MODULES: StatModuleConfig[] = [
  {
    id: 'stars',
    label: 'Total Stars Earned',
    detailedSubtext: 'across all owned repositories',
    icon: 'star',
    getValue: (d) => formatCompact(d.totalStars),
  },
  {
    id: 'commits',
    label: 'Total Commits',
    detailedSubtext: 'past 12 months',
    icon: 'commit',
    getValue: (d) => formatCompact(d.totalCommits),
  },
  {
    id: 'prs',
    label: 'Pull Requests Opened',
    detailedSubtext: 'code reviews and merge requests',
    icon: 'pullRequest',
    getValue: (d) => formatCompact(d.pullRequests),
  },
  {
    id: 'issues',
    label: 'Total Issues',
    detailedSubtext: 'opened and resolved',
    icon: 'issue',
    getValue: (d) => formatCompact(d.issues),
  },
  {
    id: 'contribs',
    label: 'Contributed Repositories',
    detailedSubtext: 'third-party open source projects',
    icon: 'branch',
    getValue: (d) => formatCompact(d.contributedTo),
  },
  {
    id: 'rank',
    label: 'Calculated Grade',
    detailedSubtext: 'transparent weighted ranking',
    icon: 'trophy',
    getValue: (d) => {
      if (d.rank) return d.rank.grade;
      const computed = computeRank({
        commits: d.totalCommits,
        stars: d.totalStars,
        prs: d.pullRequests,
        issues: d.issues,
        followers: d.followers,
        contributedTo: d.contributedTo,
      });
      return computed.grade;
    },
  },
];

export function renderStatsCard(
  data: StatsCardData = MOCK_STATS,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  // Filter modules based on query params (e.g. ?modules=stars,commits,prs)
  let activeModules = ALL_MODULES;
  if (options.modules && typeof options.modules === 'string') {
    const requested = options.modules.split(',').map((m) => m.trim().toLowerCase());
    activeModules = ALL_MODULES.filter((m) => requested.includes(m.id));
    if (activeModules.length === 0) activeModules = ALL_MODULES;
  }

  const rowHeight = density === 'compact' ? 24 : density === 'detailed' ? 38 : 30;
  const startY = 75;
  const height = startY + activeModules.length * rowHeight + 25;

  const iconSize = density === 'compact' ? 13 : 16;
  const labelFontSize = density === 'compact' ? 12 : density === 'detailed' ? 14 : 13;
  const valueFontSize = density === 'compact' ? 13 : 14;

  const isAnimated = Boolean(options.animated);

  const rowElements: string[] = [];

  activeModules.forEach((mod, index) => {
    const rowY = startY + index * rowHeight;
    const value = mod.getValue(data);
    const isRank = mod.id === 'rank';

    const rowMarkup: string[] = [
      // Icon
      icon({
        name: mod.icon,
        x: 25,
        y: rowY - (density === 'compact' ? 9 : 11),
        size: iconSize,
        fill: isRank ? theme.accent : theme.secondaryText,
      }),
      // Label
      text({
        x: density === 'compact' ? 44 : 50,
        y: rowY,
        content: mod.label,
        fill: theme.secondaryText,
        fontSize: labelFontSize,
      }),
      // Monospace Tabular Value (Right-Aligned)
      text({
        x: width - 25,
        y: rowY,
        content: value,
        fill: isRank ? theme.accent : theme.primaryText,
        fontSize: valueFontSize,
        fontWeight: 600,
        textAnchor: 'end',
        fontFamily: '"JetBrains Mono", "SF Mono", monospace',
      }),
    ];

    // Detailed density subtext
    if (density === 'detailed') {
      rowMarkup.push(
        text({
          x: 50,
          y: rowY + 16,
          content: mod.detailedSubtext,
          fill: theme.secondaryText,
          fontSize: 10,
          opacity: 0.7,
        })
      );
    }

    if (isAnimated) {
      rowElements.push(`<g class="anim-pulse" style="animation-delay: ${index * 80}ms;">
        ${rowMarkup.join('\n      ')}
      </g>`);
    } else {
      rowElements.push(...rowMarkup);
    }
  });

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: `${data.username}'s GitHub Stats`,
    iconName: 'graph',
    children: rowElements.join('\n  '),
  });

  let styleSheet = '';
  if (isAutoTheme(options)) {
    styleSheet += generateAutoThemeCss(options) + '\n';
  }
  if (isAnimated) {
    styleSheet += generateAnimationCss() + '\n';
  }

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet.trim(),
    ariaLabel: `${data.username}'s GitHub Statistics Card`,
  });
}
