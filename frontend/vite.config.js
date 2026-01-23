// Función principal para definir configuración de Vite
import { defineConfig } from "vite";
// Plugin oficial de React para Vite
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()], // Activa soporte completo de React
  server: {
    proxy: {
      "/api": {
        /** Cualquier fetch a http://localhost:5173/api/... se redirige internamente a: http://127.0.0.1:8000/api/... */
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: path => path.replace(/^\/api/, "/api"),
      },
    },
  },
});

