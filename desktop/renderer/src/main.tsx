import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

// Verificar que electronAPI esté disponible antes de renderizar
const checkElectronAPI = (): Promise<void> => {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.electronAPI) {
      console.log('✅ electronAPI disponible');
      resolve();
      return;
    }
    
    // Esperar hasta que electronAPI esté disponible (máximo 5 segundos)
    let attempts = 0;
    const maxAttempts = 50; // 50 intentos * 100ms = 5 segundos
    
    const checkInterval = setInterval(() => {
      attempts++;
      if (typeof window !== 'undefined' && window.electronAPI) {
        console.log('✅ electronAPI disponible después de esperar');
        clearInterval(checkInterval);
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('❌ electronAPI no disponible después de 5 segundos');
        console.error('Verifica que preload.js esté cargado correctamente');
        clearInterval(checkInterval);
        resolve(); // Continuar de todas formas para mostrar error en UI
      }
    }, 100);
  });
};

// Esperar a que electronAPI esté disponible antes de renderizar
checkElectronAPI().then(() => {
  ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>,
  );
});

