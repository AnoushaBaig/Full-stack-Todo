---
name: auth-skill
description: Handle secure authentication flows including sign-in, password hashing, JWT token management, and Better Auth integration.
---

# Auth Skill

## Instructions

1. **Authentication flows**
   - Implement secure user sign-in and (if required) sign-up
   - Validate credentials safely and consistently
   - Handle authentication errors without leaking sensitive information

2. **Password handling**
   - Hash passwords using industry-standard algorithms (bcrypt or argon2)
   - Never store or log plain-text passwords
   - Verify passwords securely during sign-in

3. **JWT token management**
   - Generate JWT access tokens with proper claims
   - Implement refresh token logic where applicable
   - Handle token expiration, rotation, and revocation
   - Ensure secure token storage and transmission

4. **Better Auth integration**
   - Integrate Better Auth according to official best practices
   - Configure providers, sessions, and token strategies correctly
   - Ensure compatibility with backend and frontend auth flows

## Security Best Practices
- Follow OWASP authentication guidelines
- Use strong password policies
- Protect against token leakage and replay attacks
- Validate all inputs and authentication states
- Use secure defaults for cookies, headers, and sessions

## Example Usage
```ts
// Pseudocode example
const user = await auth.verifyCredentials(email, password)

if (!user) {
  throw new AuthError("Invalid credentials")
}

const accessToken = auth.generateJWT(user.id)
const refreshToken = auth.generateRefreshToken(user.id)
