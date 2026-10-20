import { Link } from "react-router-dom";
import { Container } from "react-bootstrap";
import ListaProductos from "./ListaProductos";
import { productosDB } from "../data/db";
import { useCarrito } from "../context/CarritoContext";

const Home = () => {
  const { agregar } = useCarrito();
  const destacados = productosDB.listar().slice(0, 4);
  return (
    <>
      <header className="hero-tienda text-center">
        <Container>
          <h1>AutoParts CL</h1>
          <p className="lead">Repuestos originales y alternativos para tu vehículo, al mejor precio.</p>
          <Link to="/productos" className="btn btn-light btn-lg mt-2 me-2">Ver productos</Link>
          <Link to="/ofertas" className="btn btn-warning btn-lg mt-2">Ver ofertas</Link>
        </Container>
      </header>
      <Container as="main" className="my-5">
        <section className="mb-5">
          <h2>Sobre nuestra tienda</h2>
          <p>En <strong>AutoParts CL</strong> vendemos repuestos de automóviles para todo tipo de vehículos: frenos, filtros, baterías, suspensión, iluminación, aceites y neumáticos. Trabajamos con marcas certificadas y despacho a todo Chile, para que tu auto vuelva a rodar sin complicaciones.</p>
        </section>
        <section>
          <h2 className="mb-4">Productos destacados</h2>
          <ListaProductos productos={destacados} onAgregar={agregar} />
        </section>
      </Container>
    </>
  );
};

export default Home;
