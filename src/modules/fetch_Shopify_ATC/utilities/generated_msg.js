export default async function generateMsg(product, shopDomain) {
  if (!product || !product.variants) {
    throw new Error("No product founded from the link");
  }

  try {
    const discordLines = [
      "**Product Variants and ATC Links**",
      `**${product.title}**`,
    ];
    product.variants.forEach((variant) => {
      const atcLink = `https://${shopDomain}/cart/${variant.id}:1`;
      discordLines.push(`**${variant.title}** : ${atcLink}`);
    });
    return discordLines.join("\n");
  } catch (error) {
    console.error("Error in generateMsg function:", error);
    throw error;
  }
}
