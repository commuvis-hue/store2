import React from 'react';
import { createRoot } from 'react-dom/client';
import { StoreProvider } from './store/Store';
import { RouterProvider } from './store/router';
import App from './App';
import './styles.css';

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </RouterProvider>
  </React.StrictMode>
);
