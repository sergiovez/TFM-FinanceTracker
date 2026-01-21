const API_BASE = "/api";

export function getCSRFToken() {
  const name = "csrftoken=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) return cookie.substring(name.length);
  }
  return "";
}

async function fetchWithSession(url, options = {}) {
  const opts = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  if (["POST", "PUT", "PATCH", "DELETE"].includes(opts.method?.toUpperCase())) {
    opts.headers["X-CSRFToken"] = getCSRFToken();
  }

  const res = await fetch(url, opts);

if (!res.ok) {
  let errorMessage = `HTTP ${res.status}`;
  try {
    const data = await res.json();

    if (data.detail) errorMessage = data.detail;
    else if (typeof data === 'object') {
      const firstKey = Object.keys(data)[0];
      if (Array.isArray(data[firstKey])) errorMessage = data[firstKey][0];
      else errorMessage = data[firstKey];
    }
  } catch {
    const text = await res.text();
    if (text) errorMessage = text;
  }

  if (res.status === 401) {
    if (typeof window.logout === "function") window.logout();
    throw new Error("No estás autenticado. Inicia sesión de nuevo.");
  }
  if (res.status === 403) {
    throw new Error("No tienes permisos para realizar esta acción.");
  }

  throw new Error(errorMessage);
}

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) return res.json();
  return res;
}

// ---- CRUD CATEGORÍAS ----
export function fetchCategories() {
  return fetchWithSession(`${API_BASE}/categories/`);
}

export function createCategory(categoryData) {
  return fetchWithSession(`${API_BASE}/categories/`, {
    method: "POST",
    body: JSON.stringify(categoryData),
  });
}

export function updateCategory(id, data) {
  return fetchWithSession(`${API_BASE}/categories/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteCategory(id) {
  return fetchWithSession(`${API_BASE}/categories/${id}/`, {
    method: 'DELETE',
  });
}

// ---- CRUD GASTOS ----
export function fetchExpenses() {
  return fetchWithSession(`${API_BASE}/expenses/`);
}

export function createExpense(expenseData) {
  return fetchWithSession(`${API_BASE}/expenses/`, {
    method: "POST",
    body: JSON.stringify(expenseData),
  });
}

export function updateExpense(id, data) {
  return fetchWithSession(`${API_BASE}/expenses/${id}/`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}

export function deleteExpense(id) {
  return fetchWithSession(`${API_BASE}/expenses/${id}/`, {
    method: 'DELETE',
  });
}

// ---- DASHBOARD ----
export function fetchExpensesByCategory() {
  return fetchWithSession(`${API_BASE}/dashboard/expenses-by-category/`);
}

export function fetchExpensesByMonth() {
  return fetchWithSession(`${API_BASE}/dashboard/expenses-by-month/`);
}

export function fetchLatestExpenses() {
  return fetchWithSession(`${API_BASE}/dashboard/latest-expenses/`);
}

export function fetchIncomeSummary(month = "all") {
  return fetchWithSession(
    `${API_BASE}/dashboard/income-summary/?month=${month}`
  );
}

// ---- AUTH ----
export function getCSRF() {
  return fetchWithSession(`${API_BASE}/auth/csrf/`);
}

export function login(username, password) {
  return fetchWithSession(`${API_BASE}/auth/login/`, {
    method: "POST",
    body: JSON.stringify({ username, password }),
  });
}

export function logout() {
  return fetchWithSession(`${API_BASE}/auth/logout/`, {
    method: "POST",
  });
}

export function fetchMe() {
  return fetchWithSession(`${API_BASE}/auth/me/`);
}
