import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { SignOutButton } from "./components/sign-out-button"
import { Octokit } from "@octokit/rest"
import { prisma } from "@/lib/prisma"
import {
  GitPullRequest,
  ChevronRight,
  GitBranch,
  Clock,
  CheckCircle2,
  Circle,
  Sparkles,
  Search,
  Zap,
  TrendingUp,
  Activity,
  AlertCircle,
  MoreHorizontal,
  ArrowUpRight,
} from "lucide-react"

/* ─── Brand tokens ─── */
const GOLD         = "#c4994a"
const GOLD_DIM     = "rgba(196,153,74,0.09)"
const GOLD_BORDER  = "rgba(196,153,74,0.24)"
const GOLD_GLOW    = "rgba(196,153,74,0.18)"
const CARD_BG      = "#0b0d17"
const SURFACE      = "rgba(255,255,255,0.018)"
const BORDER_DIM   = "rgba(255,255,255,0.055)"

/* ─── Demo data ─── */
const PLACEHOLDER_PRS = [
  {
    id: 101, number: 42,
    title: "Add user authentication flow",
    branch: "feat/auth",
    updatedAt: "2h ago",
    additions: 312, deletions: 45,
    labels: ["feature"],
    reviewed: false,
  },
  {
    id: 102, number: 41,
    title: "Fix payment processing race condition",
    branch: "fix/payments",
    updatedAt: "5h ago",
    additions: 28, deletions: 14,
    labels: ["bug"],
    reviewed: true,
  },
  {
    id: 103, number: 40,
    title: "Refactor database queries for performance",
    branch: "refactor/db",
    updatedAt: "1d ago",
    additions: 180, deletions: 220,
    labels: ["refactor"],
    reviewed: false,
  },
  {
    id: 104, number: 39,
    title: "Update dependencies to latest stable versions",
    branch: "chore/deps",
    updatedAt: "2d ago",
    additions: 5, deletions: 5,
    labels: ["chore"],
    reviewed: true,
  },
]

const LABEL_CFG: Record<string, {
  border: string; text: string; bg: string; glow: string
}> = {
  feature:  { border: "#3b82f6", text: "#60a5fa", bg: "rgba(59,130,246,0.1)",  glow: "rgba(59,130,246,0.12)"  },
  bug:      { border: "#f43f5e", text: "#fb7185", bg: "rgba(244,63,94,0.1)",   glow: "rgba(244,63,94,0.12)"   },
  refactor: { border: "#8b5cf6", text: "#a78bfa", bg: "rgba(139,92,246,0.1)",  glow: "rgba(139,92,246,0.12)"  },
  chore:    { border: "#52556a", text: "#787b8e", bg: "rgba(82,85,106,0.1)",   glow: "rgba(82,85,106,0.08)"   },
}

/* Sparkline polyline points — 80×28 viewport */
const SPARKLINES = {
  open:     "0,24 13,20 27,17 40,19 53,12 67,7 80,3",
  pending:  "0,20 13,22 27,17 40,21 53,15 67,18 80,13",
  reviewed: "0,25 13,20 27,22 40,15 53,11 67,7  80,3",
}

/* Weekly activity bars */
const ACTIVITY = [3, 7, 5, 9, 4, 11, 6]
const MAX_ACT  = Math.max(...ACTIVITY)
const DAY_LABELS = ["M","T","W","T","F","S","S"]

const reviewedCount = PLACEHOLDER_PRS.filter(p => p.reviewed).length
const pendingCount  = PLACEHOLDER_PRS.filter(p => !p.reviewed).length

/* ─── Page ─── */
export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/")

  const account = await prisma.account.findFirst({
    where: { userId: session?.user?.id, provider: "github" },
  })

  if (!account?.access_token) {
    redirect("/api/auth/signin")
  }

  const octokit = new Octokit({ auth: account.access_token })
  const { data: repos } = await octokit.rest.repos.listForAuthenticatedUser({
    type: "owner",
    sort: "pushed",
  })

  const firstName = session.user?.name?.split(" ")[0] ?? "there"

  return (
    <div
      className="h-screen flex overflow-hidden text-[#e6e8f0]"
      style={{ background: "#07090f" }}
    >

      {/* ══════════════════ SIDEBAR ══════════════════ */}
      <aside
        className="w-[240px] h-full flex flex-col shrink-0 relative"
        style={{ borderRight: `1px solid ${BORDER_DIM}` }}
      >
        {/* Sidebar top ambient */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 140% 35% at 50% 0%, rgba(196,153,74,0.05) 0%, transparent 65%)",
          }}
        />

        {/* Logo */}
        <div
          className="h-[60px] flex items-center gap-3 px-4 shrink-0"
          style={{ borderBottom: `1px solid ${BORDER_DIM}` }}
        >
          <div
            className="w-[30px] h-[30px] rounded-[8px] flex items-center justify-center relative overflow-hidden"
            style={{
              background:
                "linear-gradient(135deg, rgba(196,153,74,0.55) 0%, rgba(196,153,74,0.22) 100%)",
              border: "1px solid rgba(196,153,74,0.4)",
              boxShadow: "0 0 14px rgba(196,153,74,0.22), inset 0 1px 0 rgba(255,255,255,0.12)",
            }}
          >
            <GitPullRequest className="w-[15px] h-[15px] text-white relative z-10" />
            {/* inner shimmer */}
            <div className="animate-shimmer absolute inset-0" />
          </div>

          <span className="text-sm font-semibold tracking-tight text-[#eceef6]">revue</span>

          <div
            className="ml-auto text-[10px] px-2 py-[3px] rounded-full font-medium animate-pulse"
            style={{ background: GOLD_DIM, color: GOLD, border: `1px solid ${GOLD_BORDER}` }}
          >
            beta
          </div>
        </div>

        {/* Search */}
        <div className="px-3 pt-4 pb-2">
          <div
            className="flex items-center gap-2 px-3 py-2 rounded-lg cursor-text"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${BORDER_DIM}`,
              color: "#3a3d50",
            }}
          >
            <Search className="w-3.5 h-3.5 shrink-0" />
            <span className="text-xs flex-1">Search repos…</span>
            <span
              className="text-[10px] px-1.5 py-0.5 rounded font-mono"
              style={{
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.06)",
                color: "#2a2d3a",
              }}
            >
              ⌘K
            </span>
          </div>
        </div>

        {/* Repo list */}
        <div className="flex-1 overflow-y-auto py-2 px-2">
          <p
            className="px-3 text-[10px] font-semibold uppercase tracking-widest mb-2"
            style={{ color: "#2a2d3a" }}
          >
            Repositories
          </p>
          <nav className="space-y-0.5">
            {repos.map((repo, i) => (
              <Link
                key={repo.id}
                href={`/dashboard/${repo.name}`}
                className="w-full flex items-center gap-2 px-3 py-[7px] rounded-lg text-xs font-medium transition-all duration-150 group relative overflow-hidden"
                style={
                  i === 0
                    ? {
                        background: "rgba(196,153,74,0.08)",
                        border: `1px solid rgba(196,153,74,0.22)`,
                        color: GOLD,
                        boxShadow: `inset 0 0 16px rgba(196,153,74,0.05)`,
                      }
                    : {
                        color: "#3a3d50",
                        border: "1px solid transparent",
                      }
                }
              >
                {i === 0 && (
                  <div
                    className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full"
                    style={{ background: GOLD, boxShadow: `0 0 6px ${GOLD}` }}
                  />
                )}
                <GitBranch
                  className="w-3 h-3 shrink-0"
                  style={{ color: i === 0 ? GOLD : "#2a2d3a" }}
                />
                <span className="truncate">{repo.name}</span>
                {i === 0 && (
                  <div
                    className="ml-auto w-1.5 h-1.5 rounded-full"
                    style={{ background: GOLD, boxShadow: `0 0 5px ${GOLD}` }}
                  />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* User */}
        <div className="p-3" style={{ borderTop: `1px solid ${BORDER_DIM}` }}>
          <div
            className="flex items-center gap-2.5 px-2.5 py-2.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.025)",
              border: `1px solid ${BORDER_DIM}`,
            }}
          >
            {session.user?.image && (
              <div className="relative shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                  className="w-7 h-7 rounded-full"
                  style={{
                    boxShadow:
                      "0 0 0 1.5px rgba(255,255,255,0.1), 0 0 8px rgba(196,153,74,0.12)",
                  }}
                />
                <div
                  className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full"
                  style={{
                    background: "#22c55e",
                    border: "1.5px solid #07090f",
                    boxShadow: "0 0 5px #22c55e",
                  }}
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-[#c0c3d4] truncate">
                {session.user?.name}
              </p>
              <p className="text-[10px] truncate" style={{ color: "#3a3d50" }}>
                {session.user?.email}
              </p>
            </div>
            <SignOutButton />
          </div>
        </div>
      </aside>

      {/* ══════════════════ MAIN ══════════════════ */}
      <main className="flex-1 flex flex-col min-w-0 h-full relative overflow-hidden">

        {/* Dot grid */}
        <div className="dot-grid absolute inset-0 pointer-events-none" />

        {/* Ambient orb — gold top-right */}
        <div
          className="absolute pointer-events-none animate-aurora-1"
          style={{
            top: "-15%", right: "0%",
            width: "640px", height: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(196,153,74,0.08) 0%, transparent 65%)",
            filter: "blur(45px)",
          }}
        />
        {/* Ambient orb — indigo bottom-left */}
        <div
          className="absolute pointer-events-none animate-aurora-2"
          style={{
            bottom: "-15%", left: "-5%",
            width: "520px", height: "520px",
            borderRadius: "50%",
            background:
              "radial-gradient(ellipse at center, rgba(55,95,210,0.07) 0%, transparent 65%)",
            filter: "blur(55px)",
          }}
        />

        {/* ── Top bar ── */}
        <div
          className="h-[60px] flex items-center justify-between px-8 shrink-0 relative"
          style={{ borderBottom: `1px solid ${BORDER_DIM}` }}
        >
          <div className="flex items-center gap-1.5 text-sm">
            <span style={{ color: "#3a3d50" }}>my-app</span>
            <ChevronRight className="w-3 h-3" style={{ color: "#2a2d3a" }} />
            <span className="font-medium text-[#c0c3d4]">Pull requests</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium"
              style={{
                background: SURFACE,
                border: `1px solid ${BORDER_DIM}`,
                color: "#52556a",
              }}
            >
              <Activity className="w-3 h-3" />
              Activity
            </button>
            <button
              className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium relative overflow-hidden"
              style={{
                border: `1px solid ${GOLD_BORDER}`,
                color: GOLD,
                boxShadow: `0 0 12px ${GOLD_GLOW}`,
              }}
            >
              <div className="btn-gold-shimmer absolute inset-0" />
              <Zap className="w-3 h-3 relative z-10" />
              <span className="relative z-10">Review all</span>
            </button>
          </div>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto relative">
          <div className="max-w-[760px] mx-auto px-8 py-8 space-y-7">

            {/* Greeting */}
            <div className="animate-fade-up">
              <h1
                className="text-[22px] font-semibold tracking-tight text-[#eceef6]"
                style={{ letterSpacing: "-0.025em" }}
              >
                Good morning, {firstName}
                <span style={{ color: GOLD }}>.</span>
              </h1>
              <p className="text-sm mt-1" style={{ color: "#52556a" }}>
                {pendingCount} awaiting review · {reviewedCount} reviewed · {PLACEHOLDER_PRS.length} open total
              </p>
            </div>

            {/* ── Stat cards ── */}
            <div className="grid grid-cols-3 gap-4 animate-fade-up delay-100">

              {/* Open PRs — border beam card */}
              <div
                className="relative rounded-xl p-px overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)" }}
              >
                {/* Beam rotator */}
                <div
                  className="absolute animate-beam pointer-events-none"
                  style={{
                    inset: "-80%",
                    background:
                      "conic-gradient(transparent 55%, rgba(196,153,74,0.85) 72%, rgba(255,210,120,0.5) 78%, rgba(196,153,74,0.3) 83%, transparent 93%)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  className="relative rounded-[11px] p-4 h-full"
                  style={{ background: CARD_BG }}
                >
                  <div
                    className="absolute inset-0 rounded-[11px] pointer-events-none"
                    style={{
                      background:
                        "radial-gradient(ellipse 110% 90% at 0% 0%, rgba(196,153,74,0.09) 0%, transparent 65%)",
                    }}
                  />
                  <div className="relative">
                    <div className="flex items-start justify-between mb-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center"
                        style={{ background: GOLD_DIM, border: `1px solid ${GOLD_BORDER}` }}
                      >
                        <GitPullRequest className="w-[15px] h-[15px]" style={{ color: GOLD }} />
                      </div>
                      <ArrowUpRight
                        className="w-3.5 h-3.5 opacity-30"
                        style={{ color: GOLD }}
                      />
                    </div>
                    <p className="text-[28px] font-bold leading-none text-[#eceef6]">
                      {PLACEHOLDER_PRS.length}
                    </p>
                    <p className="text-[11px] mt-1" style={{ color: "#52556a" }}>Open PRs</p>
                    {/* Sparkline */}
                    <svg
                      viewBox="0 0 80 28"
                      fill="none"
                      className="mt-3 w-full"
                      style={{ height: "28px", opacity: 0.65 }}
                    >
                      <defs>
                        <linearGradient id="sg-gold" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor={GOLD} stopOpacity="0.4" />
                          <stop offset="100%" stopColor={GOLD} stopOpacity="1" />
                        </linearGradient>
                      </defs>
                      <polyline
                        points={SPARKLINES.open}
                        stroke="url(#sg-gold)"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                      />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Pending */}
              <div
                className="relative rounded-xl p-4 overflow-hidden"
                style={{
                  border: "1px solid rgba(245,158,11,0.14)",
                  background: CARD_BG,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 110% 90% at 0% 0%, rgba(245,158,11,0.07) 0%, transparent 65%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.2)",
                      }}
                    >
                      <AlertCircle className="w-[15px] h-[15px] text-amber-400" />
                    </div>
                    <span
                      className="text-[10px] px-2 py-0.5 rounded-full"
                      style={{
                        background: "rgba(245,158,11,0.1)",
                        border: "1px solid rgba(245,158,11,0.18)",
                        color: "#f59e0b",
                      }}
                    >
                      needs review
                    </span>
                  </div>
                  <p className="text-[28px] font-bold leading-none text-[#eceef6]">{pendingCount}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#52556a" }}>Pending review</p>
                  <svg
                    viewBox="0 0 80 28"
                    fill="none"
                    className="mt-3 w-full"
                    style={{ height: "28px", opacity: 0.65 }}
                  >
                    <polyline
                      points={SPARKLINES.pending}
                      stroke="#f59e0b"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              {/* Reviewed */}
              <div
                className="relative rounded-xl p-4 overflow-hidden"
                style={{
                  border: "1px solid rgba(16,185,129,0.14)",
                  background: CARD_BG,
                }}
              >
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(ellipse 110% 90% at 0% 0%, rgba(16,185,129,0.07) 0%, transparent 65%)",
                  }}
                />
                <div className="relative">
                  <div className="flex items-start justify-between mb-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{
                        background: "rgba(16,185,129,0.1)",
                        border: "1px solid rgba(16,185,129,0.2)",
                      }}
                    >
                      <CheckCircle2 className="w-[15px] h-[15px] text-emerald-400" />
                    </div>
                    <TrendingUp className="w-3.5 h-3.5 text-emerald-500 opacity-50" />
                  </div>
                  <p className="text-[28px] font-bold leading-none text-[#eceef6]">{reviewedCount}</p>
                  <p className="text-[11px] mt-1" style={{ color: "#52556a" }}>Reviewed</p>
                  <svg
                    viewBox="0 0 80 28"
                    fill="none"
                    className="mt-3 w-full"
                    style={{ height: "28px", opacity: 0.65 }}
                  >
                    <polyline
                      points={SPARKLINES.reviewed}
                      stroke="#10b981"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* ── Weekly activity ── */}
            <div
              className="rounded-xl p-4 animate-fade-up delay-200"
              style={{
                border: `1px solid ${BORDER_DIM}`,
                background: SURFACE,
              }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-3.5 h-3.5" style={{ color: "#3a3d50" }} />
                  <p className="text-xs font-medium text-[#c0c3d4]">Weekly activity</p>
                </div>
                <p className="text-[10px]" style={{ color: "#2a2d3a" }}>Last 7 days</p>
              </div>
              <div className="flex items-end gap-2" style={{ height: "52px" }}>
                {ACTIVITY.map((val, i) => {
                  const pct = (val / MAX_ACT) * 100
                  const isToday = i === ACTIVITY.length - 1
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                      <div className="w-full flex items-end" style={{ height: "40px" }}>
                        <div
                          className="w-full rounded-[3px]"
                          style={{
                            height: `${pct}%`,
                            minHeight: "4px",
                            background: isToday
                              ? `linear-gradient(to top, ${GOLD}, rgba(196,153,74,0.4))`
                              : "rgba(255,255,255,0.07)",
                            boxShadow: isToday ? `0 0 8px ${GOLD_GLOW}` : "none",
                          }}
                        />
                      </div>
                      <span
                        className="text-[9px] font-medium"
                        style={{ color: isToday ? GOLD : "#2a2d3a" }}
                      >
                        {DAY_LABELS[i]}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* ── PR list ── */}
            <div className="animate-fade-up delay-300">
              <div className="flex items-center justify-between mb-3">
                <p className="text-xs font-medium text-[#c0c3d4]">Open pull requests</p>
                <button
                  className="text-[10px] flex items-center gap-1"
                  style={{ color: "#3a3d50" }}
                >
                  <MoreHorizontal className="w-3 h-3" />
                  Filter
                </button>
              </div>

              <div className="space-y-2">
                {PLACEHOLDER_PRS.map((pr, idx) => {
                  const label = pr.labels[0]
                  const cfg   = LABEL_CFG[label] ?? LABEL_CFG.chore
                  return (
                    <div
                      key={pr.id}
                      className="pr-row group relative flex items-center gap-4 pl-5 pr-5 py-4 rounded-xl cursor-pointer"
                      style={{
                        border: `1px solid ${BORDER_DIM}`,
                        background: SURFACE,
                        animationDelay: `${0.3 + idx * 0.06}s`,
                      }}
                    >
                      {/* Colored left-rail */}
                      <div
                        className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full"
                        style={{
                          background: cfg.border,
                          boxShadow: `0 0 8px ${cfg.glow}`,
                        }}
                      />

                      {/* Hover side-glow */}
                      <div
                        className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 pointer-events-none"
                        style={{
                          transition: "opacity 0.25s",
                          background: `radial-gradient(ellipse 55% 80% at 0% 50%, ${cfg.glow} 0%, transparent 70%)`,
                        }}
                      />

                      {/* Status dot */}
                      <div className="shrink-0 relative z-10">
                        {pr.reviewed ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                        ) : (
                          <div className="relative w-4 h-4 flex items-center justify-center">
                            <Circle className="w-4 h-4 absolute" style={{ color: "#2a2d3a" }} />
                            <div
                              className="animate-ring-pulse absolute w-2 h-2 rounded-full"
                              style={{ background: "rgba(245,158,11,0.5)" }}
                            />
                          </div>
                        )}
                      </div>

                      {/* PR info */}
                      <div className="flex-1 min-w-0 relative z-10">
                        <div className="flex items-center gap-2 mb-1.5">
                          <p
                            className="text-[13px] font-medium truncate text-[#c0c3d4] group-hover:text-[#eceef6]"
                            style={{ transition: "color 0.15s" }}
                          >
                            {pr.title}
                          </p>
                          <span
                            className="shrink-0 text-[10px] px-2 py-[2px] rounded-full font-medium"
                            style={{
                              background: cfg.bg,
                              color: cfg.text,
                              border: `1px solid ${cfg.border}33`,
                            }}
                          >
                            {label}
                          </span>
                        </div>
                        <div
                          className="flex items-center gap-2 text-[11px]"
                          style={{ color: "#3a3d50" }}
                        >
                          <span className="font-mono">#{pr.number}</span>
                          <span style={{ color: "#2a2d3a" }}>·</span>
                          <span className="font-mono">{pr.branch}</span>
                          <span style={{ color: "#2a2d3a" }}>·</span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {pr.updatedAt}
                          </span>
                          <span style={{ color: "#2a2d3a" }}>·</span>
                          <span style={{ color: "rgba(52,211,153,0.75)" }}>+{pr.additions}</span>
                          <span style={{ color: "rgba(244,63,94,0.55)" }}>−{pr.deletions}</span>
                        </div>
                      </div>

                      {/* Action */}
                      <div className="shrink-0 relative z-10">
                        {pr.reviewed ? (
                          <div
                            className="flex items-center gap-1.5 text-xs font-medium"
                            style={{ color: "rgba(52,211,153,0.5)" }}
                          >
                            <Sparkles className="w-3 h-3" />
                            Reviewed
                          </div>
                        ) : (
                          <button
                            className="flex items-center gap-1.5 text-xs font-medium rounded-lg relative overflow-hidden"
                            style={{
                              padding: "6px 12px",
                              background: GOLD_DIM,
                              border: `1px solid ${GOLD_BORDER}`,
                              color: GOLD,
                            }}
                          >
                            <div className="animate-shimmer absolute inset-0" />
                            <span className="relative z-10">Review</span>
                            <ChevronRight className="w-3 h-3 relative z-10" />
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  )
}
