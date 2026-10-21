import { Outlet, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Productos from "./components/Productos";
import ProductoDetalle from "./components/ProductoDetalle";

import Ofertas from "./components/Ofertas";
import Carrito from "./components/Carrito";
import Checkout from "./components/Checkout";
import PagoResultado from "./components/PagoResultado";
import Login from "./components/Login";
import Registro from "./components/Registro";
import Nosotros from "./components/Nosotros";
import Blogs from "./components/Blogs";
import BlogDetalle from "./components/BlogDetalle";
import Contacto from "./components/Contacto";
import NoEncontrado from "./components/NoEncontrado";
import AdminLayout from "./components/admin/AdminLayout";
import Dashboard from "./components/admin/Dashboard";
import ProductosAdmin from "./components/admin/ProductosAdmin";
import ProductoFormPage from "./components/admin/ProductoFormPage";
import UsuariosAdmin from "./components/admin/UsuariosAdmin";
import UsuarioFormPage from "./components/admin/UsuarioFormPage";
import OrdenesAdmin from "./components/admin/OrdenesAdmin";
import StockCriticoAdmin from "./components/admin/StockCriticoAdmin";

/** Layout de la tienda pública: navbar + pantalla + footer */
const TiendaLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

// El BrowserRouter se declara en index.js (así las pruebas pueden montar App dentro de un MemoryRouter)
const App = () => {
  return (
    <Routes>
      <Route element={<TiendaLayout />}>
        <Route index element={<Home />} />
        <Route path="productos" element={<Productos />} />
        <Route path="productos/:id" element={<ProductoDetalle />} />
       
        <Route path="ofertas" element={<Ofertas />} />
        <Route path="carrito" element={<Carrito />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="pago/exito/:id" element={<PagoResultado exito />} />
        <Route path="pago/error/:id" element={<PagoResultado exito={false} />} />
        <Route path="login" element={<Login />} />
        <Route path="registro" element={<Registro />} />
        <Route path="nosotros" element={<Nosotros />} />
        <Route path="blogs" element={<Blogs />} />
        <Route path="blogs/:id" element={<BlogDetalle />} />
        <Route path="contacto" element={<Contacto />} />
      </Route>
      <Route path="admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<ProductosAdmin />} />
        <Route path="productos/nuevo" element={<ProductoFormPage />} />
        <Route path="productos/:id/editar" element={<ProductoFormPage />} />
        <Route path="criticos" element={<StockCriticoAdmin />} />
        <Route path="ordenes" element={<OrdenesAdmin />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="usuarios/nuevo" element={<UsuarioFormPage />} />
        <Route path="usuarios/:run/editar" element={<UsuarioFormPage />} />
      </Route>
      <Route path="*" element={<NoEncontrado />} />
    </Routes>
  );
};

export default App;