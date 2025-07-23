/**
 * Centralized article ID collections for ArticleCarousel components
 *
 * This file contains all hardcoded article IDs used in carousels throughout the app.
 * Centralizing them here makes it easier to maintain and update article references.
 */

export const ARTICLE_COLLECTIONS = {
  // Career page articles
  ALIGNMENT_RESEARCH: ['8U32'],
  GOVERNANCE_POLICY: ['9YG8'],
  FIELD_BUILDING: ['8U2P', '8U2W', '8U2R', '8U2Q'],

  // Knowledge page articles
  BUILDING_KNOWLEDGE: ['NM3T', 'NM3Q'],

  // Volunteer page articles
  VOLUNTEERING: ['NM27', 'NF8E'],

  // Donate page articles
  DONATING: ['6481', '8U2Y', '8U2X'],

  // Grassroots page articles
  GRASSROOTS_ACTIVISM: ['8QH5'],
} as const

// Type for article collection keys
export type ArticleCollectionKey = keyof typeof ARTICLE_COLLECTIONS
