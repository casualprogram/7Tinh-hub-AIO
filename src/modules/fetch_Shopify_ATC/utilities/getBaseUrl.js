export default async function getBaseUrl(product_URL) {
  try {
    // break down the URL to different parts: protocol, hostname, pathname
    const parsedUrl = new URL(product_URL);
    //      https: + // + website.com
    return `${parsedUrl.protocol}//${parsedUrl.hostname}`;
  } catch (error) {
    console.error("Invalid product URL provided ");
    return null;
  }
}
