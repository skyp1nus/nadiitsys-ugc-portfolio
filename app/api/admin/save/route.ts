import { NextResponse } from "next/server";
import { Octokit } from "@octokit/rest";
import { requireAdmin } from "@/lib/auth";
import { VideosFileSchema } from "@/lib/schemas/video";

const OWNER = process.env.GH_OWNER ?? "";
const REPO = process.env.GH_REPO ?? "";
const PATH = "content/videos.json";

async function commitVideos(
  gh: Octokit,
  content: string,
  count: number,
  sha: string | undefined,
  retried = false
): Promise<string> {
  try {
    const result = await gh.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path: PATH,
      message: `content: update videos.json (${count} entries)`,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch: "main",
    });
    return result.data.commit.sha ?? "";
  } catch (err: unknown) {
    // On SHA conflict, fetch the latest SHA and retry once
    const status = (err as { status?: number }).status;
    if (status === 409 && !retried) {
      const { data: existing } = await gh.repos.getContent({
        owner: OWNER,
        repo: REPO,
        path: PATH,
        ref: "main",
      });
      const freshSha = "sha" in existing ? existing.sha : undefined;
      return commitVideos(gh, content, count, freshSha, true);
    }
    throw err;
  }
}

export async function POST(req: Request): Promise<Response> {
  try {
    await requireAdmin(req);
  } catch (res) {
    return res as Response;
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = VideosFileSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const data = {
    ...parsed.data,
    updatedAt: new Date().toISOString(),
  };
  const content = JSON.stringify(data, null, 2) + "\n";

  if (!OWNER || !REPO) {
    return NextResponse.json(
      { ok: false, error: "GH_OWNER / GH_REPO not configured" },
      { status: 500 }
    );
  }

  const gh = new Octokit({ auth: process.env.GH_TOKEN });

  // Get current SHA
  let sha: string | undefined;
  try {
    const { data: existing } = await gh.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path: PATH,
      ref: "main",
    });
    sha = "sha" in existing ? existing.sha : undefined;
  } catch {
    // File might not exist yet — that's OK, sha stays undefined
  }

  try {
    const commitSha = await commitVideos(gh, content, data.videos.length, sha);
    return NextResponse.json({ ok: true, sha: commitSha });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}
