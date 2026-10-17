/**
 * Animation utilities for SVG cards.
 * Provides CSS keyframes for progressive enhancement on cards when ?animated=true is passed.
 * Used exclusively on stats and streak cards per Section 6.7.
 */

export function generateAnimationCss(): string {
  return `
@keyframes pulseLanding {
  0% {
    transform: scale(0.92);
    opacity: 0.2;
  }
  60% {
    transform: scale(1.04);
    opacity: 1;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

@keyframes streakGlow {
  0%, 100% {
    filter: drop-shadow(0 0 1px rgba(61, 220, 132, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 6px rgba(61, 220, 132, 0.8));
  }
}

@keyframes growBar {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}

.anim-pulse {
  transform-origin: center;
  animation: pulseLanding 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.anim-streak-center {
  transform-origin: center;
  animation: pulseLanding 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards, streakGlow 3s ease-in-out infinite;
}

.anim-bar {
  transform-origin: left;
  animation: growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`.trim();
}
