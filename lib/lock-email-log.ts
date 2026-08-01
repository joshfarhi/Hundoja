import { appendFile } from 'fs/promises';
import path from 'path';

const DEFAULT_LOG_PATH = 'lock-emails.txt';
const DEFAULT_REPO_OWNER = 'joshfarhi';
const DEFAULT_REPO_NAME = 'hundoja';
const DEFAULT_BRANCH = 'main';
const GITHUB_API_VERSION = '2022-11-28';

type GitHubContentsResponse = {
  content?: string;
  sha?: string;
};

function getLogPath() {
  const configuredPath = process.env.LOCK_EMAIL_LOG_PATH || DEFAULT_LOG_PATH;
  const logPath = configuredPath.replace(/^\/+/, '').replace(/\\/g, '/');

  if (!logPath || logPath.split('/').includes('..')) {
    throw new Error('Invalid LOCK_EMAIL_LOG_PATH');
  }

  return logPath;
}

function getLogLine(email: string) {
  return `${new Date().toISOString()}\t${email.toLowerCase()}\n`;
}

function getEncodedRepoPath(filePath: string) {
  return filePath.split('/').map(encodeURIComponent).join('/');
}

async function getExistingFile(
  url: string,
  headers: HeadersInit
): Promise<{ content: string; sha?: string }> {
  const response = await fetch(url, { headers, cache: 'no-store' });

  if (response.status === 404) {
    return { content: '' };
  }

  if (!response.ok) {
    throw new Error(`GitHub file read failed with status ${response.status}`);
  }

  const data = (await response.json()) as GitHubContentsResponse;
  const rawContent = data.content ? data.content.replace(/\n/g, '') : '';

  return {
    content: rawContent ? Buffer.from(rawContent, 'base64').toString('utf8') : '',
    sha: data.sha,
  };
}

async function appendViaGitHub(filePath: string, line: string) {
  const token = process.env.GITHUB_EMAIL_LOG_TOKEN;

  if (!token) {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('Missing GITHUB_EMAIL_LOG_TOKEN');
    }

    await appendFile(path.join(process.cwd(), filePath), line, 'utf8');
    return;
  }

  const owner =
    process.env.GITHUB_EMAIL_LOG_OWNER ||
    process.env.VERCEL_GIT_REPO_OWNER ||
    DEFAULT_REPO_OWNER;
  const repo =
    process.env.GITHUB_EMAIL_LOG_REPO ||
    process.env.VERCEL_GIT_REPO_SLUG ||
    DEFAULT_REPO_NAME;
  const branch =
    process.env.GITHUB_EMAIL_LOG_BRANCH ||
    process.env.VERCEL_GIT_COMMIT_REF ||
    DEFAULT_BRANCH;
  const apiBase = process.env.GITHUB_API_URL || 'https://api.github.com';
  const contentsUrl = `${apiBase}/repos/${owner}/${repo}/contents/${getEncodedRepoPath(filePath)}`;
  const readUrl = `${contentsUrl}?ref=${encodeURIComponent(branch)}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'hundoja-lock-email-capture',
  };

  for (let attempt = 0; attempt < 2; attempt += 1) {
    const existingFile = await getExistingFile(readUrl, headers);
    const body: {
      message: string;
      content: string;
      branch: string;
      sha?: string;
    } = {
      message: 'Capture lock page email',
      content: Buffer.from(`${existingFile.content}${line}`).toString('base64'),
      branch,
    };

    if (existingFile.sha) {
      body.sha = existingFile.sha;
    }

    const response = await fetch(contentsUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });

    if (response.ok) {
      return;
    }

    if (response.status !== 409 || attempt === 1) {
      throw new Error(`GitHub file update failed with status ${response.status}`);
    }
  }
}

export async function recordLockEmail(email: string) {
  await appendViaGitHub(getLogPath(), getLogLine(email));
}
