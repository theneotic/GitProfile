import {
  CardOptions,
  Density,
  Theme,
  resolveThemeWithOptions,
  svgDocument,
  renderCardFrame,
  getCardWidth,
  text,
  line,
  icon,
  escapeXml,
  truncate,
  formatCompact,
  isAutoTheme,
  getAutoTheme,
  generateAutoThemeCss,
} from './engine/index.js';
import { ProfileCardData, MOCK_PROFILE } from './mock-data.js';

export function renderProfileCard(
  data: ProfileCardData = MOCK_PROFILE,
  options: CardOptions = {}
): string {
  const density: Density = (options.layout as Density) || 'cozy';
  const width = getCardWidth(density, 400);

  const theme: Theme = isAutoTheme(options)
    ? getAutoTheme(options)
    : resolveThemeWithOptions(options);

  const height = density === 'compact' ? 180 : density === 'detailed' ? 220 : 200;

  const displayName = data.name || data.username;
  const truncatedBio = data.bio
    ? truncate(data.bio, density === 'compact' ? 40 : density === 'detailed' ? 65 : 52)
    : '';

  const joinedDate = data.createdAt
    ? new Date(data.createdAt).toLocaleDateString('en-US', {
        month: 'short',
        year: 'numeric',
      })
    : '';

  const avatarX = 25;
  const avatarY = 65;
  const avatarSize = density === 'compact' ? 44 : 52;
  const avatarRadius = avatarSize / 2;

  // Clip path id for avatar
  const clipId = `avatar-clip-${Math.random().toString(36).substring(2, 8)}`;

  const bodyElements: string[] = [];

  // Avatar with circular clip
  bodyElements.push(`
    <clipPath id="${clipId}">
      <circle cx="${avatarX + avatarRadius}" cy="${avatarY + avatarRadius}" r="${avatarRadius}" />
    </clipPath>
    <circle cx="${avatarX + avatarRadius}" cy="${avatarY + avatarRadius}" r="${avatarRadius}" fill="${theme.progressColors.background}" />
    ${
      data.avatarUrl
        ? `<image href="${escapeXml(data.avatarUrl)}" x="${avatarX}" y="${avatarY}" width="${avatarSize}" height="${avatarSize}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice" />`
        : ''
    }
  `);

  // Name & Handle
  const textLeft = avatarX + avatarSize + 14;
  bodyElements.push(
    text({
      x: textLeft,
      y: avatarY + 20,
      content: truncate(displayName, 24),
      fill: theme.primaryText,
      fontSize: density === 'compact' ? 15 : 17,
      fontWeight: 600,
    }),
    text({
      x: textLeft,
      y: avatarY + 38,
      content: `@${data.username}`,
      fill: theme.secondaryText,
      fontSize: density === 'compact' ? 11 : 12,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // Bio
  let nextY = avatarY + avatarSize + 18;
  if (truncatedBio) {
    bodyElements.push(
      text({
        x: 25,
        y: nextY,
        content: truncatedBio,
        fill: theme.secondaryText,
        fontSize: density === 'compact' ? 11 : 12,
      })
    );
    nextY += 22;
  }

  // Company if present & space permits
  if (data.company && density !== 'compact') {
    bodyElements.push(
      icon({
        name: 'organization',
        x: 25,
        y: nextY - 11,
        size: 14,
        fill: theme.secondaryText,
      }),
      text({
        x: 44,
        y: nextY,
        content: truncate(data.company, 32),
        fill: theme.secondaryText,
        fontSize: 11,
      })
    );
    nextY += 22;
  }

  // Divider line before footer stats
  const statsY = height - 35;
  bodyElements.push(
    line({
      x1: 25,
      y1: statsY - 15,
      x2: width - 25,
      y2: statsY - 15,
      stroke: theme.border,
      strokeOpacity: 0.5,
    })
  );

  // Stats columns (Repos, Followers, Joined)
  const colWidth = (width - 50) / 3;

  // Repos
  bodyElements.push(
    icon({
      name: 'repo',
      x: 25,
      y: statsY - 10,
      size: 13,
      fill: theme.accent,
    }),
    text({
      x: 42,
      y: statsY,
      content: `${formatCompact(data.publicRepos)} repos`,
      fill: theme.primaryText,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // Followers
  bodyElements.push(
    icon({
      name: 'followers',
      x: 25 + colWidth,
      y: statsY - 10,
      size: 13,
      fill: theme.accent,
    }),
    text({
      x: 25 + colWidth + 17,
      y: statsY,
      content: `${formatCompact(data.followers)} followers`,
      fill: theme.primaryText,
      fontSize: 11,
      fontWeight: 600,
      fontFamily: '"JetBrains Mono", monospace',
    })
  );

  // Joined date
  if (joinedDate) {
    bodyElements.push(
      icon({
        name: 'calendar',
        x: 25 + colWidth * 2,
        y: statsY - 10,
        size: 13,
        fill: theme.secondaryText,
      }),
      text({
        x: 25 + colWidth * 2 + 17,
        y: statsY,
        content: joinedDate,
        fill: theme.secondaryText,
        fontSize: 11,
      })
    );
  }

  const frameContent = renderCardFrame({
    width,
    height,
    theme,
    options,
    title: 'GitHub Profile',
    iconName: 'terminal',
    children: bodyElements.join('\n  '),
  });

  const styleSheet = isAutoTheme(options) ? generateAutoThemeCss(options) : '';

  return svgDocument({
    width,
    height,
    content: frameContent,
    style: styleSheet,
    ariaLabel: `${data.username}'s GitHub Profile`,
  });
}
