/**
 * Color palette for user cursors and selections in collaborative editing
 */

export const USER_COLORS = [
  '#FF6B6B', // Red
  '#4ECDC4', // Teal
  '#45B7D1', // Blue
  '#FFA07A', // Light Salmon
  '#98D8C8', // Mint
  '#F7DC6F', // Yellow
  '#BB8FCE', // Purple
  '#85C1E2', // Sky Blue
  '#F8B739', // Orange
  '#52BE80', // Green
  '#EC7063', // Coral
  '#5DADE2', // Light Blue
  '#F1948A', // Pink
  '#7FB3D3', // Steel Blue
  '#F4D03F', // Gold
  '#A569BD', // Medium Purple
];

/**
 * Get a color for a user based on their ID
 */
export function getUserColor(userId: string): string {
  const hash = userId.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  return USER_COLORS[Math.abs(hash) % USER_COLORS.length];
}

/**
 * Generate a random color from the palette
 */
export function getRandomColor(): string {
  return USER_COLORS[Math.floor(Math.random() * USER_COLORS.length)];
}
