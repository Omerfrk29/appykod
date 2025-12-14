import { z } from 'zod';

/**
 * Validates both absolute URLs (http/https) and relative paths (starting with /)
 * Allows empty strings for optional fields
 */
export const urlOrPathSchema = z.string().refine(
  (val) => {
    // Allow empty strings (for optional fields)
    if (!val || val.trim() === '') return true;
    
    // Check if it's a valid URL (http:// or https://)
    try {
      const url = new URL(val);
      // Only allow http and https protocols
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch {
      // If not a URL, check if it's a relative path starting with /
      return val.startsWith('/');
    }
  },
  {
    message: 'Must be a valid URL (http:// or https://) or a relative path starting with /',
  }
);

/**
 * Schema for gallery array - accepts URLs or relative paths
 */
export const gallerySchema = z.array(urlOrPathSchema).max(50).optional();

/**
 * Schema for localized text fields (TR/EN)
 */
export const localizedTextSchema = z.object({
  tr: z.string().min(1).max(1000),
  en: z.string().min(1).max(1000),
});

/**
 * Schema for creating a new testimonial
 */
export const createTestimonialSchema = z.object({
  name: localizedTextSchema,
  role: localizedTextSchema,
  content: localizedTextSchema,
  imageUrl: urlOrPathSchema.optional(),
});

/**
 * Schema for updating a testimonial
 */
export const updateTestimonialSchema = z.object({
  name: localizedTextSchema.optional(),
  role: localizedTextSchema.optional(),
  content: localizedTextSchema.optional(),
  imageUrl: urlOrPathSchema.optional(),
});
