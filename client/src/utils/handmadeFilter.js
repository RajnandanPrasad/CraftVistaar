import { NEW_CATEGORIES, CRAFT_SUPPLIES_FALLBACK } from '../constants/categories';

export const HANDMADE_CATEGORIES = NEW_CATEGORIES.filter(cat => cat !== "For You"); // Exclude UI-only "For You"
export const HANDMADE_CATEGORY_KEYWORDS = [
  "jewelry", "accessories", "clothing", "textile", "home", "decor", "kitchen", 
  "art", "collectible", "bag", "footwear", "beauty", "personal", "toy", "baby",
  "craft", "supply", "spiritual", "festive", "gift", "custom", "personalized",
  "food", "beverage", "handmade", "artisan", "pottery", "wood", "painting", "woven"
];

export const HANDMADE_CATEGORY_DISPLAY = NEW_CATEGORIES;


const normalizeText = (value) =>
  value
    ?.toString()
    .trim()
    .toLowerCase()
    .replace(/&/g, " ")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export function normalizeCategoryName(category) {
  return normalizeText(category);
}

export function isHandmadeCategory(category) {
  const normalized = normalizeCategoryName(category);
  if (!normalized) return false;

  if (
    HANDMADE_CATEGORIES.some(
      (allowed) => normalizeCategoryName(allowed) === normalized
    )
  ) {
    return true;
  }

  return HANDMADE_CATEGORY_KEYWORDS.some((keyword) => normalized.includes(keyword));
}

export function filterHandmadeCategories(categories = []) {
  return Array.from(
    new Set(
      categories
        .filter(Boolean)
        .map((category) => category.toString().trim())
        .filter(isHandmadeCategory)
    )
  );
}

export function matchesCategoryFilter(productCategory, categoryFilter) {
  if (!productCategory || !categoryFilter) return false;
  const normalizedProduct = normalizeCategoryName(productCategory);
  const normalizedFilter = normalizeCategoryName(categoryFilter);

  if (!normalizedProduct || !normalizedFilter) return false;
  if (normalizedProduct === normalizedFilter) return true;
  if (
    normalizedProduct.includes(normalizedFilter) ||
    normalizedFilter.includes(normalizedProduct)
  ) {
    return true;
  }

  const filterTokens = normalizedFilter.split(" ").filter(Boolean);
  return filterTokens.every((token) => normalizedProduct.includes(token));
}

export function filterHandmadeProducts(products = []) {
  return products.filter((product) => isHandmadeCategory(product?.category));
}
