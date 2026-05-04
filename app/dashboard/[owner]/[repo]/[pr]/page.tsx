import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Octokit } from "@octokit/rest";


export default async function Page ({ params }: { params: { owner: string, repo: string, pr: string } }) {
    const { owner, repo, pr } = await params;
    const session = await auth();
    
    const account = await prisma.account.findFirst({
        where: {
            userId: session?.user?.id,
            provider: "github",
        },
    })
    if (!account) redirect("/");
    if (!session) redirect("/");

    const octokit = new Octokit({
        auth: account?.access_token,
    })

    const files = await octokit.paginate(octokit.rest.pulls.listFiles, {
        owner,
        repo,
        pull_number: parseInt(pr),
        per_page: 100,
    })

    return (
        <div className="p-6 space-y-6">
            {files.map((file) => (
                <div key={file.filename} className="border border-gray-700 rounded-md overflow-hidden">
                    <div className="px-4 py-2 bg-gray-900 flex justify-between text-sm">
                        <span className="font-mono">{file.filename}</span>
                        <span>
                            <span className="text-green-400">+{file.additions}</span>{" "}
                            <span className="text-red-400">-{file.deletions}</span>{" "}
                            <span className="text-gray-400">({file.status})</span>
                        </span>
                    </div>
                    {file.patch ? (
                        <pre className="text-xs p-4 overflow-x-auto whitespace-pre">{file.patch}</pre>
                    ) : (
                        <div className="text-xs p-4 text-gray-500">No patch available (binary or too large)</div>
                    )}
                </div>
            ))}
        </div>
    )
}