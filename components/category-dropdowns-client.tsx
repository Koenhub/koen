"use client"
import { useRouter } from "next/navigation"
import { MotionConfig } from "framer-motion"
import { useEffect } from "react"
import type { WPCategory, WPPost } from "@/lib/wordpress-api"
import { getPostsByCategory } from "@/lib/wordpress-api"
import { CategoryDropdown } from "./category-dropdown"

interface CategoryDropdownsClientProps {
  initialCategories: WPCategory[]
}

export function CategoryDropdownsClient({ initialCategories }: CategoryDropdownsClientProps) {
  const router = useRouter()

  // Prefetch posts for all categories in the background
  useEffect(() => {
    const prefetchAllCategoryPosts = async () => {
      // Wait a bit to let the page render first
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Prefetch posts for each category in sequence
      for (const category of initialCategories) {
        try {
          // Low priority fetch
          await getPostsByCategory(category.id)
          // Small delay between requests to avoid overwhelming the server
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(`Error prefetching posts for category ${category.id}:`, error)
        }
      }
    }

    prefetchAllCategoryPosts()
  }, [initialCategories])

  const handlePostSelect = (post: WPPost | null) => {
    if (post) {
      router.push(`/${post.slug}/`)
    }
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-3">
        <div className="grid gap-3">
          {initialCategories.length > 0 ? (
            initialCategories.map((category) => (
              <CategoryDropdown key={category.id} category={category} onSelect={handlePostSelect} />
            ))
          ) : (
            <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700">
              Geen categorieën gevonden
            </div>
          )}
        </div>
      </div>
    </MotionConfig>
  )
}
