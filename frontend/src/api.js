import { API_URL } from './config';
import { resolvePhotoUrl } from './lib/photoCache';

// Replace presigned photo URLs with cache-stable versions so navigations
// within a session don't re-download the same image. See lib/photoCache.js.
const withCachedPhoto = (s) => (s ? { ...s, photo: resolvePhotoUrl(s.photo) } : s);

const handleResponse = async (res) => {
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API ${res.status}: ${text || res.statusText}`);
  }
  if (res.status === 204) return null;
  return res.json();
};

export function createApiClient(idToken) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${idToken}`,
  };

  const get = (url) => fetch(url, { headers }).then(handleResponse);
  const post = (url, body) => fetch(url, { method: 'POST', headers, body: JSON.stringify(body ?? {}) }).then(handleResponse);
  const patch = (url, body) => fetch(url, { method: 'PATCH', headers, body: JSON.stringify(body) }).then(handleResponse);
  const del = (url) => fetch(url, { method: 'DELETE', headers }).then(handleResponse);

  const yearQuery = (year) => year ? `?year=${encodeURIComponent(year)}` : '';
  const cBase = (cid) => `${API_URL}/classrooms/${cid}`;

  return {
    // Classrooms
    listClassrooms: () => get(`${API_URL}/classrooms`),
    createClassroom: (name) => post(`${API_URL}/classrooms`, { name }),
    getClassroom: (cid) => get(cBase(cid)),
    renameClassroom: (cid, name) => patch(cBase(cid), { name }),
    deleteClassroom: (cid) => del(cBase(cid)),

    // Members
    listMembers: (cid) => get(`${cBase(cid)}/members`),
    addMember: (cid, email) => post(`${cBase(cid)}/members`, { email }),
    removeMember: (cid, email) => del(`${cBase(cid)}/members/${encodeURIComponent(email)}`),

    // Students
    listStudents: (cid, year) =>
      get(`${cBase(cid)}/students${yearQuery(year)}`)
        .then(d => ({ ...d, students: (d.students || []).map(withCachedPhoto) })),
    getStudent: (cid, id, year) =>
      get(`${cBase(cid)}/students/${id}${yearQuery(year)}`).then(withCachedPhoto),
    createStudent: (cid, data) =>
      post(`${cBase(cid)}/students`, data).then(withCachedPhoto),
    updateStudent: (cid, id, patchBody) =>
      patch(`${cBase(cid)}/students/${id}`, patchBody).then(withCachedPhoto),
    deleteStudent: (cid, id) => del(`${cBase(cid)}/students/${id}`),
    grantPoints: (cid, id, delta, reason) => post(`${cBase(cid)}/students/${id}/points`, { delta, reason }),
    getStudentActivity: (cid, id, cursor, year) => {
      const params = new URLSearchParams();
      if (cursor) params.set('cursor', cursor);
      if (year) params.set('year', year);
      const qs = params.toString();
      return get(`${cBase(cid)}/students/${id}/activity${qs ? `?${qs}` : ''}`);
    },
    getPhotoUploadUrl: (cid, id) => get(`${cBase(cid)}/students/${id}/photo-upload`),
    deleteEvent: (cid, id, timestamp) => del(`${cBase(cid)}/students/${id}/events/${encodeURIComponent(timestamp)}`),
    bulkGrantPoints: (cid, ids, delta, reason) => post(`${cBase(cid)}/students/bulk-points`, { ids, delta, reason }),
    bulkRevertPoints: (cid, ids, delta, timestamp, yearId) =>
      post(`${cBase(cid)}/students/bulk-revert`, { ids, delta, timestamp, yearId }),

    // School years
    listSchoolYears: (cid) => get(`${cBase(cid)}/school-years`),
    startSchoolYear: (cid, label) => post(`${cBase(cid)}/school-years/start`, { label }),
    endSchoolYear: (cid) => post(`${cBase(cid)}/school-years/end`),
    deleteSchoolYear: (cid, yearId) => del(`${cBase(cid)}/school-years/${encodeURIComponent(yearId)}`),

    // Analytics
    getTopReasons: (cid, days = 30, year) => {
      const params = new URLSearchParams({ days });
      if (year) params.set('year', year);
      return get(`${cBase(cid)}/analytics/top-reasons?${params}`);
    },
  };
}
