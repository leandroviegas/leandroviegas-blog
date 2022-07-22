import React from 'react';
import ReactDOM from 'react-dom/client';
import Routes from './routes';

import './index.css';
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