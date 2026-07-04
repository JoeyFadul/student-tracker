# 03 · Auth & Account

Identity is AWS Cognito, email + password only (email is the username; no
SSO, no magic links, no MFA). All flows live on one card whose form swaps by
mode — the chrome stays visually stable.

## Sign in / sign up

- **FR-AU-1** Sign in with email + password. Emails are lowercased at every
  entry point (client and server) so case never creates duplicate identities.
- **FR-AU-2** Sign up requires email, password, confirm-password (client
  checks match). Cognito policy: minimum 12 characters. Signup emails a
  6-digit verification code; the UI advances to a verify step.
- **FR-AU-3** Verify step: entering the code confirms the account and then
  **auto-signs-in** with the password still held in memory — the user lands
  in the app (onboarding) without retyping credentials.
- **FR-AU-4** Resend code is available from the verify step.
- **FR-AU-5** If an unverified user tries to sign in, the app auto-sends a
  fresh code and routes them to verify with an explanatory message (no
  dead-end error).
- **FR-AU-6** Forgot password: email → 6-digit code → code + new password →
  auto-sign-in with the new password.
- **FR-AU-7** Legacy forced-password-change path (admin-created users) is
  still supported: sign-in can return "new password required" and the card
  swaps to a set-password form.

## Session behavior

- **FR-AU-8** Sessions persist across launches (tokens in local storage via
  Cognito SDK; Capacitor secure-storage plugin is bundled for native).
  On launch the app restores silently — returning users never see login.
- **FR-AU-9** Tokens auto-refresh 5 minutes before expiry via timer, and on
  app-foreground/tab-focus if inside that window (iOS suspends timers in
  background — the resume path covers it). Concurrent refreshes are
  deduplicated.
- **FR-AU-10** If refresh fails (revoked/expired refresh token), the user is
  signed out to the login screen rather than left hitting 401s.
- **FR-AU-11** Sign out clears Cognito tokens **and** all app-local state
  (`wd:*` keys, e.g. remembered classroom) so the next account on the same
  device inherits nothing. The signed-in component tree unmounts entirely
  for the same reason.

## Account deletion (App Store requirement)

- **FR-AU-12** Settings → Delete account, behind a typed/eyes-open confirm
  modal. Two phases: (1) backend deletes every classroom the user **owns**
  (all students, events, years, member links) and detaches them from
  classrooms they merely joined; (2) the Cognito identity is deleted. Then
  local state clears to the login screen.
- **FR-AU-13** **[Observed quirk]** Deleting an owner account destroys the
  classroom for co-teachers too, with no warning about other members and no
  ownership-transfer option. 2.0 should decide: warn, block, or transfer.

## Non-functional

- Auth errors surface as inline banner text in the card; busy states
  disable the submit button with label change ("Signing in…").
- No rate-limit UX beyond Cognito's own errors. No "remember this device".
