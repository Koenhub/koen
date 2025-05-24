import Image from "next/image"
import Link from "next/link"
import { getPostBySlug, getCategories } from "@/lib/server-api"
import { CategoryDropdownsClient } from "@/components/category-dropdowns-client"
import { ThemeToggle } from "@/theme-toggle"
import { EmailButton } from "@/components/email-button"
import { WordPressContent } from "@/components/wordpress-content"
import { notFound } from "next/navigation"

export default async function PostPage({ params }: { params: { slug: string } }) {
  const { slug } = params

  // Parallel data fetching
  const [post, categories] = await Promise.all([getPostBySlug(slug), getCategories()])

  if (!post) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center pt-16 md:pt-32 pb-10 md:pb-20 px-4">
      <div className="w-full max-w-xl">
        <div className="px-4 sm:px-6 py-4 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all duration-300 hover:border-neutral-300 dark:hover:border-neutral-700 shadow-md mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-0 mb-6 sm:mb-8">
            <Link href="/" className="flex items-center hover:opacity-80 transition-opacity">
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-full overflow-hidden border-2 border-neutral-300 dark:border-neutral-700 mr-3 sm:mr-4 flex-shrink-0">
                <Image src="/koen-profile.png" alt="Koen van de Meent" fill className="object-cover" priority />
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-neutral-900 dark:text-white">Koen van de Meent</h1>
                <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400">Marketingspecialist</p>
              </div>
            </Link>
            <div className="sm:ml-auto flex items-center gap-2 self-end sm:self-auto">
              <EmailButton />
              <ThemeToggle />
            </div>
          </div>

          <CategoryDropdownsClient initialCategories={categories} />
        </div>

        <div className="px-4 sm:px-6 py-6 dark:bg-neutral-900 rounded-lg text-neutral-800 dark:text-neutral-200 border border-neutral-200 dark:border-neutral-800 transition-colors duration-300 shadow-md">
          <article>
            <h2
              className="text-xl sm:text-2xl font-bold mb-4"
              dangerouslySetInnerHTML={{ __html: post.title.rendered }}
            />
            <WordPressContent content={post.content.rendered} />
          </article>
        </div>
      </div>
    </div>
  )
}

// Generate static metadata for the page
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const post = await getPostBySlug(params.slug)

  if (!post) {
    return {
      title: "Post niet gevonden | Koen van de Meent",
    }
  }

  return {
    title: `${post.title.rendered} | Koen van de Meent`,
    description: post.excerpt.rendered.replace(/<[^>]*>/g, "").slice(0, 160),
  }
}
