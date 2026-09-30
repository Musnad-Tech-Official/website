"use client"

import * as React from "react"
import { ThemeProvider as NextThemesProvider } from "next-themes"

export function ThemeProvider({
  children,
  scriptProps,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider
      {...props}
      scriptProps={{
        ...scriptProps,
        // Keep the server script executable for the initial theme. React 19
        // treats the client copy as a data block when this provider remounts.
        type: typeof window === "undefined" ? undefined : "application/json",
      }}
    >
      {children}
    </NextThemesProvider>
  )
}
