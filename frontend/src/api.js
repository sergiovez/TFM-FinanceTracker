const API_BASE = "http://localhost:8000/api";

// Función para obtener CSRF token desde la cookie
export function getCSRFToken() {
  const name = "csrftoken=";
  const cookies = document.cookie.split(";");
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) return cookie.substring(name.length);
  }
  return "";
}

// Helper centralizado para fetch con sesión y CSRF
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
    const text = await res.text();
    throw new Error(`HTTP ${res.status}: ${text}`);
  }

  const contentType = res.headers.get("content-type");
  if (contentType && contentType.includes("application/json")) {
    return res.json();
  }

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
