import type React from "react"
import type { Metadata } from "next"
import "@/app/globals.css"
import { ThemeProvider } from "@/theme-provider"

export const metadata: Metadata = {
  title: "Koen van de Meent | Marketingspecialist",
  description: "Persoonlijke website van Koen van de Meent, Marketingspecialist",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" suppressHydrationWarning>
      <body>
        <ThemeProvider defaultTheme="light" storageKey="ui-theme">
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
