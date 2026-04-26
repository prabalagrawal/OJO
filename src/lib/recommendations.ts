import { Product } from "../data/product-dataset";

/**
 * Calculates a weighted recommendation score for a target product against a reference product.
 * 
 * SCORING SYSTEM:
 * - Same category → +5
 * - Same origin (state) → +4
 * - Similar price range (±30%) → +3
 * - Tag match → +2 per match
 * - Popularity score → + (popularity_score / 20)
 * 
 * @param currentProduct The product being viewed
 * @param candidateProduct The product to potentially recommend
 * @returns A numerical score representing relevance
 */
export function calculateRelevanceScore(currentProduct: Product, candidateProduct: Product): number {
  if (currentProduct.id === candidateProduct.id) return -1; // Exclude current

  let score = 0;

  // 1. Same Category (+5)
  if (currentProduct.category === candidateProduct.category) {
    score += 5;
  }

  // 2. Same Origin (+4)
  if (currentProduct.origin === candidateProduct.origin) {
    score += 4;
  }

  // 3. Similar Price Range (+3)
  const priceDiff = Math.abs(currentProduct.price - candidateProduct.price);
  const priceMargin = currentProduct.price * 0.3;
  if (priceDiff <= priceMargin) {
    score += 3;
  }

  // 4. Tag Match (+2 per match)
  const commonTags = currentProduct.tags.filter(tag => candidateProduct.tags.includes(tag));
  score += (commonTags.length * 2);

  // 5. Popularity Score (+ popularity / 20)
  score += (candidateProduct.popularity_score / 20);

  return score;
}

/**
 * Gets top recommendations based on a weighted scoring algorithm.
 * 
 * @param productId ID of the currently viewed product
 * @param productList Full list of available products
 * @param count Number of recommendations to return
 * @returns Sorted list of relevant products
 */
export function getRecommendations(
  productId: string, 
  productList: Product[], 
  count: number = 6
): Product[] {
  const currentProduct = productList.find(p => p.id === productId);
  if (!currentProduct) return [];

  // Map each product to a score
  const scoredProducts = productList
    .filter(p => p.id !== productId) // Filter current product
    .map(p => ({
      product: p,
      score: calculateRelevanceScore(currentProduct, p)
    }));

  // Sort by score descending
  scoredProducts.sort((a, b) => b.score - a.score);

  // Return top products
  return scoredProducts.slice(0, count).map(sp => sp.product);
}
