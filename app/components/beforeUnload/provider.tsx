"use client"
import { useBeforeUnload } from "./useBeforeUnload"

type ProviderProps = {
  children: React.ReactNode
}

export function UnloadProvider({ children }: ProviderProps) {
  return <useBeforeUnload.Provider>{children}</useBeforeUnload.Provider>
}
