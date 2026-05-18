import { signOut } from "@/lib/auth"
import { LogOut } from "lucide-react"

export async function SignOutButton() {
    return (
        <form action={async () => {
            "use server"
            await signOut()
        }}>
            <button
                type="submit"
                title="Sign out"
                aria-label="Sign out"
                className="p-2 rounded-[8px] text-[#52556a] hover:text-[#c4994a] hover:bg-white/[0.03] transition-all duration-200"
            >
                <LogOut className="w-3.5 h-3.5" />
            </button>
        </form>
    )
}
