import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Global configuration for Monaco Editor workers in a Vite environment
// vite-plugin-monaco-editor handles the heavy lifting, but we ensure the environment is ready.
if (typeof window !== 'undefined') {
  (window as any).MonacoEnvironment = (window as any).MonacoEnvironment || {};
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);