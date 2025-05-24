"use client"

import * as React from "react"
import { Mail, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export function EmailButton() {
  const [copied, setCopied] = React.useState(false)

  const copyEmail = () => {
    const email = "hi@koenvandemeent.nl"
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-1 sm:gap-1.5 h-8 text-xs sm:text-sm rounded-full border-neutral-300 dark:border-neutral-700"
            onClick={copyEmail}
          >
            {copied ? (
              <>
                <Check className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                <span className="sm:inline">Gekopieerd</span>
              </>
            ) : (
              <>
                <Mail className="h-3 sm:h-3.5 w-3 sm:w-3.5" />
                <span className="sm:inline">Mail mij</span>
              </>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>hi@koenvandemeent.nl</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
