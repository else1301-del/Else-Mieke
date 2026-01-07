
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import monacoEditorPluginDefault from 'vite-plugin-monaco-editor';

const monacoEditorPlugin = (monacoEditorPluginDefault as any).default || monacoEditorPluginDefault;

export default defineConfig({
  plugins: [
    react(),
    monacoEditorPlugin({
      languageWorkers: ['json', 'typescript', 'editorWorkerService'],
      publicPath: 'monacoeditorwork'
    })
  ],
  define: {
    'process.env.API_KEY': JSON.stringify(process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY)
  },
  server: {
    // Proxy removed to allow direct client-side SDK calls
    proxy: {}
  }
});
