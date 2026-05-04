import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";


export default async function Page ({ params }: { params: { repo: string, pr: string } }) {
    const { repo, pr } = await params;
    const session = await auth();
    
    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user?.id,
            provider: "github",
        },
    })
    if (!account) redirect("/");
    if (!session) redirect("/");
    
    return (
        <div>
            <h1>Reviewing {repo} #{pr}</h1>
        </div>
    )
}