import { Octokit } from "@octokit/rest";
import { execSync } from "child_process";
import { readFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const octokit = new Octokit({
  auth: process.env.GITHUB_PERSONAL_ACCESS_TOKEN,
});

const owner = "Dozzlime06";
const repo = "Liminall";
const branch = "main";

async function getAllFiles(dir: string, baseDir: string = dir): Promise<Array<{path: string, content: string}>> {
  const files: Array<{path: string, content: string}> = [];
  const items = readdirSync(dir);

  for (const item of items) {
    const fullPath = join(dir, item);
    const stat = statSync(fullPath);
    
    // Skip node_modules, .git, dist, and other build artifacts
    if (item === 'node_modules' || item === '.git' || item === 'dist' || item === '.next' || item === 'build') {
      continue;
    }

    if (stat.isDirectory()) {
      files.push(...await getAllFiles(fullPath, baseDir));
    } else {
      const relativePath = fullPath.replace(baseDir + '/', '');
      const content = readFileSync(fullPath, 'utf-8');
      files.push({ path: relativePath, content });
    }
  }

  return files;
}

async function pushToGitHub() {
  console.log("🚀 Pushing to GitHub using Octokit API...\n");

  try {
    // Get the latest commit SHA from the branch
    console.log("📥 Getting latest commit info...");
    const { data: refData } = await octokit.git.getRef({
      owner,
      repo,
      ref: `heads/${branch}`,
    });
    const latestCommitSha = refData.object.sha;
    console.log(`✅ Latest commit: ${latestCommitSha.substring(0, 7)}`);

    // Get the commit details
    const { data: commitData } = await octokit.git.getCommit({
      owner,
      repo,
      commit_sha: latestCommitSha,
    });
    const baseTreeSha = commitData.tree.sha;

    // Collect all files
    console.log("\n📦 Collecting files...");
    const files = await getAllFiles(process.cwd());
    console.log(`✅ Found ${files.length} files`);

    // Create blobs for all files
    console.log("\n📤 Uploading files to GitHub...");
    const tree = await Promise.all(
      files.map(async (file) => {
        const { data: blob } = await octokit.git.createBlob({
          owner,
          repo,
          content: Buffer.from(file.content).toString('base64'),
          encoding: 'base64',
        });
        return {
          path: file.path,
          mode: '100644' as const,
          type: 'blob' as const,
          sha: blob.sha,
        };
      })
    );
    console.log(`✅ Uploaded ${tree.length} files`);

    // Create a new tree
    console.log("\n🌳 Creating new tree...");
    const { data: newTree } = await octokit.git.createTree({
      owner,
      repo,
      tree,
      base_tree: baseTreeSha,
    });
    console.log(`✅ Tree created: ${newTree.sha.substring(0, 7)}`);

    // Create a new commit
    console.log("\n💾 Creating commit...");
    const { data: newCommit } = await octokit.git.createCommit({
      owner,
      repo,
      message: "Deploy ClaimManagerBalance v6.0 - Balance-based claim with auto-sweep + Vercel fix",
      tree: newTree.sha,
      parents: [latestCommitSha],
    });
    console.log(`✅ Commit created: ${newCommit.sha.substring(0, 7)}`);

    // Update the reference
    console.log("\n⬆️ Pushing to GitHub...");
    await octokit.git.updateRef({
      owner,
      repo,
      ref: `heads/${branch}`,
      sha: newCommit.sha,
    });
    console.log("✅ Successfully pushed!");

    console.log("\n✨ Done! View at: https://github.com/Dozzlime06/Liminall");
    console.log(`📝 Commit: ${newCommit.sha.substring(0, 7)}`);
    console.log(`🔗 https://github.com/Dozzlime06/Liminall/commit/${newCommit.sha}`);

  } catch (error: any) {
    console.error("❌ Error:", error.message);
    if (error.response) {
      console.error("Response:", error.response.data);
    }
    process.exit(1);
  }
}

pushToGitHub();
