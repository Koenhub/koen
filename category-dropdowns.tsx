"use client"

import * as React from "react"
import { MotionConfig } from "framer-motion"
import { Loader2 } from "lucide-react"
import { type WPCategory, type WPPost, getCategories } from "@/lib/wordpress-api"
import { CategoryDropdown } from "./category-dropdown"

interface CategoryDropdownsProps {
  onSelect: (post: WPPost | null) => void
}

export function CategoryDropdowns({ onSelect }: CategoryDropdownsProps) {
  const [categories, setCategories] = React.useState<WPCategory[]>([])
  const [isLoading, setIsLoading] = React.useState(false)

  // Fetch categories on mount
  React.useEffect(() => {
    const fetchCategories = async () => {
      setIsLoading(true)
      const data = await getCategories()
      // Filter out empty categories
      const nonEmptyCategories = data.filter((cat) => cat.count > 0)
      setCategories(nonEmptyCategories)
      setIsLoading(false)
    }
    fetchCategories()
  }, [])

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
          </div>
        ) : (
          <div className="grid gap-3">
            {categories.length > 0 ? (
              categories.map((category) => (
                <CategoryDropdown key={category.id} category={category} onSelect={onSelect} />
              ))
            ) : (
              <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-300 dark:border-neutral-700">
                Geen categorieën gevonden
              </div>
            )}
          </div>
        )}
      </div>
    </MotionConfig>
  )
}
