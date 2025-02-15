import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/toaster"
import type React from "react"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

import "./globals.css"

export const metadata = {
  generator: "v0.dev",
}



import './globals.css'