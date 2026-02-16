# Pre-Publishing Checklist

Before running `npm publish`, complete this checklist:

## Essential Changes

- [ ] **Update package.json author information**
  ```json
  "author": {
    "name": "Your Actual Name",
    "email": "your.actual.email@example.com"
  }
  ```

- [ ] **Update package.json repository URL**
  ```json
  "repository": {
    "type": "git",
    "url": "https://github.com/YOUR-USERNAME/interviewquest.git"
  }
  ```

- [ ] **Update package.json bugs URL**
  ```json
  "bugs": {
    "url": "https://github.com/YOUR-USERNAME/interviewquest/issues"
  }
  ```

- [ ] **Update package.json homepage**
  ```json
  "homepage": "https://github.com/YOUR-USERNAME/interviewquest#readme"
  ```

## Verification Steps

- [ ] Run `npm run build` - ✅ Should complete without errors
- [ ] Run `npm run verify` - ✅ Should pass all checks
- [ ] Run `npm link` - ✅ Should link successfully
- [ ] Run `interviewquest` - ✅ Should launch the game
- [ ] Test the game - ✅ Should work properly
- [ ] Run `npm unlink -g interviewquest` - ✅ Cleanup after testing

## Pre-Publish

- [ ] Check package name availability: https://www.npmjs.com/package/interviewquest
  - If taken, decide on alternative name or use scoped package
  
- [ ] Create npm account (if you don't have one): https://www.npmjs.com/signup

- [ ] Login to npm: `npm login`

- [ ] Verify login: `npm whoami`

## Publishing

- [ ] Run `npm publish`

- [ ] Verify on npm: https://www.npmjs.com/package/interviewquest

- [ ] Test installation: `npm install -g interviewquest`

- [ ] Test command: `interviewquest`

## Post-Publishing

- [ ] Commit changes to git: `git add . && git commit -m "Published v1.0.0"`

- [ ] Push to GitHub: `git push`

- [ ] Create GitHub release (optional but recommended)

- [ ] Share your package! 🎉

## Notes

**If package name is taken:**

Option 1 - Scoped package:
```json
{
  "name": "@your-npm-username/interviewquest"
}
```

Option 2 - Different name:
```json
{
  "name": "interview-quest-cli"
}
```

**Remember:** The binary command name (`interviewquest`) stays the same regardless of package name!

---

✅ **Once you complete this checklist, you're ready to publish!**
