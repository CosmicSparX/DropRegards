/**
 * Truncates a wallet address for display purposes
 * @param address The full wallet address
 * @param start Number of characters to show from the start
 * @param end Number of characters to show from the end
 * @returns Truncated address string
 */
export function truncateAddress(address: string, start = 4, end = 4): string {
  if (!address) return '';
  if (address.length <= start + end) return address;
  
  return `${address.slice(0, start)}...${address.slice(-end)}`;
} 