import Image from "next/image"
import Link from "next/link"
import { ThemeToggle } from "@/theme-toggle"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { Mail } from "lucide-react"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Loading() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center pt-16 md:pt-32 pb-10 md:pb-20 px-4">
      <div className="w-full max-w-xl">
        <div className="px-4 sm:px-6 py-4 border border-neutral-200 dark:border-neutral-800 rounded-xl transition-all duration-300 mb-6 sm:mb-8">
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
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex items-center gap-1.5 h-8 rounded-full border-neutral-300 dark:border-neutral-700"
                    >
                      <Mail className="h-3.5 w-3.5" />
                      <span>Mail mij</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>hi@koenvandemeent.nl</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <ThemeToggle />
            </div>
          </div>

          {/* Skeleton for categories */}
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-6 w-16 sm:w-24 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
                <div className="relative flex-1 h-10 bg-neutral-200 dark:bg-neutral-800 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 sm:px-6 py-6 bg-neutral-100 dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 transition-colors duration-300 flex justify-center items-center min-h-[200px] sm:min-h-[300px]">
          <LoadingSpinner size="lg" />
        </div>
      </div>
    </div>
  )
}
