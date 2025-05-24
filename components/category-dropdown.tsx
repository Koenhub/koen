"use client"

import * as React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, FolderOpen, FileText } from "lucide-react"
import { useClickAway } from "@/hooks/use-click-away"
import { type WPCategory, type WPPost, getPostsByCategory } from "@/lib/wordpress-api"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { DropdownAnimation } from "./dropdown-animation"

interface CategoryDropdownProps {
  category: WPCategory
  onSelect: (post: WPPost | null) => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.05,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -5 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.2,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
}

const IconWrapper = ({
  icon: Icon,
  isHovered,
  color,
}: { icon: React.ElementType; isHovered: boolean; color: string }) => (
  <motion.div className="w-4 h-4 mr-2 relative" initial={false} animate={isHovered ? { scale: 1.2 } : { scale: 1 }}>
    <Icon className="w-4 h-4" />
    {isHovered && (
      <motion.div
        className="absolute inset-0"
        style={{ color }}
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.5, ease: "easeInOut" }}
      >
        <Icon className="w-4 h-4" strokeWidth={2} />
      </motion.div>
    )}
  </motion.div>
)

export function CategoryDropdown({ category, onSelect }: CategoryDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [posts, setPosts] = React.useState<WPPost[]>([])
  const [isLoading, setIsLoading] = React.useState(false)
  const [isPrefetching, setIsPrefetching] = React.useState(false)
  const hasFetchedRef = React.useRef(false)
  const [hoveredPost, setHoveredPost] = React.useState<number | null>(null)
  const [hasLoadedOnce, setHasLoadedOnce] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const buttonRef = React.useRef<HTMLButtonElement>(null)

  // Handle click outside to close dropdown
  useClickAway(dropdownRef, () => {
    setIsOpen(false)
  })

  // Prefetch posts data when component mounts or on hover
  const prefetchPosts = React.useCallback(async () => {
    if (hasFetchedRef.current || isPrefetching) return

    setIsPrefetching(true)
    try {
      const categoryPosts = await getPostsByCategory(category.id)
      setPosts(categoryPosts)
      hasFetchedRef.current = true
    } catch (error) {
      console.error(`Error prefetching posts for category ${category.id}:`, error)
    } finally {
      setIsPrefetching(false)
    }
  }, [category.id, isPrefetching])

  // Prefetch data after a short delay
  React.useEffect(() => {
    const timer = setTimeout(() => {
      prefetchPosts()
    }, 500) // Delay prefetching to prioritize visible content

    return () => clearTimeout(timer)
  }, [prefetchPosts])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      setIsOpen(false)
    }
  }

  const handleToggle = async () => {
    if (!hasFetchedRef.current && !isPrefetching) {
      setIsLoading(true)
      await prefetchPosts()
      setIsLoading(false)
    }
    setIsOpen(!isOpen)
  }

  const handlePostSelect = (post: WPPost) => {
    setIsOpen(false)
    onSelect(post)
  }

  const getCategoryColor = (categoryId: number) => {
    // Generate a consistent color based on category ID
    const colors = ["#FF6B6B", "#4ECDC4", "#F9C74F", "#A06CD5", "#6A8D73", "#FF9F1C"]
    return colors[categoryId % colors.length]
  }

  // Update the category dropdown to be more responsive
  return (
    <div className="relative" ref={dropdownRef}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
        <div className="font-medium text-neutral-800 dark:text-neutral-200 text-sm sm:text-base sm:min-w-[120px]">
          {category.name}
        </div>
        <div className="relative flex-1">
          <Button
            ref={buttonRef}
            variant="outline"
            onClick={handleToggle}
            onMouseEnter={prefetchPosts}
            className={cn(
              "w-full justify-between bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400",
              "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200",
              "focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black",
              "transition-all duration-200 ease-in-out",
              "border border-neutral-300 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-600",
              "h-9 sm:h-10 text-sm",
              isOpen && "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
            )}
            aria-expanded={isOpen}
            aria-haspopup="true"
          >
            <span className="flex items-center">
              <IconWrapper icon={FolderOpen} isHovered={false} color={getCategoryColor(category.id)} />
              <span className="truncate max-w-[150px] sm:max-w-[250px]">Berichten</span>
            </span>
            <div className="flex items-center">
              <span className="text-xs text-neutral-400 dark:text-neutral-500 mr-2">{category.count}</span>
              <motion.div
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.2 }}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "20px",
                  height: "20px",
                }}
              >
                <ChevronDown className="w-4 h-4" />
              </motion.div>
            </div>
          </Button>

          <DropdownAnimation isOpen={isOpen} onKeyDown={handleKeyDown}>
            <motion.div
              className={cn(
                "w-full rounded-lg border border-neutral-300 dark:border-neutral-700",
                "bg-white dark:bg-neutral-900 p-1 shadow-lg transition-colors duration-300",
              )}
              initial={{ borderRadius: 8 }}
              animate={{
                borderRadius: 12,
                transition: { duration: 0.2 },
              }}
              style={{ transformOrigin: "top" }}
            >
              {isLoading ? (
                <div className="flex items-center justify-center py-4">
                  <LoadingSpinner size="xs" />
                </div>
              ) : (
                <motion.div
                  className="py-1 relative max-h-[150px] sm:max-h-[200px] overflow-y-auto"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <motion.button
                        key={post.id}
                        onClick={() => handlePostSelect(post)}
                        onHoverStart={() => setHoveredPost(post.id)}
                        onHoverEnd={() => setHoveredPost(null)}
                        className={cn(
                          "relative flex w-full items-center px-3 py-2 text-xs sm:text-sm rounded-md",
                          "transition-colors duration-150",
                          "focus:outline-none",
                          hoveredPost === post.id
                            ? "text-neutral-800 dark:text-neutral-200"
                            : "text-neutral-600 dark:text-neutral-400",
                        )}
                        whileTap={{ scale: 0.98 }}
                        variants={itemVariants}
                      >
                        <IconWrapper
                          icon={FileText}
                          isHovered={hoveredPost === post.id}
                          color={getCategoryColor(category.id)}
                        />
                        <span className="truncate">{post.title.rendered}</span>
                      </motion.button>
                    ))
                  ) : (
                    <div className="px-3 py-2 text-xs sm:text-sm text-neutral-500 dark:text-neutral-400">
                      Geen berichten gevonden in deze categorie
                    </div>
                  )}
                </motion.div>
              )}
            </motion.div>
          </DropdownAnimation>
        </div>
      </div>
    </div>
  )
}
