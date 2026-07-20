import { test, expect } from '@playwright/test'

const CLIENT_ID = 'e2e-client-id' // must match playwright.config webServer env
const EMAIL = 'teacher@test.com'
const API = 'https://api.e2e.test'

// Unsigned JWT — the Cognito SDK only decodes the payload client-side, it
// never verifies signatures, so this is enough for restoreSession().
const fakeJwt = (claims) => {
  const enc = (o) => Buffer.from(JSON.stringify(o)).toString('base64url')
  return `${enc({ alg: 'none', typ: 'JWT' })}.${enc(claims)}.e2e`
}

// Seed localStorage with the keys amazon-cognito-identity-js reads on boot.
async function signIn(page) {
  const now = Math.floor(Date.now() / 1000)
  const token = fakeJwt({ sub: 'e2e-user', email: EMAIL, iat: now, exp: now + 3600 })
  const prefix = `CognitoIdentityServiceProvider.${CLIENT_ID}`
  await page.addInitScript(([p, u, t]) => {
    localStorage.setItem(`${p}.LastAuthUser`, u)
    localStorage.setItem(`${p}.${u}.idToken`, t)
    localStorage.setItem(`${p}.${u}.accessToken`, t)
    localStorage.setItem(`${p}.${u}.refreshToken`, 'e2e-refresh')
    localStorage.setItem(`${p}.${u}.clockDrift`, '0')
  }, [prefix, EMAIL, token])
}

const students = [
  { id: 's1', name: 'Maya Rodriguez', grade: '3rd', points: 42, photo: '🦊', streak: 6, notes: '', createdAt: '2026-08-20T00:00:00Z' },
  { id: 's2', name: 'Jordan Lee', grade: '3rd', points: 38, photo: '🐢', streak: 0, notes: '', createdAt: '2026-08-21T00:00:00Z' },
]

async function mockApi(page) {
  await page.route(`${API}/**`, (route) => {
    const { pathname } = new URL(route.request().url())
    const method = route.request().method()
    const json = (body, status = 200) =>
      route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })

    if (method === 'GET' && pathname === '/classrooms')
      return json({ classrooms: [{ classroomId: 'c1', classroomName: 'Room 12', role: 'owner' }] })
    if (method === 'GET' && pathname === '/classrooms/c1')
      return json({ classroomId: 'c1', classroomName: 'Room 12', role: 'owner', reasons: ['Being awesome', 'Kindness'] })
    if (method === 'PATCH' && pathname === '/classrooms/c1/reasons') {
      const { reasons } = route.request().postDataJSON()
      return json({ reasons })
    }
    if (method === 'GET' && pathname === '/classrooms/c1/school-years')
      return json({
        active: { yearId: 'y1', label: '2026–2027' },
        years: [{ yearId: 'y1', label: '2026–2027', startedAt: '2026-08-18T00:00:00Z', endedAt: null }],
      })
    if (method === 'GET' && pathname === '/classrooms/c1/students')
      return json({ students, archiveYear: null })
    if (method === 'POST' && pathname === '/classrooms/c1/students') {
      const body = route.request().postDataJSON()
      return json({ id: 'new-' + Math.random().toString(36).slice(2, 8), points: 0, streak: 0, notes: '', ...body }, 201)
    }
    if (method === 'GET' && pathname === '/classrooms/c1/students/s1')
      return json({
        ...students[0],
        history: [
          { studentId: 's1', delta: 2, reason: 'Helping', timestamp: '2026-07-01T10:00:00.000Z', yearId: 'y1', grantedBy: 'coteacher@test.com' },
        ],
        historyCursor: null,
      })
    if (method === 'POST' && pathname === '/classrooms/c1/students/s1/points')
      return json({ eventTimestamp: '2026-07-04T12:00:00.000Z', reason: 'Kindness', yearId: 'y1' })
    if (method === 'DELETE' && pathname.startsWith('/classrooms/c1/students/s1/events/'))
      return route.fulfill({ status: 204, body: '' })
    if (method === 'POST' && pathname === '/classrooms/c1/students/bulk-points') {
      const { ids, delta, reason } = route.request().postDataJSON()
      return json({ count: ids.length, delta, reason, timestamp: '2026-07-04T12:00:00.000Z', yearId: 'y1' })
    }
    if (method === 'POST' && pathname === '/classrooms/c1/students/bulk-revert')
      return json({ ok: true })
    if (method === 'GET' && pathname === '/classrooms/c1/analytics/top-reasons')
      return json({ reasons: [], days: 30, yearId: 'y1' })
    return json({ error: `unmocked ${method} ${pathname}` }, 500)
  })
}

test('login gate renders for signed-out visitors', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { name: 'Well Done' })).toBeVisible()
  await expect(page.getByText('Sign in to your classroom')).toBeVisible()
})

test('first-run wizard provisions a classroom and lands on a populated dashboard', async ({ page }) => {
  await signIn(page)
  // Stateful mock: no classroom exists until the wizard creates one.
  let created = null
  const roster = []
  await page.route(`${API}/**`, (route) => {
    const { pathname } = new URL(route.request().url())
    const method = route.request().method()
    const json = (body, status = 200) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) })
    if (method === 'GET' && pathname === '/classrooms')
      return json({ classrooms: created ? [created] : [] })
    if (method === 'POST' && pathname === '/classrooms') {
      const { name } = route.request().postDataJSON()
      created = { classroomId: 'c-new', classroomName: name, role: 'owner' }
      return json({ classroomId: 'c-new', name, role: 'owner' }, 201)
    }
    if (method === 'GET' && pathname === '/classrooms/c-new')
      return json({ classroomId: 'c-new', classroomName: created?.classroomName, role: 'owner', reasons: ['Kindness'] })
    if (method === 'POST' && pathname === '/classrooms/c-new/school-years/start')
      return json({ yearId: 'y1', label: route.request().postDataJSON().label })
    if (method === 'GET' && pathname === '/classrooms/c-new/school-years')
      return json({ active: { yearId: 'y1', label: '2026–2027' }, years: [{ yearId: 'y1', label: '2026–2027', startedAt: '2026-08-18T00:00:00Z', endedAt: null }] })
    if (method === 'POST' && pathname === '/classrooms/c-new/students') {
      const s = { id: 'st-' + roster.length, points: 0, streak: 0, notes: '', ...route.request().postDataJSON() }
      roster.push(s)
      return json(s, 201)
    }
    if (method === 'GET' && pathname === '/classrooms/c-new/students')
      return json({ students: roster, archiveYear: null })
    if (method === 'GET' && pathname === '/classrooms/c-new/analytics/top-reasons')
      return json({ reasons: [], days: 30, yearId: 'y1' })
    return json({ error: `unmocked ${method} ${pathname}` }, 500)
  })

  await page.goto('/')
  await expect(page.getByText('Create your classroom')).toBeVisible()
  await page.getByPlaceholder(/Mrs. Smith/).fill('Room 12')
  await page.getByRole('button', { name: /Continue/ }).click()

  await expect(page.getByText('Start the school year')).toBeVisible()
  await page.getByRole('button', { name: /Continue/ }).click()

  await expect(page.getByText('Add your students')).toBeVisible()
  await page.getByRole('textbox').fill('Alex Kim\nPriya Patel')
  await page.getByRole('button', { name: 'Add 2 & finish' }).click()

  // Landed on the dashboard with the roster in place — no dead-end.
  await expect(page.getByText('Alex Kim')).toBeVisible()
  await expect(page.getByText('Priya Patel')).toBeVisible()
})

test('roster renders for a signed-in teacher', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('Room 12')).toBeVisible()
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()
  await expect(page.getByText('Jordan Lee')).toBeVisible()
})

test('paste-import adds a student per pasted line to the roster', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()

  await page.getByRole('button', { name: 'Add student' }).click() // FAB
  await page.getByRole('button', { name: 'Many' }).click()
  const textarea = page.getByPlaceholder(/Student 1/)
  await textarea.fill('Alex Kim\n\nPriya Patel')
  await page.getByRole('button', { name: 'Add 2 students' }).click()

  await expect(page.getByText('Alex Kim')).toBeVisible()
  await expect(page.getByText('Priya Patel')).toBeVisible()
})

test('deep link straight to a student profile renders it', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/#/students/s1')
  await expect(page.getByText('points earned')).toBeVisible()
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()
})

test('activity attributes a grant to the co-teacher who made it', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/#/students/s1')
  await expect(page.getByText('Helping')).toBeVisible()
  // Current viewer is teacher@test.com; the event was granted by another
  // teacher, so their name (email local-part) is credited.
  await expect(page.getByText(/by coteacher/)).toBeVisible()
})

test('deleting an activity event removes it and reverses the points', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/#/students/s1')
  await expect(page.getByText('Helping')).toBeVisible()
  await expect(page.getByText('42', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Delete event: Helping' }).click()
  await page.getByRole('button', { name: 'Delete', exact: true }).click()

  await expect(page.getByText('Helping')).toHaveCount(0)
  await expect(page.getByText('40', { exact: true })).toBeVisible() // 42 − 2
})

test('granting 2 points updates the profile and undo reverts it', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')

  await page.getByText('Maya Rodriguez').click()
  await expect(page.getByText('points earned')).toBeVisible()
  await expect(page.getByText('42', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: '2', exact: true }).click()
  await page.getByRole('button', { name: 'Kindness' }).click()

  await expect(page.getByText('44', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.getByText('42', { exact: true })).toBeVisible()
})

test('class point grants +1 to the whole class and undo reverts it', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()
  await expect(page.getByText('42', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Give the whole class a point' }).click()
  // The reason menu opens; pick a preset to commit the grant.
  await page.getByRole('button', { name: 'Kindness' }).click()

  // Optimistic +1 across the roster: Maya 42→43, Jordan 38→39.
  await expect(page.getByText('43', { exact: true })).toBeVisible()
  await expect(page.getByText('39', { exact: true })).toBeVisible()

  await page.getByRole('button', { name: 'Undo' }).click()
  await expect(page.getByText('42', { exact: true })).toBeVisible()
  await expect(page.getByText('38', { exact: true })).toBeVisible()
})

test('sort preference defaults to A–Z and persists across a reload', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()

  // New default is A–Z (was "recent").
  await expect(page.getByLabel('Sort students')).toHaveValue('name')

  // Change it, reload, and confirm the choice stuck (persisted per classroom).
  await page.getByLabel('Sort students').selectOption('pointsDesc')
  await page.reload()
  await expect(page.getByText('Maya Rodriguez')).toBeVisible()
  await expect(page.getByLabel('Sort students')).toHaveValue('pointsDesc')
})

test('owner can open and customize the classroom reason list', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/#/settings')
  await page.getByRole('button', { name: /Customize award reasons/ }).click()
  // The custom list loaded from the classroom (not the hardcoded presets).
  await expect(page.getByLabel('Reason 1')).toHaveValue('Being awesome')
  await page.getByRole('button', { name: 'Add reason' }).click()
  await page.getByPlaceholder('Reason').last().fill('Great listening')
  await page.getByRole('button', { name: 'Save reasons' }).click()
  // Saved → navigates back to Settings.
  await expect(page.getByRole('heading', { name: 'Settings' })).toBeVisible()
})

test('a custom reason shows up in the grant reason menu', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/#/students/s1')
  await page.getByRole('button', { name: '2', exact: true }).click()
  await expect(page.getByRole('button', { name: 'Being awesome' })).toBeVisible()
})

test('select-all selects every student and the footer reflects the count', async ({ page }) => {
  await signIn(page)
  await mockApi(page)
  await page.goto('/')
  await page.getByRole('button', { name: 'Select multiple students' }).click()
  await page.getByRole('button', { name: 'Select all students' }).click()
  await expect(page.getByRole('button', { name: /Award to 2 students/ })).toBeVisible()
  // Toggle label flips once everything is selected.
  await expect(page.getByRole('button', { name: 'Deselect all students' })).toBeVisible()
})
