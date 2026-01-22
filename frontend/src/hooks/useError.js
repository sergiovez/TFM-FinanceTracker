import { useState, useCallback } from "react";

export function useError() {
  const [error, setError] = useState(null);

  // Muestra un error por 3 segundos
  const showError = useCallback((err) => {
    const message = err?.message || err?.toString() || "Error desconocido";
    setError(message);
    setTimeout(() => setError(null), 3000);
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return { error, showError, clearError };
}
