import "server-only"
import { cache } from "react"
import type { WPCategory, WPPost } from "./wordpress-api"

const API_URL = "https://koenvandemeent.nl/wp-json"

// Cache the API requests with React's cache function
export const getCategories = cache(async (): Promise<WPCategory[]> => {
  try {
    const response = await fetch(`${API_URL}/wp/v2/categories?per_page=100`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) throw new Error("Failed to fetch categories")
    const data = await response.json()
    return data.filter((cat: WPCategory) => cat.count > 0)
  } catch (error) {
    console.error("Error fetching categories:", error)
    return []
  }
})

export const getPosts = cache(async (): Promise<WPPost[]> => {
  try {
    const response = await fetch(`${API_URL}/wp/v2/posts?per_page=100&_embed=1`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) throw new Error("Failed to fetch posts")
    return await response.json()
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
})

export const getPostsByCategory = cache(async (categoryId: number): Promise<WPPost[]> => {
  try {
    const response = await fetch(`${API_URL}/wp/v2/posts?categories=${categoryId}&per_page=100&_embed=1`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) throw new Error("Failed to fetch posts by category")
    return await response.json()
  } catch (error) {
    console.error(`Error fetching posts for category ${categoryId}:`, error)
    return []
  }
})

export const getPostBySlug = cache(async (slug: string): Promise<WPPost | null> => {
  try {
    const response = await fetch(`${API_URL}/wp/v2/posts?slug=${slug}&_embed=1`, {
      next: { revalidate: 86400 }, // Cache for 24 hours
    })

    if (!response.ok) throw new Error("Failed to fetch post")
    const posts = await response.json()
    return posts.length > 0 ? posts[0] : null
  } catch (error) {
    console.error(`Error fetching post with slug ${slug}:`, error)
    return null
  }
})