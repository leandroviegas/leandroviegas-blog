import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { AuthContextProvider } from './Context/AuthContext';

import Home from './Pages/Home';
import Blog from './Pages/Blog';
import About from './Pages/About';
import Contact from './Pages/Contact';

import NotFound from './Pages/NotFound';

import Dashboard from './Pages/Admin/Dashboard';
import ListCategories from './Pages/Admin/Categories/List';
import PostsForm from './Pages/Admin/Posts/Form';

import NotFoundAdmin from './Pages/Admin/NotFound';
import ListPosts from './Pages/Admin/Posts/List';

function Index() {
  return (
    <BrowserRouter>
      <HelmetProvider>
        <AuthContextProvider>
          <Routes>
            // User pages
            <Route element={<Home />} path="/" />
            <Route element={<Blog />} path="/blog" />
            <Route element={<About />} path="/sobre-mim" />
            <Route element={<Contact />} path="/contato" />
            <Route element={<NotFound />} path="*" />


            // Admin Routes
            <Route element={<Dashboard />} path="/admin" />
            <Route element={<Dashboard />} path="/admin/dashboard" />

            <Route element={<ListCategories />} path="/admin/categorias/listar" />

            <Route element={<ListPosts />} path="/admin/postagens/listar" />
            <Route element={<PostsForm />} path="/admin/postagens/nova-postagem" />
            <Route element={<PostsForm />} path="/admin/postagens/:link/editar" />
            
            <Route element={<NotFoundAdmin />} path="/admin/*" />

          </Routes>
        </AuthContextProvider>
      </HelmetProvider >
    </BrowserRouter>

  );
}

export default Index;
