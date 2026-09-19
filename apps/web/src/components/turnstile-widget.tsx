"use client"

import { useEffect, useRef, useState } from "react"

declare global {
  interface Window {
    turnstile?: {
      render: (el: HTMLElement, opts: Record<string, unknown>) => string
      reset: (id?: string) => void
      remove?: (id?: string) => void
    }
    onTurnstileLoad?: () => void
  }
}

export type TurnstileStatus = "unconfigured" | "loading" | "ready" | "blocked"

export function TurnstileWidget({
  onToken,
  onStatus,
  resetKey = 0,
}: {
  onToken: (token: string) => void
  onStatus?: (status: TurnstileStatus) => void
  resetKey?: number
}) {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const ref = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const onTokenRef = useRef(onToken)
  const onStatusRef = useRef(onStatus)
  const [status, setStatus] = useState<TurnstileStatus>(siteKey ? "loading" : "unconfigured")

  useEffect(() => {
    onTokenRef.current = onToken
  }, [onToken])

  useEffect(() => {
    onStatusRef.current = onStatus
  }, [onStatus])

  useEffect(() => {
    onStatusRef.current?.(status)
  }, [status])

  // Reset the widget when the parent bumps resetKey (tokens are single-use).
  useEffect(() => {
    if (resetKey > 0 && widgetId.current && window.turnstile) {
      try {
        window.turnstile.reset(widgetId.current)
      } catch {}
      onTokenRef.current("")
    }
  }, [resetKey])

  useEffect(() => {
    if (!siteKey || !ref.current) return
    let cancelled = false

    const render = () => {
      if (cancelled || !ref.current || !window.turnstile || widgetId.current) return
      try {
        widgetId.current = window.turnstile.render(ref.current, {
          sitekey: siteKey,
          callback: (token: string) => onTokenRef.current(token),
          "expired-callback": () => onTokenRef.current(""),
          "error-callback": () => {
            onTokenRef.current("")
            setStatus("blocked")
          },
        })
        setStatus("ready")
      } catch {
        setStatus("blocked")
      }
    }

    if (window.turnstile) {
      render()
    } else {
      window.onTurnstileLoad = render
      const script = document.querySelector("script[data-turnstile]") as HTMLScriptElement | null
      if (!script) {
        const s = document.createElement("script")
        s.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad"
        s.async = true
        s.defer = true
        s.dataset.turnstile = "true"
        s.onerror = () => {
          if (!cancelled) setStatus("blocked")
        }
        document.head.appendChild(s)
      }
      // Ad-blockers silently swallow the script: detect it never arriving.
      const timer = setTimeout(() => {
        if (!cancelled && !window.turnstile) setStatus("blocked")
      }, 8000)
      return () => {
        cancelled = true
        clearTimeout(timer)
      }
    }
    return () => {
      cancelled = true
    }
  }, [siteKey])

  if (!siteKey) return null
  return (
    <>
      <div ref={ref} />
      {status === "blocked" && (
        <p className="text-sm text-amber-500">
          Bot check failed to load. Disable your ad-blocker or Brave Shields for this site, then reload.
        </p>
      )}
    </>
  )
}
