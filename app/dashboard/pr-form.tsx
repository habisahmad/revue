'use client'

import { useActionState, useEffect, useRef, useState } from "react"
import { toast } from "sonner"
import { ArrowRight, Github, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { requestReview } from "./action"

const GOLD = "#c4994a"
const GOLD_DIM = "rgba(196,153,74,0.08)"
const GOLD_BORDER = "rgba(196,153,74,0.26)"

export function PrForm() {
  const router = useRouter()
  const [state, action, pending] = useActionState(requestReview, null)
  const [value, setValue] = useState("")
  const [focused, setFocused] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
    if (state?.success) {
      router.push(`/dashboard/${state.repoOwner}/${state.repoName}/${state.prNumber}`)
    }
  }, [state, router])

  const canSubmit = value.trim().length > 0 && !pending

  return (
    <form action={action} className="w-full">
      <div
        className="flex items-center gap-2 rounded-[12px] transition-all duration-200"
        style={{
          background: "rgba(255,255,255,0.022)",
          border: focused
            ? `1px solid ${GOLD_BORDER}`
            : "1px solid rgba(255,255,255,0.055)",
          boxShadow: focused
            ? "0 0 0 4px rgba(196,153,74,0.08), 0 1px 0 rgba(255,255,255,0.02) inset"
            : "0 1px 0 rgba(255,255,255,0.02) inset",
          padding: "6px 6px 6px 14px",
        }}
      >
        <Github
          className="w-4 h-4 shrink-0"
          style={{ color: focused ? GOLD : "#52556a", transition: "color 200ms" }}
        />
        <input
          ref={inputRef}
          name="prLink"
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="github.com/owner/repo/pull/123"
          autoComplete="off"
          spellCheck={false}
          disabled={pending}
          className="flex-1 bg-transparent text-[15px] text-[#e6e8f0] placeholder:text-[#3a3d50] focus:outline-none disabled:opacity-50 py-2.5"
        />
        <button
          type="submit"
          disabled={!canSubmit}
          className="group inline-flex items-center gap-2 text-[13px] font-medium rounded-[8px] transition-all duration-200 disabled:cursor-not-allowed"
          style={{
            padding: "8px 14px",
            background: canSubmit ? GOLD_DIM : "rgba(255,255,255,0.025)",
            border: canSubmit
              ? `1px solid ${GOLD_BORDER}`
              : "1px solid rgba(255,255,255,0.05)",
            color: canSubmit ? GOLD : "#52556a",
          }}
        >
          {pending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Fetching</span>
            </>
          ) : (
            <>
              <span>Review</span>
              <ArrowRight className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-200" />
            </>
          )}
        </button>
      </div>
    </form>
  )
}
