import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { toNextJsHandler } from "better-auth/next-js"
import { checkRateLimit, getClientIp, rateLimitedResponse } from "@/lib/rate-limit"
import { isTurnstileEnforced, verifyTurnstileToken } from "@/lib/turnstile"
import { logger } from "@/lib/logger"

const { GET: authGET, POST: authPOST } = toNextJsHandler(auth)

// better-auth sub-paths that trigger an outbound email (OTP / verification)
const EMAIL_SENDING_PATHS = ["/email-otp/send-verification-otp", "/sign-up/email", "/send-verification-email"]

async function guardEmailAbuse(request: Request): Promise<NextResponse | null> {
  const rl = await checkRateLimit(request, "authEmail")
  if (!rl.success) return rateLimitedResponse(rl)

  if (isTurnstileEnforced()) {
    const url = new URL(request.url)
    const needsCaptcha = request.method === "POST" && EMAIL_SENDING_PATHS.some((p) => url.pathname.endsWith(p))
    if (needsCaptcha) {
      const token = request.headers.get("x-turnstile-token")
      const ok = await verifyTurnstileToken(token, getClientIp(request))
      if (!ok) {
        logger.warn("Auth", `Blocked email send without valid bot token: ${url.pathname} hasToken=${Boolean(token)} ip=${getClientIp(request)}`)
        return NextResponse.json({ error: "Bot verification failed. Complete the captcha or disable your ad-blocker and retry." }, { status: 403 })
      }
    }
  }
  return null
}

export async function GET(request: Request) {
  const blocked = await guardEmailAbuse(request)
  if (blocked) return blocked
  return authGET(request)
}

export async function POST(request: Request) {
  const blocked = await guardEmailAbuse(request)
  if (blocked) return blocked
  return authPOST(request)
}
