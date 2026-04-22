const API_BASE = process.env.PW_API_BASE_URL || 'http://127.0.0.1:5000';

function setAuthToLocalStorage(page, data) {
  return page.addInitScript(({ token, user }) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  }, { token: data.token, user: data });
}

export async function loginAsStudent(request, page, email, password) {
  const res = await request.post(`${API_BASE}/api/auth/login`, {
    data: { email, password, role: 'Student' },
  });
  const data = await res.json();
  if (!res.ok()) throw new Error(data?.message || 'Student login failed');
  await setAuthToLocalStorage(page, data);
}

export async function loginAsAdmin(request, page, email, password, role = 'Warden') {
  const res = await request.post(`${API_BASE}/api/auth/login`, {
    data: { email, password, role },
  });
  const data = await res.json();
  if (!res.ok()) throw new Error(data?.message || 'Admin login failed');
  await setAuthToLocalStorage(page, data);
}