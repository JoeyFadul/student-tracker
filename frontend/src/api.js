import { API_URL } from './config';

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

  const yearQuery = (year) => year ? `?year=${encodeURIComponent(year)}` : '';

  return {
    listStudents: (year) =>
      fetch(`${API_URL}/students${yearQuery(year)}`, { headers }).then(handleResponse),

    getStudent: (id, year) =>
      fetch(`${API_URL}/students/${id}${yearQuery(year)}`, { headers }).then(handleResponse),

    createStudent: (data) =>
      fetch(`${API_URL}/students`, {
        method: 'POST',
        headers,
        body: JSON.stringify(data),
      }).then(handleResponse),

    updateStudent: (id, patch) =>
      fetch(`${API_URL}/students/${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify(patch),
      }).then(handleResponse),

    deleteStudent: (id) =>
      fetch(`${API_URL}/students/${id}`, {
        method: 'DELETE',
        headers,
      }).then(handleResponse),

    grantPoints: (id, delta, reason) =>
      fetch(`${API_URL}/students/${id}/points`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ delta, reason }),
      }).then(handleResponse),

    getPhotoUploadUrl: (id) =>
      fetch(`${API_URL}/students/${id}/photo-upload`, { headers }).then(handleResponse),

    deleteEvent: (id, timestamp) =>
      fetch(`${API_URL}/students/${id}/events/${encodeURIComponent(timestamp)}`, {
        method: 'DELETE',
        headers,
      }).then(handleResponse),

    bulkGrantPoints: (ids, delta, reason) =>
      fetch(`${API_URL}/students/bulk-points`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ ids, delta, reason }),
      }).then(handleResponse),

    getTopReasons: (days = 30, year) => {
      const params = new URLSearchParams({ days });
      if (year) params.set('year', year);
      return fetch(`${API_URL}/analytics/top-reasons?${params}`, { headers }).then(handleResponse);
    },

    listSchoolYears: () =>
      fetch(`${API_URL}/school-years`, { headers }).then(handleResponse),

    startSchoolYear: (label) =>
      fetch(`${API_URL}/school-years/start`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ label }),
      }).then(handleResponse),

    endSchoolYear: () =>
      fetch(`${API_URL}/school-years/end`, {
        method: 'POST',
        headers,
      }).then(handleResponse),
  };
}
