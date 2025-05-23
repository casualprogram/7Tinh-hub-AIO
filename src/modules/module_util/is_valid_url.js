/**
 * This function use to validate an URL.
 * @param {string} url - The URL to validate
 * @returns true if the URL is valid, false otherwise
 */
export default async function isValidUrl(url) {
  // Check if the URL is empty or null
  if (!url || !url.trim()) return False;
  // Check if the URL starts with http:// or https://
  const urlPattern = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-./?%&=]*)?$/;
  return urlPattern.test(url);
}
