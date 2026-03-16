import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import "./style/themes.css";//1
import "./style/global.css";//2
import "./style/layout.css";//3
import "./style/tables.css";//4
import "./style/form.css";//5
import "./style/components.css";//6

import { loadTheme } from "./utils/theme";

loadTheme();
createRoot(document.getElementById('root')).render(
  
  <React.StrictMode>
    <AuthProvider>
        <App />
    </AuthProvider>
  </React.StrictMode>
);
