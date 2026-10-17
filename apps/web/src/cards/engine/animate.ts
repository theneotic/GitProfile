/**
 * Animation utilities for SVG cards.
 * Provides CSS keyframes for progressive enhancement on cards when ?animated=true is passed.
 * Engineered for 60fps GPU acceleration across all browsers.
 */

export function generateAnimationCss(): string {
  return `
@keyframes slideFadeIn {
  0% {
    opacity: 0;
    transform: translateY(8px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes streakGlow {
  0%, 100% {
    filter: drop-shadow(0 0 1px rgba(61, 220, 132, 0.4));
  }
  50% {
    filter: drop-shadow(0 0 8px rgba(61, 220, 132, 0.85));
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
  transform-box: fill-box;
  transform-origin: center left;
  opacity: 0;
  animation: slideFadeIn 0.55s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.anim-streak-center {
  transform-box: fill-box;
  transform-origin: center;
  animation: slideFadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards, streakGlow 3s ease-in-out infinite 0.6s;
}

.anim-bar {
  transform-box: fill-box;
  transform-origin: left;
  animation: growBar 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
`.trim();
}
