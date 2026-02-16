# Publishing Guide for InterviewQuest

This guide will help you publish InterviewQuest to npm so users can install it globally and run it with the `interviewquest` command.

## Prerequisites

1. **npm Account**
   - Create an account at https://www.npmjs.com/signup
   - Verify your email address

2. **npm CLI Login**
   ```bash
   npm login
   ```
   Enter your npm username, password, and email when prompted.

3. **Verify Login**
   ```bash
   npm whoami
   ```

## Pre-Publishing Checklist

Before publishing, ensure:

- [ ] All code is committed to git
- [ ] Version number is correct in `package.json`
- [ ] `package.json` has correct author information
- [ ] `package.json` has correct repository URL
- [ ] `README.md` is up to date
- [ ] `LICENSE` file exists
- [ ] `.npmignore` is configured correctly
- [ ] Build completes successfully: `npm run build`
- [ ] Package name is available on npm (check: https://www.npmjs.com/package/interviewquest)

## Update Package Information

**Edit `package.json`:**

```json
{
  "name": "interviewquest",
  "version": "1.0.0",
  "author": {
    "name": "Your Name",
    "email": "your.email@example.com"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/interviewquest.git"
  }
}
```

Replace:
- `Your Name` with your actual name
- `your.email@example.com` with your email
- `yourusername` with your GitHub username

## Publishing Steps

### 1. Test Locally First

```bash
# Build the project
npm run build

# Test local installation
npm link

# Test the command
interviewquest

# Unlink when done testing
npm unlink -g interviewquest
```

### 2. Check What Will Be Published

```bash
npm pack --dry-run
```

This shows you exactly what files will be included in the package.

### 3. Publish to npm

**For first-time publishing:**

```bash
npm publish
```

**For scoped packages (if using @yourname/interviewquest):**

```bash
npm publish --access public
```

### 4. Verify Publication

```bash
# Check on npm
npm view interviewquest

# Or visit
# https://www.npmjs.com/package/interviewquest
```

### 5. Test Global Installation

```bash
# Install globally from npm
npm install -g interviewquest

# Run the command
interviewquest

# Uninstall when done testing
npm uninstall -g interviewquest
```

## Version Management

### Updating Versions

Use npm's built-in versioning:

```bash
# Patch version (1.0.0 -> 1.0.1) for bug fixes
npm version patch

# Minor version (1.0.0 -> 1.1.0) for new features
npm version minor

# Major version (1.0.0 -> 2.0.0) for breaking changes
npm version major
```

These commands will:
- Update version in `package.json`
- Create a git commit
- Create a git tag

### Publishing Updates

```bash
# After version bump
npm publish

# Push changes and tags to GitHub
git push && git push --tags
```

## Package Name Considerations

### If "interviewquest" is Already Taken:

**Option 1: Use a scoped package**
```json
{
  "name": "@yourname/interviewquest",
  "bin": {
    "interviewquest": "./dist/bin/interviewquest.js"
  }
}
```

Install: `npm install -g @yourname/interviewquest`
Run: `interviewquest`

**Option 2: Use a different name**
```json
{
  "name": "interview-quest-cli",
  "bin": {
    "interviewquest": "./dist/bin/interviewquest.js"
  }
}
```

Install: `npm install -g interview-quest-cli`
Run: `interviewquest`

## Troubleshooting

### Permission Denied on Publish

```bash
# Check if you're logged in
npm whoami

# If not logged in
npm login
```

### Package Name Already Exists

1. Check if the package exists: https://www.npmjs.com/package/interviewquest
2. If taken, use a scoped package or different name (see above)

### Command Not Found After Installation

```bash
# Check npm global bin path
npm bin -g

# Ensure it's in your PATH
echo $PATH  # Unix/Mac
echo $env:PATH  # Windows PowerShell
```

### Build Errors

```bash
# Clean and rebuild
rm -rf dist node_modules
npm install
npm run build
```

## Post-Publishing

### 1. Update Repository

```bash
git add .
git commit -m "Published v1.0.0 to npm"
git push
```

### 2. Create GitHub Release

1. Go to GitHub repository
2. Click "Releases" → "Create a new release"
3. Tag version: `v1.0.0`
4. Release title: `InterviewQuest v1.0.0`
5. Add release notes
6. Publish release

### 3. Share Your Package

Add badges to your README:

```markdown
[![npm version](https://badge.fury.io/js/interviewquest.svg)](https://www.npmjs.com/package/interviewquest)
[![npm downloads](https://img.shields.io/npm/dm/interviewquest.svg)](https://www.npmjs.com/package/interviewquest)
```

## Maintenance

### Unpublishing (Use with Caution!)

```bash
# Unpublish specific version (within 72 hours)
npm unpublish interviewquest@1.0.0

# Unpublish entire package (use extreme caution!)
npm unpublish interviewquest --force
```

**Note:** npm discourages unpublishing. It's better to publish a new version with fixes.

### Deprecating a Version

```bash
npm deprecate interviewquest@1.0.0 "Please upgrade to 1.0.1+"
```

## Quick Reference

```bash
# Login to npm
npm login

# Build
npm run build

# Test locally
npm link
interviewquest
npm unlink -g interviewquest

# Check package contents
npm pack --dry-run

# Publish
npm publish

# Update version
npm version patch|minor|major

# View package info
npm view interviewquest
```

---

**Ready to publish?**

1. ✅ Update `package.json` with your details
2. ✅ Run `npm run build`
3. ✅ Run `npm link` to test locally
4. ✅ Run `npm publish`
5. ✅ Test: `npm install -g interviewquest && interviewquest`

Good luck! 🚀
