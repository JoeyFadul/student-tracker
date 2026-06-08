# App Store Connect listing — Well Done

Copy-paste-ready text for App Store Connect. Plain text only — App Store Connect does not render Markdown, so asterisks would appear literally. Line breaks survive.

---

## App Name

```
Well Done
```

---

## Subtitle (max 30 characters)

Recommended:

```
Classroom reward tracker
```

(24 chars)

Alternates:

- `Track classroom rewards` (23)
- `Positive behavior tracker` (25)
- `Reward your classroom` (20)

The subtitle appears under the app name in search results — strong conversion driver.

---

## Promotional Text (max 170 characters)

```
Recognize positive behavior in seconds. Quick points, bulk rewards, photo profiles, year-end archives. Private by design — no ads, no tracking.
```

(149 chars)

Shown above the description on the App Store product page. **Can be updated without re-submitting** the binary, so this is the slot for seasonal copy, new-feature callouts, or A/B testing later.

---

## Description (max 4000 characters)

```
Well Done is a classroom reward tracker built for teachers — fast enough to use mid-lesson, private enough to actually trust with your students' information.

WHY TEACHERS USE WELL DONE

• One-tap rewards. Quick buttons for 1, 2, or 5 points keep the flow moving while you teach. Tap a student, pick an amount, pick a reason, done.

• Bulk grant. Recognize a whole table, a whole reading group, or the whole class in a single action. Select students, set the amount, add a reason, and every student is updated atomically.

• Reasons that matter. Preset categories — Kindness, Effort, Helping, Homework, Participation, Listening, Cleanup, Teamwork — or type your own custom reason for any moment that doesn't fit a bucket.

• Photo profiles. Every student gets a profile with their photo and behavior notes you can update over the year. Photos live in your private cloud storage and are only ever visible to you.

• Activity history with one-tap undo. Every grant and every revoke is logged with a timestamp. Made a mistake? Undo from the toast before it dismisses — no buried "delete this entry" workflow.

• School year archives. End your year and start a fresh one. Points reset, students roll forward, and last year's data stays fully viewable in the archive so you can look back any time.

• Insights. See the top reasons your class is being rewarded for, identify behavior patterns, celebrate growth across a marking period or a whole year.

WHAT'S NOT IN WELL DONE

No advertising. No third-party analytics SDKs tracking how you use the app. No data sharing. No accounts for children. Your sign-in token is stored in the iOS Keychain. Your photos live in a private cloud bucket and only you can see them.

BUILT FOR

Teachers running K–5 classrooms. After-school programs. Tutors with regular groups. Anyone who wants to recognize positive behavior without paperwork.

PRIVACY

We collect what we need to run the app for you — your email for sign-in, and the classroom and student information you enter yourself. We never sell or share it. Full details at welldonestudent.com/privacy.

SUPPORT

Questions, feedback, or need help with anything? Email support@welldonestudent.com.

Pricing: Free.
```

(2,237 chars — plenty of room to expand later)

---

## Keywords (max 100 characters total, comma-separated, no spaces)

```
classroom,students,rewards,behavior,points,positive,praise,stars,chart,elementary
```

(81 chars)

Why these:
- Targeted at terms teachers actually search: "classroom management", "student rewards", "behavior tracking", "positive reinforcement", "reward chart"
- No spaces around commas (Apple counts spaces against your budget)
- No competitor names (would get the listing rejected)
- No words already in title or subtitle ("tracker" is in the subtitle, so dropped here)

---

## Where each piece goes in App Store Connect

### App Information

| Field | Value |
|---|---|
| Subtitle | `Classroom reward tracker` |
| Primary Category | Education |
| Secondary Category | Productivity (optional) |
| Content Rights | I do not own or have licensed third-party content (no copyrighted material used) |

### Pricing & Availability

| Field | Value |
|---|---|
| Pricing | Free |
| Availability | All territories |

### Version 1.0 (left rail)

| Field | Value |
|---|---|
| Description | The big block above |
| Keywords | The 81-char line |
| Promotional Text | The 149-char line |
| Support URL | `https://welldonestudent.com` |
| Marketing URL | `https://welldonestudent.com` |
| Copyright | `2026 Well Done` |

### App Privacy

Declare exactly two types — both as "App Functionality", not linked to identity, not used for tracking:

| Data type | Category | Purpose | Linked to identity? | Used for tracking? |
|---|---|---|---|---|
| Email Address | Contact Info | App Functionality | No | No |
| Photos or Videos | User Content | App Functionality | No | No |

No analytics. No advertising. No diagnostics SDK data. No third-party tracking.

### App Review Information

| Field | Value |
|---|---|
| Sign-in required | Yes |
| Demo account email | (set up a fresh test account) |
| Demo account password | (set up a fresh test account) |
| Contact email | `support@welldonestudent.com` |
| Notes | "Demo account is pre-seeded with one classroom and 6 students. Use the quick buttons (1/2/5) on a student profile to grant points, or tap … to enter a custom amount. Bulk grant: tap any student name in the dashboard list once to enter select mode, then choose multiple. Account deletion: Settings → Delete account." |

---

## Required URLs (already live)

- Privacy Policy: `https://welldonestudent.com/privacy`
- Terms of Service: `https://welldonestudent.com/terms`
- Marketing / Support: `https://welldonestudent.com`

---

## Screenshots

Required: at least one set for **6.7" iPhone** (1290×2796 px). 3–10 screenshots. Recommended captures:

1. Dashboard — students list with mixed point totals
2. Student profile — photo, points, activity history
3. Grant flow — mid-flow showing the reason picker
4. Bulk grant — multiple students selected
5. Stats — totals and on-streak count

Captured from Xcode Simulator → iPhone 15 Pro Max → File → Save Screenshot (Cmd+S).
