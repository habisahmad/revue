import { auth } from "@/lib/auth"
import { redirect } from "next/navigation"
import { PrForm } from "./pr-form"

export default async function DashboardPage() {
  const session = await auth()
  if (!session) redirect("/")

  return (
    <div className="h-screen text-[#e6e8f0]" style={{ background: "#07090f" }}>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold">Enter a GitHub PR Link</h1>
        <PrForm />
      </div>
    </div>
  )
}
