"use client"

import * as React from "react"
import { motion, AnimatePresence, MotionConfig } from "framer-motion"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronDown, FolderOpen, FileText, Loader2 } from "lucide-react"
import { useClickAway } from "@/hooks/use-click-away"
import { type WPCategory, type WPPost, getCategories, getPostsByCategory } from "@/lib/wordpress-api"

interface SubCategory {
  id: number
  label: string
  parentId: string
  icon: React.ElementType
  wpPost: WPPost
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      when: "beforeChildren",
      staggerChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
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

interface FluidDropdownProps {
  onSelect: (post: WPPost | null) => void
}

export default function FluidDropdown({ onSelect }: FluidDropdownProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [categories, setCategories] = React.useState<WPCategory[]>([])
  const [selectedCategory, setSelectedCategory] = React.useState<WPCategory | null>(null)
  const [posts, setPosts] = React.useState<WPPost[]>([])
  const [selectedPost, setSelectedPost] = React.useState<WPPost | null>(null)
  const [hoveredCategory, setHoveredCategory] = React.useState<number | null>(null)
  const [hoveredPost, setHoveredPost] = React.useState<number | null>(null)
  const [showingPosts, setShowingPosts] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const dropdownRef = React.useRef<HTMLDivElement>(null)

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

  // Handle click outside to close dropdown
  useClickAway(dropdownRef, () => {
    setIsOpen(false)
    setShowingPosts(false)
  })

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      if (showingPosts) {
        setShowingPosts(false)
      } else {
        setIsOpen(false)
      }
    }
  }

  const handleCategorySelect = async (category: WPCategory) => {
    setSelectedCategory(category)
    setIsLoading(true)
    const categoryPosts = await getPostsByCategory(category.id)
    setPosts(categoryPosts)
    setIsLoading(false)
    setShowingPosts(true)
  }

  const handlePostSelect = (post: WPPost) => {
    setSelectedPost(post)
    setIsOpen(false)
    setShowingPosts(false)
    onSelect(post)
  }

  const handleBackToCategories = () => {
    setShowingPosts(false)
  }

  const getDisplayText = () => {
    if (selectedPost) {
      return `${selectedCategory?.name} - ${selectedPost.title.rendered}`
    }
    if (selectedCategory) {
      return selectedCategory.name
    }
    return "Selecteer een categorie"
  }

  const getDisplayIcon = () => {
    if (selectedPost) {
      return FileText
    }
    if (selectedCategory) {
      return FolderOpen
    }
    return FolderOpen
  }

  const getCategoryColor = (categoryId: number) => {
    // Generate a consistent color based on category ID
    const colors = ["#FF6B6B", "#4ECDC4", "#F9C74F", "#A06CD5", "#6A8D73", "#FF9F1C"]
    return colors[categoryId % colors.length]
  }

  return (
    <MotionConfig reducedMotion="user">
      <div className="w-full relative" style={{ height: "40px" }} ref={dropdownRef}>
        <Button
          variant="outline"
          onClick={() => setIsOpen(!isOpen)}
          className={cn(
            "w-full justify-between bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-400",
            "hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-800 dark:hover:text-neutral-200",
            "focus:ring-2 focus:ring-neutral-300 dark:focus:ring-neutral-700 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-black",
            "transition-all duration-200 ease-in-out",
            "border border-neutral-300 dark:border-neutral-700 focus:border-neutral-400 dark:focus:border-neutral-600",
            "h-10",
            isOpen && "bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200",
          )}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          <span className="flex items-center">
            <IconWrapper
              icon={getDisplayIcon()}
              isHovered={false}
              color={selectedCategory ? getCategoryColor(selectedCategory.id) : "#A06CD5"}
            />
            <span className="truncate max-w-[250px]">{getDisplayText()}</span>
          </span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            whileHover={{ rotate: isOpen ? 180 : 180 }}
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
        </Button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 1, y: 0, height: 0 }}
              animate={{
                opacity: 1,
                y: 0,
                height: "auto",
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              exit={{
                opacity: 0,
                y: 0,
                height: 0,
                transition: {
                  type: "spring",
                  stiffness: 500,
                  damping: 30,
                  mass: 1,
                },
              }}
              className="absolute left-0 right-0 top-full mt-2 z-50"
              onKeyDown={handleKeyDown}
            >
              <motion.div
                className={cn(
                  "absolute w-full rounded-lg border border-neutral-300 dark:border-neutral-700",
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
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-6 h-6 animate-spin text-neutral-400" />
                  </div>
                ) : (
                  <AnimatePresence mode="wait">
                    {!showingPosts ? (
                      <motion.div
                        className="py-2 relative max-h-[300px] overflow-y-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key="categories"
                      >
                        {categories.length > 0 ? (
                          categories.map((category) => (
                            <motion.button
                              key={category.id}
                              onClick={() => handleCategorySelect(category)}
                              onHoverStart={() => setHoveredCategory(category.id)}
                              onHoverEnd={() => setHoveredCategory(null)}
                              className={cn(
                                "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md",
                                "transition-colors duration-150",
                                "focus:outline-none",
                                hoveredCategory === category.id
                                  ? "text-neutral-800 dark:text-neutral-200"
                                  : "text-neutral-600 dark:text-neutral-400",
                              )}
                              whileTap={{ scale: 0.98 }}
                              variants={itemVariants}
                            >
                              <IconWrapper
                                icon={FolderOpen}
                                isHovered={hoveredCategory === category.id}
                                color={getCategoryColor(category.id)}
                              />
                              {category.name}
                              <span className="ml-auto text-xs text-neutral-400 dark:text-neutral-500">
                                {category.count}
                              </span>
                            </motion.button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Geen categorieën gevonden
                          </div>
                        )}
                      </motion.div>
                    ) : (
                      <motion.div
                        className="py-2 relative max-h-[300px] overflow-y-auto"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        key="posts"
                      >
                        <motion.button
                          onClick={handleBackToCategories}
                          className="relative flex w-full items-center px-4 py-2.5 text-sm rounded-md text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 mb-2 border-b border-neutral-200 dark:border-neutral-800 pb-4"
                          whileTap={{ scale: 0.98 }}
                          variants={itemVariants}
                        >
                          <ChevronDown className="w-4 h-4 mr-2 rotate-90" />
                          Terug naar categorieën
                        </motion.button>

                        {posts.length > 0 ? (
                          posts.map((post) => (
                            <motion.button
                              key={post.id}
                              onClick={() => handlePostSelect(post)}
                              onHoverStart={() => setHoveredPost(post.id)}
                              onHoverEnd={() => setHoveredPost(null)}
                              className={cn(
                                "relative flex w-full items-center px-4 py-2.5 text-sm rounded-md",
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
                                color={selectedCategory ? getCategoryColor(selectedCategory.id) : "#A06CD5"}
                              />
                              <span className="truncate">{post.title.rendered}</span>
                            </motion.button>
                          ))
                        ) : (
                          <div className="px-4 py-2 text-sm text-neutral-500 dark:text-neutral-400">
                            Geen berichten gevonden in deze categorie
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </MotionConfig>
  )
}
