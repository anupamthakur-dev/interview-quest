# Setting Up 2FA for npm Publishing

## Why You Need This

npm requires Two-Factor Authentication (2FA) to publish packages. This is a security measure to protect the npm ecosystem.

## Step-by-Step Setup

### 1. Install Authenticator App (if you don't have one)

Choose one:
- **Google Authenticator** (iOS/Android)
- **Authy** (iOS/Android/Desktop)
- **Microsoft Authenticator** (iOS/Android)
- **1Password** (if you use it)

### 2. Enable 2FA on npm

**Option A: Via Web**
1. Go to: https://www.npmjs.com/settings/YOUR_USERNAME/tfa
2. Click "Enable two-factor authentication"
3. Choose "Authorization and Publishing"
4. Scan the QR code with your authenticator app
5. Enter the 6-digit code shown in the app
6. Save the recovery codes shown

**Option B: Via CLI**
```bash
npm profile enable-2fa auth-and-writes
```

Follow the prompts:
1. Scan the QR code with your authenticator app
2. Enter the verification code
3. Save the recovery codes

### 3. Publish Your Package

```bash
npm publish
```

When prompted, enter the 6-digit code from your authenticator app.

### 4. Success!

Your package is now published! 🎉

Check it at: https://www.npmjs.com/package/interviewquest

---

## Important Notes

### Save Your Recovery Codes!

npm gives you recovery codes when setting up 2FA. **SAVE THESE** in a safe place:
- Password manager
- Secure note
- Printed and stored safely

If you lose access to your authenticator app, these codes are the ONLY way to access your account.

### Publishing After Setup

Every time you publish, you'll need:
1. Run `npm publish`
2. Enter your 2FA code when prompted
3. Done!

### Types of 2FA

npm offers two types:

**Authorization only** (less secure)
- Only needed for login
- Not needed for publishing

**Authorization and Publishing** (recommended) ← USE THIS
- Needed for login AND publishing
- More secure
- Required for publishing packages

---

## Troubleshooting

### "Invalid OTP" Error

- Make sure your phone's time is synced correctly
- Check if you're using the latest code (they expire every 30 seconds)
- Try the next code if current one doesn't work

### Lost Authenticator Access

1. Use your recovery codes
2. If you lost recovery codes, contact npm support: https://www.npmjs.com/support

### Can't Scan QR Code

1. Use the manual entry code shown below the QR code
2. Enter it manually in your authenticator app

---

## Quick Reference

```bash
# Enable 2FA
npm profile enable-2fa auth-and-writes

# Disable 2FA (not recommended)
npm profile disable-2fa

# Check 2FA status
npm profile get

# Publish with 2FA
npm publish
# (Enter code when prompted)
```

---

## After Setup

Once 2FA is enabled:

1. ✅ You can publish packages securely
2. ✅ Your account is protected
3. ✅ You're following npm best practices

**Ready to publish?**

```bash
npm publish
```

Enter your 2FA code and you're done! 🚀
