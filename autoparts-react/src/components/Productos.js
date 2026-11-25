import useConsulta from "../hooks/useConsulta";
import EstadoConsulta from "../components/EstadoConsulta";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Container } from "react-bootstrap";
import FiltrosProductos from "./FiltrosProductos";
import ListaProductos from "./ListaProductos";
import { obtenerCategorias, productosDB } from "../services/AutoPartsService";
import { filtrarProductos } from "../utils/filtros";
import { useCarrito } from "../context/CarritoContext";

const Productos = () => {
  const { agregar } = useCarrito();
  const [params] = useSearchParams();
  const lista = useConsulta(productosDB.listar);
  const categorias = useConsulta(obtenerCategorias);
  const [filtros, setFiltros] = useState({ texto: "", categoria: params.get("categoria") ?? "", orden: "" });

  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">Catálogo de productos</h1>
      <EstadoConsulta {...lista} />
      <EstadoConsulta {...categorias} />
      <FiltrosProductos categorias={categorias.datos || []} valores={filtros} onChange={setFiltros} />
      <ListaProductos productos={filtrarProductos(lista.datos || [], filtros)} onAgregar={agregar} mensajeVacio="No se encontraron productos con esos filtros." />
    </Container>
  );
};

export default Productos;
