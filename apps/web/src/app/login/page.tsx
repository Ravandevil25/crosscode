"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { authClient } from "@/lib/auth-client"
import { TurnstileWidget, type TurnstileStatus } from "@/components/turnstile-widget"
import { GlyphMatrix } from "@/components/ui/glyph-matrix"
import { BrandLogo } from "@/components/brand-logo"
import { LoaderCircle } from "lucide-react"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [otp, setOtp] = useState("")
  const [step, setStep] = useState<"email" | "otp">("email")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [checkingSession, setCheckingSession] = useState(true)
  const [turnstileToken, setTurnstileToken] = useState("")
  const [turnstileStatus, setTurnstileStatus] = useState<TurnstileStatus>("loading")
  const [turnstileResetKey, setTurnstileResetKey] = useState(0)
  const turnstileRequired = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY)
  const [cooldown, setCooldown] = useState(0)

  useEffect(() => {
    if (cooldown <= 0) return
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000)
    return () => clearTimeout(t)
  }, [cooldown])

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await authClient.getSession()
      if (data?.session) {
        router.replace(new URLSearchParams(window.location.search).get("next") || "/dashboard")
        return
      }
      setCheckingSession(false)
    }
    checkSession()
  }, [router])

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    if (cooldown > 0) return
    if (turnstileRequired && !turnstileToken) {
      setError(
        turnstileStatus === "blocked"
          ? "Bot check is blocked. Disable your ad-blocker or Brave Shields for this site, then reload."
          : "Please complete the bot check and try again."
      )
      return
    }
    setLoading(true)
    setError("")

    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      }, {
        headers: turnstileToken ? { "x-turnstile-token": turnstileToken } : {},
      })

      if (error) {
        const msg = error.message || "Failed to send OTP"
        setError(
          /bot|captcha|turnstile/i.test(msg)
            ? "Bot verification failed. Complete the captcha or disable your ad-blocker and retry."
            : msg
        )
      } else {
        setStep("otp")
        setCooldown(60)
      }
    } catch {
      setError("Failed to send OTP")
    } finally {
      // Tokens are single-use: force a fresh challenge for the next attempt.
      setTurnstileToken("")
      setTurnstileResetKey((k) => k + 1)
      setLoading(false)
    }
  }

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      })

      if (error) {
        setError(error.message || "Invalid OTP")
      } else {
        router.push(new URLSearchParams(window.location.search).get("next") || "/dashboard")
      }
    } catch {
      setError("Failed to verify OTP")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          mask: "radial-gradient(circle, transparent 0%, transparent 20%, black 70%)",
          WebkitMask: "radial-gradient(circle, transparent 0%, transparent 20%, black 70%)",
        }}
      >
        <GlyphMatrix fadeBottom={0} />
      </div>
      <Card className="w-full max-w-md">
        {checkingSession ? (
          <CardContent className="flex justify-center py-12">
            <LoaderCircle className="animate-spin text-muted-foreground" size={32} />
          </CardContent>
        ) : (
          <>
            <CardHeader>
              <CardTitle className="text-2xl flex justify-center"><BrandLogo className="h-10 w-10" /></CardTitle>
              <CardDescription>
                {step === "email"
                  ? "Sign in to your account"
                  : "Enter the OTP sent to your email"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {step === "email" ? (
                <form onSubmit={handleSendOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <TurnstileWidget onToken={setTurnstileToken} onStatus={setTurnstileStatus} resetKey={turnstileResetKey} />
                  <Button type="submit" className="w-full" disabled={loading || cooldown > 0}>
                    {loading ? "Sending..." : cooldown > 0 ? `Resend in ${cooldown}s` : "Send OTP"}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleVerifyOTP} className="space-y-4">
                  <div className="space-y-2">
                    <Input
                      type="text"
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      maxLength={8}
                    />
                  </div>
                  {error && <p className="text-sm text-red-500">{error}</p>}
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? "Verifying..." : "Verify & Login"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => setStep("email")}
                  >
                    Back
                  </Button>
                </form>
              )}
            </CardContent>
        </>
        )}
      </Card>
    </div>
  )
}
