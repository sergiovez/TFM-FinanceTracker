// URL base del backend tomada desde variables de entorno de Vite
const API_BASE = import.meta.env.VITE_API_URL; 

// Obtiene el token CSRF de las cookies del navegador
export function getCSRFToken() {
  const name = "csrftoken="; // Nombre de la cookie CSRF
  const cookies = document.cookie.split(";"); // Separamos todas las cookies
  // Recorremos las cookies buscando la que empieza por "csrftoken="
  for (let cookie of cookies) {
    cookie = cookie.trim();
    if (cookie.startsWith(name)) return cookie.substring(name.length);
  }
  // Si no se encuentra, devolvemos string vacío
  return "";
}

// Fetch genérico que añade CSRF y maneja errores
// - Incluye cookies de sesión 
// - Añade CSRF automáticamente
// - Centraliza manejo de errores
async function fetchWithSession(url, options = {}) {
  // Configuración base del fetch
  const opts = {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  // Si el método modifica datos, añadimos el token CSRF
  if (["POST", "PUT", "PATCH", "DELETE"].includes(opts.method?.toUpperCase())) {
    opts.headers["X-CSRFToken"] = getCSRFToken();
  }

  // Ejecutamos la petición HTTP
  const res = await fetch(url, opts);

  // Manejo de errores de manera centralizada
  if (!res.ok) {
    let errorMessage = `HTTP ${res.status}`;

    let data;
    try {
      const clone = res.clone();

      const contentType = clone.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        data = await clone.json();
      } else {
        data = await clone.text();
      }
    } catch {
      data = null;
    }

    if (data) {
      if (typeof data === "string" && data.trim()) {
        errorMessage = data;
      } else if (data.detail) {
        errorMessage = data.detail;
      } else if (typeof data === "object") {
        const firstKey = Object.keys(data)[0];
        if (Array.isArray(data[firstKey])) errorMessage = data[firstKey][0];
        else errorMessage = data[firstKey];
      }
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

// --- Endpoints de categorías ---
export function fetchCategories() {return fetchWithSession(`${API_BASE}/categories/`);}
export function createCategory(categoryData) {return fetchWithSession(`${API_BASE}/categories/`, {method: "POST",body: JSON.stringify(categoryData),});}
export function updateCategory(id, data) {return fetchWithSession(`${API_BASE}/categories/${id}/`, {method: 'PUT',body: JSON.stringify(data),});}
export function deleteCategory(id) {return fetchWithSession(`${API_BASE}/categories/${id}/`, {method: 'DELETE',});}

// --- Endpoints de gastos ---
export function fetchExpenses() {return fetchWithSession(`${API_BASE}/expenses/`);}
export function createExpense(expenseData) {return fetchWithSession(`${API_BASE}/expenses/`, {method: "POST",body: JSON.stringify(expenseData),});}
export function updateExpense(id, data) {return fetchWithSession(`${API_BASE}/expenses/${id}/`, {method: 'PUT',body: JSON.stringify(data),});}
export function deleteExpense(id) {return fetchWithSession(`${API_BASE}/expenses/${id}/`, {method: 'DELETE',});}

// --- Dashboard ---
export function fetchExpensesByCategory() {return fetchWithSession(`${API_BASE}/dashboard/expenses-by-category/`);}
export function fetchExpensesByMonth() {return fetchWithSession(`${API_BASE}/dashboard/expenses-by-month/`);}
export function fetchLatestExpenses() {return fetchWithSession(`${API_BASE}/dashboard/latest-expenses/`);}
export function fetchIncomeSummary(month = "all") {return fetchWithSession(`${API_BASE}/dashboard/income-summary/?month=${month}`);}

// --- Auth ---
export function getCSRF() {return fetchWithSession(`${API_BASE}/auth/csrf/`);}
export function login(username, password) {return fetchWithSession(`${API_BASE}/auth/login/`, {method: "POST",body: JSON.stringify({ username, password }),});}
export function logout() {return fetchWithSession(`${API_BASE}/auth/logout/`, {method: "POST",});}
export function fetchMe() {return fetchWithSession(`${API_BASE}/auth/me/`);}
