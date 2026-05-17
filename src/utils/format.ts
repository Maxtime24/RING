export function formatMinutesAsHours(minutes: number) {
  const hours = Math.floor(minutes / 60);
  const remainder = minutes % 60;
  return `${hours}h ${remainder}m`;
}

export function formatPercentage(value: number) {
  return `${Math.round(value)}%`;
}

export function formatTimestamp(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return timestamp;
  }
}
