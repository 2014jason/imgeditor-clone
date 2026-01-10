"use client"

import Link from "next/link"
import { usePathname, useSearchParams } from "next/navigation"
import { useEffect, useMemo, useState } from "react"
import type { AuthChangeEvent, Session, User } from "@supabase/supabase-js"
import { createSupabaseBrowserClient } from "@/lib/supabase/client"
import { getSupabaseConfigOptional } from "@/lib/supabase/config"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LogOut } from "lucide-react"

function getDisplayName(user: User) {
  const metadata = user.user_metadata as Record<string, unknown> | null
  const fullName = typeof metadata?.full_name === "string" ? metadata.full_name : null
  const name = typeof metadata?.name === "string" ? metadata.name : null
  return fullName || name || user.email || "Account"
}

function getAvatarUrl(user: User) {
  const metadata = user.user_metadata as Record<string, unknown> | null
  const avatarUrl = typeof metadata?.avatar_url === "string" ? metadata.avatar_url : null
  const picture = typeof metadata?.picture === "string" ? metadata.picture : null
  return avatarUrl || picture || ""
}

export function AuthButton() {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const next = useMemo(() => {
    const query = searchParams?.toString()
    return query ? `${pathname}?${query}` : pathname
  }, [pathname, searchParams])

  const loginHref = useMemo(() => `/auth/login?next=${encodeURIComponent(next)}`, [next])
  const signOutHref = useMemo(() => `/auth/signout?next=${encodeURIComponent(next)}`, [next])

  const [user, setUser] = useState<User | null>(null)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const config = getSupabaseConfigOptional()
    if (!config) {
      setReady(true)
      setUser(null)
      return
    }

    const supabase = createSupabaseBrowserClient()

    let mounted = true

    const load = async () => {
      try {
        const { data } = await supabase.auth.getUser()
        if (!mounted) return
        setUser(data.user ?? null)
      } finally {
        if (mounted) setReady(true)
      }
    }
    void load()

    const { data } = supabase.auth.onAuthStateChange((_event: AuthChangeEvent, session: Session | null) => {
      setUser(session?.user ?? null)
    })

    return () => {
      mounted = false
      data.subscription.unsubscribe()
    }
  }, [])

  if (!ready) {
    return (
      <Button variant="outline" className="hidden sm:inline-flex bg-transparent dark:border-border" disabled>
        Sign In
      </Button>
    )
  }

  if (!user) {
    const config = getSupabaseConfigOptional()
    return (
      <Button
        asChild={Boolean(config)}
        variant="outline"
        className="hidden sm:inline-flex bg-transparent dark:border-border"
        disabled={!config}
        title={!config ? "Configure Supabase env vars to enable Google login." : undefined}
      >
        {config ? <Link href={loginHref}>Sign In</Link> : "Sign In"}
      </Button>
    )
  }

  const name = getDisplayName(user)
  const avatarUrl = getAvatarUrl(user)
  const fallback = name.trim().slice(0, 2).toUpperCase()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="hidden sm:inline-flex bg-transparent dark:border-border gap-2 px-3">
          <Avatar className="h-6 w-6">
            <AvatarImage src={avatarUrl} alt={name} />
            <AvatarFallback className="text-[10px]">{fallback}</AvatarFallback>
          </Avatar>
          <span className="max-w-[140px] truncate">{name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[220px]">
        <DropdownMenuLabel className="truncate">{user.email ?? "Signed in"}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={signOutHref}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
