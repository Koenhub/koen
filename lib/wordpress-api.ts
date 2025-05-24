// WordPress API utilities

// Simple in-memory cache for client-side
const apiCache: Record<string, { data: any; timestamp: number }> = {}
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes in milliseconds

export interface WPCategory {
  id: number
  count: number
  description: string
  link: string
  name: string
  slug: string
  taxonomy: string
  parent: number
}

export interface WPPost {
  id: number
  date: string
  slug: string
  link: string
  title: {
    rendered: string
  }
  excerpt: {
    rendered: string
  }
  content: {
    rendered: string
  }
  categories: number[]
  featured_media: number
}

export interface WPMedia {
  id: number
  source_url: string
  alt_text: string
}

const API_URL = "https://koenvandemeent.nl/wp-json"

export async function getCategories(): Promise<WPCategory[]> {
  const cacheKey = "categories"

  // Check if we have a valid cached response
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data
  }

  try {
    const response = await fetch(`${API_URL}/wp/v2/categories?per_page=100`)
    if (!response.ok) throw new Error("Failed to fetch categories")
    const data = await response.json()
    const filteredData = data.filter((cat: WPCategory) => cat.count > 0)

    // Cache the response
    apiCache[cacheKey] = { data: filteredData, timestamp: Date.now() }

    return filteredData
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
}

export async function getPosts(): Promise<WPPost[]> {
  const cacheKey = "all_posts"

  // Check if we have a valid cached response
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data
  }

  try {
    const response = await fetch(`${API_URL}/wp/v2/posts?per_page=100&_embed=1`)
    if (!response.ok) throw new Error("Failed to fetch posts")
    const data = await response.json()

    // Cache the response
    apiCache[cacheKey] = { data, timestamp: Date.now() }

    return data
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPostsByCategory(categoryId: number): Promise<WPPost[]> {
  const cacheKey = `posts_category_${categoryId}`

  // Check if we have a valid cached response
  if (apiCache[cacheKey] && Date.now() - apiCache[cacheKey].timestamp < CACHE_DURATION) {
    return apiCache[cacheKey].data
  }

  try {
    const response = await fetch(`${API_URL}/wp/v2/posts?categories=${categoryId}&per_page=100&_embed=1`)
    if (!response.ok) throw new Error("Failed to fetch posts by category")
    const data = await response.json()

    // Cache the response
    apiCache[cacheKey] = { data, timestamp: Date.now() }

    return data
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error)
    return []
  }
}

export async function getPostById(postId: number): Promise<WPPost | null> {
  try {
    const response = await fetch(`${API_URL}/wp/v2/posts/${postId}?_embed=1`)
    if (!response.ok) throw new Error("Failed to fetch post")
    return await response.json()
  } catch (error) {
    console.error(`Error fetching post ${postId}:`, error)
    return null
  }
}

export async function getMediaById(mediaId: number): Promise<WPMedia | null> {
  try {
    const response = await fetch(`${API_URL}/wp/v2/media/${mediaId}`)
    if (!response.ok) throw new Error("Failed to fetch media")
    return await response.json()
  } catch (error) {
    console.error(`Error fetching media ${mediaId}:`, error)
    return null
  }
}

export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
}
