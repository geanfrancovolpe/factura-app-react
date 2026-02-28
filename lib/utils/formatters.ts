/**
 * Format a price value (number or string) to display format
 * @param value - The price value (can be number, string, null, undefined)
 * @param currency - Currency symbol (default: €)
 * @returns Formatted price string
 */
export function formatPrice(value: number | string | null | undefined, currency: string = '€'): string {
  if (value === null || value === undefined) {
    return '-';
  }

  const numValue = typeof value === 'number' ? value : parseFloat(value);
  
  if (isNaN(numValue)) {
    return '-';
  }

  return `${currency}${numValue.toFixed(2)}`;
}

/**
 * Format a date string to display format
 * @param dateString - ISO date string
 * @param includeTime - Whether to include time (default: false)
 * @returns Formatted date string
 */
export function formatDate(dateString: string, includeTime: boolean = false): string {
  const date = new Date(dateString);
  
  if (isNaN(date.getTime())) {
    return '-';
  }

  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  
  const dateStr = `${day}/${month}/${year}`;
  
  if (includeTime) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${dateStr} ${hours}:${minutes}`;
  }
  
  return dateStr;
}
