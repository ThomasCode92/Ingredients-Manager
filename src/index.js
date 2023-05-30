import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import './index.css';

import { worker } from './mocks/browser';
import AuthContextProvider from './context/auth.context';

worker.start();

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
