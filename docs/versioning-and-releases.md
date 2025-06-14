# How to Release a New Version

## Simple steps for releasing a new version of BMAD-METHOD

```bash
# 1. Commit all changes
git add .
git commit -m "feat: add versioning and release automation"

# 2. Bump version
npm run version:minor  # 4.0.0 → 4.1.0

# 3. Push to GitHub (when ready)
git push && git push --tags
```text

## Available Commands

```bash
npm run version:patch   # 4.1.0 → 4.1.1 (bug fixes)
npm run version:minor   # 4.1.0 → 4.2.0 (new features)
npm run version:major   # 4.1.0 → 5.0.0 (breaking changes)
```

## What the Version Bump Does

1. Updates `package.json` version
2. Creates git commit: `chore: bump version to vX.Y.Z`
3. Creates git tag: `vX.Y.Z`
4. Shows reminder to push

## To Publish to NPM (Optional)

```bash
npm publish
```

Then users can run: `npx bmad-method` to get the new version.
