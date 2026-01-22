// Hook simple para emitir y escuchar eventos entre componentes
const listeners = {};

export function useDashboardEvents() {
  const emit = (event) => {
    (listeners[event] || []).forEach(fn => fn());
  };

  const on = (event, fn) => {
    listeners[event] = listeners[event] || [];
    listeners[event].push(fn);
    return () => {
      listeners[event] = listeners[event].filter(f => f !== fn);
    };
  };

  return { emit, on };
}
