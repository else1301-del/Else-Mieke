import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPluginDefault from 'vite-plugin-monaco-editor';

// Handle potential ESM import issues with the plugin
const monacoEditorPlugin = (monacoEditorPluginDefault as any).default || monacoEditorPluginDefault;

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      // Specify the languages you want to support to reduce bundle size
      languageWorkers: ['json', 'typescript', 'html', 'css', 'editorWorkerService']
    })
  ],
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  // Ensure process.env.API_KEY is NOT defined here for client-side use
  define: {}
});