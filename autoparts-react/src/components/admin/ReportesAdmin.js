import { useState } from "react";
import { Link } from "react-router-dom";
import { Badge, Card, Col, Form, ProgressBar, Row, Table } from "react-bootstrap";
import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../EstadoConsulta";
import { productosDB, ordenesDB } from "../../services/AutoPartsService";
import { esStockCritico, formatearPrecio } from "../../utils/formato";

function GraficoBarras({ titulo, filas, maximo, unidad, vacio }) {
  return (
    <Card as="section" className="p-3 shadow-sm">
      <h2 className="h5 mb-3">{titulo}</h2>
      {filas.length === 0 && <p className="text-muted mb-0">{vacio}</p>}
      <ul className="list-unstyled mb-0">
        {filas.map(({ id, nombre, valor, nota, color }) => (
          <li className="mb-3" key={id}>
            <div className="d-flex justify-content-between gap-3">
              <span>{nombre}</span>
              <strong className="text-nowrap">{valor} {unidad}</strong>
            </div>
            <ProgressBar now={valor} max={maximo} variant={color || "primary"} aria-hidden="true" />
            {nota && <small className="text-muted">{nota}</small>}
          </li>
        ))}
      </ul>
    </Card>
  );
}

export default function ReportesAdmin() {
  const lista = useConsulta(productosDB.listar);
  const compras = useConsulta(ordenesDB.listar);
  const [ordenVentas, setOrdenVentas] = useState("mayor");
  const pendiente = [lista, compras].find((consulta) => consulta.error) ||
    [lista, compras].find((consulta) => !consulta.datos);
  if (pendiente) return <EstadoConsulta {...pendiente} />;

  const productos = lista.datos;
  const ordenes = compras.datos.filter(({ estado }) => estado === "Pagado");
  const cantidadPorProducto = new Map();
  const nombresHistoricos = new Map();
  for (const { items } of ordenes) {
    for (const item of items) {
      cantidadPorProducto.set(item.id, (cantidadPorProducto.get(item.id) || 0) + item.cantidad);
      nombresHistoricos.set(item.id, item.nombre);
    }
  }

  const catalogo = new Map(productos.map((p) => [p.id, p]));
  const ventasCatalogo = productos.map((p) => ({
    id: p.id, nombre: p.nombre, valor: cantidadPorProducto.get(p.id) || 0,
  }));
  const ventasHistoricas = Array.from(cantidadPorProducto, ([id, valor]) => ({
    id, nombre: nombresHistoricos.get(id), valor, nota: "Producto retirado del catálogo",
  })).filter(({ id }) => !catalogo.has(id));
  const ventas = [...ventasCatalogo, ...ventasHistoricas];
  const cantidadPorCategoria = new Map();
  for (const { id, valor } of ventas.filter(({ valor }) => valor > 0)) {
    const categoria = catalogo.get(id)?.categoria || "Otros";
    cantidadPorCategoria.set(categoria, (cantidadPorCategoria.get(categoria) || 0) + valor);
  }
  const categorias = Array.from(cantidadPorCategoria, ([nombre, valor]) => ({
    id: nombre, nombre, valor, color: "info",
  })).sort((a, b) => b.valor - a.valor);
  const maxCategorias = categorias[0]?.valor || 1;
  const comparar = (a, b) => (ordenVentas === "mayor" ? b.valor - a.valor : a.valor - b.valor) ||
    a.nombre.localeCompare(b.nombre, "es");
  const ordenadas = [...ventas].sort(comparar);
  const maxVentas = ventas.reduce((max, p) => Math.max(max, p.valor), 1);
  const reposicion = productos.filter(esStockCritico).map((p) => ({
    ...p, faltan: p.stockCritico - p.stock + 1,
  })).sort((a, b) => a.stock - b.stock || b.faltan - a.faltan);
  const maxReposicion = reposicion.reduce((max, p) => Math.max(max, p.faltan), 1);
  const totalVentas = ordenes.reduce((total, orden) => total + orden.total, 0);
  const unidades = Array.from(cantidadPorProducto.values()).reduce((total, valor) => total + valor, 0);
  const resumen = [
    ["Ingresos", formatearPrecio(totalVentas)],
    ["Órdenes pagadas", ordenes.length],
    ["Unidades vendidas", unidades],
    ["Productos por reponer", reposicion.length],
  ];

  return (
    <section>
      <h1 className="h3">Reportes de ventas e inventario</h1>
      <p className="text-muted">Las ventas consideran las órdenes pagadas. La reposición mínima deja el stock por encima del umbral crítico.</p>
      <Row className="g-3 mb-4">
        {resumen.map(([titulo, valor]) => (
          <Col xs={6} xl={3} key={titulo}>
            <Card className="p-3 h-100">
              <span className="text-muted small">{titulo}</span>
              <strong className="fs-4">{valor}</strong>
            </Card>
          </Col>
        ))}
      </Row>

      <Row className="g-4 mb-4">
        <Col xl={6}>
          <Form.Group className="mb-2" controlId="orden-ventas">
            <Form.Label>Orden del gráfico de ventas</Form.Label>
            <Form.Select value={ordenVentas} onChange={(e) => setOrdenVentas(e.target.value)}>
              <option value="mayor">Más vendidos</option>
              <option value="menor">Menos vendidos</option>
            </Form.Select>
          </Form.Group>
          <GraficoBarras titulo="Unidades vendidas por producto" filas={ordenadas.slice(0, 6)}
            maximo={maxVentas} unidad="un." vacio="Todavía no hay productos para comparar." />
        </Col>
        <Col xl={6}>
          <GraficoBarras titulo="Unidades mínimas para reponer" maximo={maxReposicion}
            unidad="un." vacio="Todo el inventario está por encima de su umbral crítico."
            filas={reposicion.slice(0, 6).map((p) => ({
              id: p.id, nombre: p.nombre, valor: p.faltan, color: "danger",
              nota: `Stock actual: ${p.stock} · Umbral crítico: ${p.stockCritico}`,
            }))} />
        </Col>
      </Row>

      <div className="mb-4">
        <GraficoBarras titulo="Ventas por categoría" filas={categorias} maximo={maxCategorias}
          unidad="un." vacio="Todavía no hay ventas pagadas por categoría." />
      </div>
      <h2 className="h5">Detalle de inventario y ventas</h2>
      <Table responsive hover className="align-middle">
        <thead>
          <tr><th>Producto</th><th>Vendidas</th><th>Stock</th><th>Umbral</th><th>Reposición mínima</th></tr>
        </thead>
        <tbody>
          {ordenadas.map(({ id, nombre, valor }) => {
            const producto = catalogo.get(id);
            return (
              <tr key={id}>
                <th scope="row">
                  {producto ? <Link to={`/admin/productos/${id}/detalle`}>{nombre}</Link> : nombre}
                </th>
                <td>{valor}</td><td>{producto?.stock ?? "—"}</td><td>{producto?.stockCritico ?? "—"}</td>
                <td>{producto && esStockCritico(producto) ?
                  <Badge bg="danger">{producto.stockCritico - producto.stock + 1} un.</Badge> : "—"}</td>
              </tr>
            );
          })}
        </tbody>
      </Table>
    </section>
  );
}

