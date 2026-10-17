/**
 * Transparent GitHub Rank Scoring Algorithm (Section 6.5)
 *
 * Computes a normalized 0-100 score based on 6 weighted signals:
 * 1. Commits (past year, log-scaled): weight 0.30
 * 2. Stars earned (all owned repos, log-scaled): weight 0.25
 * 3. Pull requests opened (past year): weight 0.15
 * 4. Issues opened + closed (past year): weight 0.10
 * 5. Followers (log-scaled): weight 0.10
 * 6. Contributed-to repos (not owned): weight 0.10
 */

export interface RankInput {
  commits: number;
  stars: number;
  prs: number;
  issues: number;
  followers: number;
  contributedTo: number;
}

export type LetterGrade = 'S' | 'A+' | 'A' | 'A-' | 'B+' | 'B' | 'C';

export interface RankResult {
  score: number;
  grade: LetterGrade;
  primaryDriver: string;
  driverDescription: string;
  breakdown: {
    commitsScore: number;
    starsScore: number;
    prsScore: number;
    issuesScore: number;
    followersScore: number;
    contributedToScore: number;
  };
}

function logScale(value: number, targetMax: number): number {
  if (value <= 0) return 0;
  // Natural log scaling normalized against realistic upper threshold
  const normalized = Math.log(value + 1) / Math.log(targetMax + 1);
  return Math.min(1, Math.max(0, normalized));
}

function linearScale(value: number, targetMax: number): number {
  if (value <= 0) return 0;
  return Math.min(1, Math.max(0, value / targetMax));
}

export function computeRank(input: RankInput): RankResult {
  // Targets for 100% saturation on each signal
  const normalizedCommits = logScale(input.commits, 2500); // 2500 commits/year
  const normalizedStars = logScale(input.stars, 1000); // 1000 stars
  const normalizedPrs = linearScale(input.prs, 100); // 100 PRs
  const normalizedIssues = linearScale(input.issues, 80); // 80 issues
  const normalizedFollowers = logScale(input.followers, 500); // 500 followers
  const normalizedContributed = linearScale(input.contributedTo, 25); // 25 repos

  const commitsScore = normalizedCommits * 30;
  const starsScore = normalizedStars * 25;
  const prsScore = normalizedPrs * 15;
  const issuesScore = normalizedIssues * 10;
  const followersScore = normalizedFollowers * 10;
  const contributedToScore = normalizedContributed * 10;

  const totalScore = Math.round(
    commitsScore + starsScore + prsScore + issuesScore + followersScore + contributedToScore
  );

  let grade: LetterGrade = 'C';
  if (totalScore >= 90) grade = 'S';
  else if (totalScore >= 80) grade = 'A+';
  else if (totalScore >= 65) grade = 'A';
  else if (totalScore >= 50) grade = 'A-';
  else if (totalScore >= 35) grade = 'B+';
  else if (totalScore >= 20) grade = 'B';
  else grade = 'C';

  // Identify highest weighted contribution
  const scores = [
    { name: 'commits', label: 'commit activity', val: commitsScore },
    { name: 'stars', label: 'stargazers earned', val: starsScore },
    { name: 'prs', label: 'pull request velocity', val: prsScore },
    { name: 'issues', label: 'issue resolutions', val: issuesScore },
    { name: 'followers', label: 'community followers', val: followersScore },
    { name: 'contributedTo', label: 'open source contributions', val: contributedToScore },
  ];

  scores.sort((a, b) => b.val - a.val);
  const top = scores[0];

  return {
    score: totalScore,
    grade,
    primaryDriver: top.name,
    driverDescription: `Driven mostly by ${top.label}`,
    breakdown: {
      commitsScore: Math.round(commitsScore * 10) / 10,
      starsScore: Math.round(starsScore * 10) / 10,
      prsScore: Math.round(prsScore * 10) / 10,
      issuesScore: Math.round(issuesScore * 10) / 10,
      followersScore: Math.round(followersScore * 10) / 10,
      contributedToScore: Math.round(contributedToScore * 10) / 10,
    },
  };
}
