# Repository migration

The original `frontend`, `admin-dashboard`, and `backend` repositories were consolidated into the root `notervo-2` repository on 2026-09-12. Their files now live under `apps/`.

| Original repository | Imported commits | Original HEAD                              |
| ------------------- | ---------------- | ------------------------------------------ |
| frontend            | 9                | `0cb7b1f1c92d2a541bca1ab70ff6267670c12cf3` |
| admin-dashboard     | 1                | `1846fcb794d4d67b390cb2d1c44d88f86ff87d23` |
| backend             | 10               | `61f0ba46acc24994225c30f8982d80eea5f0b3d0` |

All 20 original commits, including the backend merge, were imported. Authors, timestamps, and ancestry were retained. Paths were prefixed with `apps/<original-name>/`, and messages were normalized to `chore(<original-name>): <original subject>`. This preserves what the old messages actually said instead of inventing historical intent. Each imported commit contains an `Original-Commit:` trailer.

History rewriting changes commit hashes. The implementation uses [git-filter-repo](https://github.com/newren/git-filter-repo/blob/main/Documentation/git-filter-repo.txt). Original and imported HEAD tree hashes were compared before application cleanup, verifying byte-identical Git content. Original worktrees were clean before migration.

Rewritten legacy tips are preserved as `archive/<application>/heads/<branch>` branches. The backend's `flyio-new-files` branch is retained. `main` contains all three imported histories plus consolidation and repair commits. No remote was configured or pushed.

Verified Git bundles and the original local files are stored outside the repository at `D:\MyProjects\notervo-2-backup-20260912-162457`. `migration.json` in that directory records original and rewritten heads. Original `.git` metadata is retained in the backup, not nested in this project. A policy check rejected recursive removal; remaining metadata was moved into the backup instead.

The root `.git/migration-backup-path` records the local backup path but is not versioned. Keep these backups private and separate from any future public repository.

To inspect an original repository without altering this workspace:

```sh
git clone /path/to/frontend.bundle restored-frontend
```

The consolidation preserves original ignored `.env` files locally and adds localhost-only `.env.local` overrides. None of those files belongs in version control. Per-app lockfiles and ignore files were replaced by shared root files. Legacy deployment configuration is archived rather than connected to an active provider.
