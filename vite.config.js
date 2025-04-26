// vite.config.js
import { defineConfig } from 'vite'

export default defineConfig({
  // Configuración básica
  base: '/', // Ruta base para el despliegue
  publicDir: 'public', // Directorio de archivos públicos
  
  // Configuración del servidor de desarrollo
  server: {
    port: 3000, // Puerto de desarrollo
    open: true // Abrir navegador automáticamente
  },
  
  // Configuración del build
  build: {
    outDir: 'dist', // Directorio de salida para el build
    assetsInlineLimit: 4096, // Límite para inline de assets (en bytes)
    emptyOutDir: true, // Vaciar directorio de salida antes del build
    
    // Opciones de rollup (Vite usa Rollup internamente)
    rollupOptions: {
      input: {
        main: './index.html' // Punto de entrada principal
      }
    }
  },
  
  // Opcional: Configuración de plugins
  plugins: [
    // Puedes añadir plugins aquí si los necesitas
  ]
})