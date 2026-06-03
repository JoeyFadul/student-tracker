// API client. Returns an object with one method per endpoint.
// All methods throw on non-2xx responses with a descriptive Error.

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

  return {
    listStudents: () =>
      fetch(`${API_URL}/students`, { headers }).then(handleResponse),

    getStudent: (id) =>
      fetch(`${API_URL}/students/${id}`, { headers }).then(handleResponse),

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

    getTopReasons: (days = 30) =>
      fetch(`${API_URL}/analytics/top-reasons?days=${days}`, { headers }).then(handleResponse),
  };
}
