import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './Pages/Home';
import Blog from './Pages/Blog';
import About from './Pages/About';
import Contact from './Pages/Contact';
import NotFound from './Pages/NotFound';

function Index() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Home />} path="/" />
        <Route element={<Blog />} path="/blog" />
        <Route element={<About />} path="/sobre-mim" />
        <Route element={<Contact />} path="/contato" />
        <Route element={<NotFound />} path="*" />
      </Routes>
    </BrowserRouter>

  );
}

export default Index;
