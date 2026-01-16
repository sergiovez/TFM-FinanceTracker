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
      errorMessage = data.detail || errorMessage;
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

export async function updateCategory(id, data) {
  const response = await fetch(`${API_BASE}/categories/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Error al actualizar categoría');
  return response.json();
}

export async function deleteCategory(id) {
  const response = await fetch(`${API_BASE}/categories/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Error al eliminar categoría');
  return response;
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

export async function updateExpense(id, data) {
  const response = await fetch(`${API_BASE}/expenses/${id}/`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': getCSRFToken(),
    },
    body: JSON.stringify(data),
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Error al actualizar gasto');
  return response.json();
}

export async function deleteExpense(id) {
  const response = await fetch(`${API_BASE}/expenses/${id}/`, {
    method: 'DELETE',
    headers: {
      'X-CSRFToken': getCSRFToken(),
    },
    credentials: 'include',
  });
  if (!response.ok) throw new Error('Error al eliminar gasto');
  return response;
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

// ---- AUTH ----
export async function getCSRF() {
  await fetch(`${API_BASE}/auth/csrf/`, {
    credentials: "include",
  });
}

export async function login(username, password) {
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    body: JSON.stringify({ username, password }),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.detail || "Error de login");
  }
}

export async function logout() {
  await fetch(`${API_BASE}/auth/logout/`, {
    method: "POST",
    credentials: "include",
    headers: {
      "X-CSRFToken": getCSRFToken(),
    },
  });
}

export async function fetchMe() {
  const res = await fetch(`${API_BASE}/auth/me/`, {
    credentials: "include",
  });

  if (!res.ok) return null;
  return res.json();
}
