import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { GitPullRequest } from "lucide-react"
import { AuroraBackground } from "@/components/aurora-background"
import { FadeIn } from "@/components/fade-in"
import { PrForm } from "./pr-form"
import { SignOutButton } from "./components/sign-out-button"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.26)"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/")

  const user = session.user
  const initial = (user?.name ?? user?.email ?? "U").trim().charAt(0).toUpperCase()

  return (
    <div className="min-h-screen text-[#e6e8f0] antialiased selection:bg-[#c4994a]/20 selection:text-[#c4994a]">
      <AuroraBackground />

      {/* Nav */}
      <nav
        className="fixed top-0 w-full z-50"
        style={{
          backdropFilter: "blur(24px) saturate(1.4)",
          WebkitBackdropFilter: "blur(24px) saturate(1.4)",
          background: "rgba(7, 9, 15, 0.78)",
          borderBottom: "1px solid rgba(255,255,255,0.042)",
        }}
      >
        <div className="max-w-5xl mx-auto px-8">
          <div className="flex justify-between items-center h-[58px]">
            <Link href="/dashboard" className="flex items-center gap-2.5 group">
              <div
                className="w-[26px] h-[26px] rounded-[6px] flex items-center justify-center transition-colors duration-200"
                style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
              >
                <GitPullRequest className="w-3.5 h-3.5" style={{ color: GOLD }} />
              </div>
              <span className="font-semibold tracking-[-0.025em] text-[#e6e8f0]">
                revue
              </span>
            </Link>

            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2.5 pr-3 border-r border-white/[0.06]">
                {user?.image ? (
                  <Image
                    src={user.image}
                    alt={user.name ?? "avatar"}
                    width={22}
                    height={22}
                    className="rounded-full"
                  />
                ) : (
                  <div
                    className="w-[22px] h-[22px] rounded-full flex items-center justify-center text-[10px] font-medium text-[#c8cad6]"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)" }}
                  >
                    {initial}
                  </div>
                )}
                <span className="text-[13px] text-[#9ca0b4] hidden sm:block">
                  {user?.name ?? user?.email}
                </span>
              </div>
              <SignOutButton />
            </div>
          </div>
        </div>
      </nav>

      {/* Form */}
      <section className="pt-44 pb-24 px-8 relative">
        <div className="max-w-2xl mx-auto">
          <FadeIn delay={0}>
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 mb-10 rounded-full text-[11px] tracking-wide text-[#787b8e]"
              style={{
                background: "rgba(255,255,255,0.022)",
                border: "1px solid rgba(255,255,255,0.055)",
              }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full animate-pulse"
                style={{ background: GOLD }}
              />
              Ready to review
            </div>
          </FadeIn>

          <FadeIn delay={0.07}>
            <h1 className="mb-6" style={{ lineHeight: "1.05", letterSpacing: "-0.034em" }}>
              <span
                className="block font-display italic"
                style={{ fontSize: "clamp(38px, 6vw, 64px)", color: "#c8cad6", fontWeight: 400 }}
              >
                Paste a pull request,
              </span>
              <span
                className="block font-bold"
                style={{ fontSize: "clamp(38px, 6vw, 64px)", color: "#eceef6" }}
              >
                we&apos;ll do the rest<span style={{ color: GOLD }}>.</span>
              </span>
            </h1>
          </FadeIn>

          <FadeIn delay={0.13}>
            <p
              className="mb-10 leading-relaxed max-w-[460px] text-[#787b8e]"
              style={{ fontSize: "16px" }}
            >
              Drop any GitHub PR link below. Revue fetches the diff, flags issues, and
              hands you back a review in seconds.
            </p>
          </FadeIn>

          <FadeIn delay={0.19}>
            <PrForm />
          </FadeIn>

          <FadeIn delay={0.25}>
            <div className="mt-8 flex items-center gap-2 text-[11px] text-[#3a3d50]">
              <span className="font-mono">Example</span>
              <span className="text-[#52556a]">·</span>
              <code className="font-mono text-[#65677a]">
                github.com/vercel/next.js/pull/12345
              </code>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  )
}
