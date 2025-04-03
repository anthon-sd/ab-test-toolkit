export function formatDuration(days: number): string {
  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'}`;
  } else if (days < 30) {
    const weeks = Math.ceil(days / 7);
    return `${weeks} week${weeks === 1 ? '' : 's'}`;
  } else {
    const months = Math.ceil(days / 30);
    return `${months} month${months === 1 ? '' : 's'}`;
  }
} 