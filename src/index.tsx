import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';

import './css/tailwind.css';
import './css/index.css';
import "aos/dist/aos.css";

import AOS from "aos";
AOS.init()

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Routes />
  </React.StrictMode>
);