export function generateParticipantId(): string {
  const hex = Math.random().toString(16).substring(2, 6).toUpperCase();
  return `TD-OMNI-${hex}`;
}
