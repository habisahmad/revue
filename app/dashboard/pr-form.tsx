'use client'

import { useActionState, useEffect } from "react"
import { toast } from "sonner"
import { requestReview } from "./action"

export function PrForm() {
  const [state, action, pending] = useActionState(requestReview, null)

  useEffect(() => {
    if (state?.error) toast.error(state.error)
  }, [state])

  return (
    <form action={action}>
      <input
        className="w-full mt-10 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
        name="prLink"
        type="text"
        placeholder="github.com/.../pull/123"
      />
      <button
        className="mt-4 px-4 py-2 rounded-md bg-blue-500 text-white disabled:opacity-50"
        type="submit"
        disabled={pending}
      >
        {pending ? "Checking…" : "Submit"}
      </button>
    </form>
  )
}
