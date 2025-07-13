import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path'; // Import the 'path' module
import { fileURLToPath } from 'url'; // Import 'fileURLToPath' for ES Modules

// This provides __dirname equivalent for ES Modules, which is needed by path.resolve
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vitejs.dev/config/
export default defineConfig({
  // Explicitly define the root of your Vite project.
  // This tells Vite to look for index.html and other source files
  // in the same directory where vite.config.ts itself is located.
  root: __dirname,

  plugins: [react()],
  server: {
    proxy: {
      // Proxy requests for /socket.io to your Express backend
      // This is for local development only and doesn't affect Render deployment directly
      '/socket.io': {
        target: 'http://localhost:3001', // Your local Express server port
        ws: true, // Enable WebSocket proxying
      },
    },
  },
  // You might want to add a build section if you need custom output paths,
  // but by default, Vite builds to a 'dist' folder relative to the 'root'.
  build: {
    outDir: 'dist', // This is Vite's default, ensures output goes to a 'dist' folder at the project root
  },
});