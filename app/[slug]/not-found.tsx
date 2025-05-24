import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white dark:bg-black transition-colors duration-300 flex flex-col items-center justify-center">
      <div className="w-full max-w-xl px-4 text-center">
        <h2 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Post niet gevonden</h2>
        <p className="text-neutral-600 dark:text-neutral-400 mb-6">
          De pagina die je zoekt bestaat niet of is verwijderd.
        </p>
        <Button asChild>
          <Link href="/">Terug naar home</Link>
        </Button>
      </div>
    </div>
  )
}
