
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Setup Monaco Environment for worker loading
if (typeof window !== 'undefined') {
  (window as any).MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: any, label: string) {
      if (label === 'json') {
        return './monacoeditorwork/json.worker.bundle.js';
      }
      if (label === 'typescript' || label === 'javascript') {
        return './monacoeditorwork/ts.worker.bundle.js';
      }
      return './monacoeditorwork/editor.worker.bundle.js';
    }
  };
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
