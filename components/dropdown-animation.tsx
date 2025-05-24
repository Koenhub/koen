"use client"

import type * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface DropdownAnimationProps {
  isOpen: boolean
  children: React.ReactNode
  className?: string
  onKeyDown?: (e: React.KeyboardEvent) => void
}

export function DropdownAnimation({ isOpen, children, className, onKeyDown }: DropdownAnimationProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5, height: 0 }}
          animate={{
            opacity: 1,
            y: 0,
            height: "auto",
            transition: {
              type: "tween",
              duration: 0.15,
              ease: "easeOut",
            },
          }}
          exit={{
            opacity: 0,
            y: -5,
            height: 0,
            transition: {
              type: "tween",
              duration: 0.1,
              ease: "easeIn",
            },
          }}
          className={cn("absolute left-0 right-0 top-full mt-1 z-50", className)}
          onKeyDown={onKeyDown}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
