import { sanitizeHtml } from "@/lib/wordpress-api"

interface WordPressContentProps {
  content: string
  className?: string
}

export function WordPressContent({ content, className }: WordPressContentProps) {
  return (
    <div
      className={`prose dark:prose-invert prose-neutral max-w-none ${className || ""}`}
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
    />
  )
}
