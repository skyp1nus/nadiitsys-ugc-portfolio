import { Octokit } from "@octokit/rest";

const OWNER = process.env.GH_OWNER ?? "";
const REPO = process.env.GH_REPO ?? "";

export function ghConfigured(): boolean {
  return Boolean(OWNER && REPO);
}

export function ghClient(): Octokit {
  return new Octokit({ auth: process.env.GH_TOKEN });
}

async function getSha(gh: Octokit, path: string): Promise<string | undefined> {
  try {
    const { data } = await gh.repos.getContent({
      owner: OWNER,
      repo: REPO,
      path,
      ref: "main",
    });
    return "sha" in data ? data.sha : undefined;
  } catch {
    return undefined;
  }
}

/**
 * Commit a file to the repo's main branch via the Contents API.
 * Retries once on a 409 SHA conflict by re-fetching the latest SHA.
 */
export async function commitFile(opts: {
  path: string;
  content: string;
  message: string;
}): Promise<string> {
  const { path, content, message } = opts;
  const gh = ghClient();
  const sha = await getSha(gh, path);
  return doCommit(gh, path, content, message, sha, false);
}

async function doCommit(
  gh: Octokit,
  path: string,
  content: string,
  message: string,
  sha: string | undefined,
  retried: boolean
): Promise<string> {
  try {
    const result = await gh.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message,
      content: Buffer.from(content).toString("base64"),
      sha,
      branch: "main",
    });
    return result.data.commit.sha ?? "";
  } catch (err: unknown) {
    const status = (err as { status?: number }).status;
    if (status === 409 && !retried) {
      const fresh = await getSha(gh, path);
      return doCommit(gh, path, content, message, fresh, true);
    }
    throw err;
  }
}
