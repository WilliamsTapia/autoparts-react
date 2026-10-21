import { useState, useEffect } from "react";
import { Container, Row, Col, Card, Table, Badge, ProgressBar } from "react-bootstrap";
import { productosDB, ordenesDB, usuariosDB } from "../../data/db";

const ReportesAdmin = () => {
  const [metricas, setMetricas] = useState({
    totalVentas: 0,
    cantidadOrdenes: 0,
    totalProductos: 0,
    totalUsuarios: 0,
    criticos: 0,
    ventasPorCategoria: {},
    topProductos: [],
  });

  useEffect(() => {
    const ordenes = ordenesDB.listar();
    const productos = productosDB.listar();
    const usuarios = usuariosDB.listar();

    const totalVentas = ordenes.reduce((acc, o) => acc + (Number(o.total) || 0), 0);
    const criticos = productos.filter((p) => Number(p.stock) <= Number(p.stockCritico)).length;

    // Ventas acumuladas por categoría
    const catMap = {};
    const prodMap = {};

    ordenes.forEach((o) => {
      (o.items || []).forEach((item) => {
        // Conteo por producto
        prodMap[item.nombre] = (prodMap[item.nombre] || 0) + item.cantidad;
        // Conteo por categoría
        const prodOriginal = productos.find((p) => p.id === item.id);
        const cat = prodOriginal?.categoria || "Otros";
        catMap[cat] = (catMap[cat] || 0) + item.cantidad;
      });
    });

    const topProductos = Object.entries(prodMap)
      .map(([nombre, cantidad]) => ({ nombre, cantidad }))
      .sort((a, b) => b.cantidad - a.cantidad)
      .slice(0, 5);

    setMetricas({
      totalVentas,
      cantidadOrdenes: ordenes.length,
      totalProductos: productos.length,
      totalUsuarios: usuarios.length,
      criticos,
      ventasPorCategoria: catMap,
      topProductos,
    });
  }, []);

  return (
    <Container fluid className="p-3">
      <div className="mb-4">
        <h2>Reportes y Estadísticas del Sistema</h2>
        <p className="text-muted">Resumen ejecutivo del inventario y rendimiento de ventas</p>
      </div>

      <Row className="g-3 mb-4">
        <Col md={3}>
          <Card className="text-white bg-primary p-3 shadow-sm border-0">
            <h6>Ingresos Totales</h6>
            <h3 className="mb-0">${metricas.totalVentas.toLocaleString("es-CL")}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-success p-3 shadow-sm border-0">
            <h6>Órdenes Realizadas</h6>
            <h3 className="mb-0">{metricas.cantidadOrdenes}</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-dark p-3 shadow-sm border-0">
            <h6>Catálogo Activo</h6>
            <h3 className="mb-0">{metricas.totalProductos} ítems</h3>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-white bg-danger p-3 shadow-sm border-0">
            <h6>Alertas Críticas</h6>
            <h3 className="mb-0">{metricas.criticos} productos</h3>
          </Card>
        </Col>
      </Row>

      <Row className="g-4">
        <Col md={6}>
          <Card className="p-3 shadow-sm border-0 h-100">
            <h5>Productos Más Vendidos</h5>
            {metricas.topProductos.length === 0 ? (
              <p className="text-muted mt-3">Sin datos de compras aún.</p>
            ) : (
              <Table responsive hover className="mt-2 align-middle">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th className="text-end">Unidades Vendidas</th>
                  </tr>
                </thead>
                <tbody>
                  {metricas.topProductos.map((p, idx) => (
                    <tr key={idx}>
                      <td>{p.nombre}</td>
                      <td className="text-end"><Badge bg="primary">{p.cantidad}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3 shadow-sm border-0 h-100">
            <h5>Distribución por Categorías</h5>
            {Object.keys(metricas.ventasPorCategoria).length === 0 ? (
              <p className="text-muted mt-3">Sin registros de ventas por categoría.</p>
            ) : (
              <div className="mt-3">
                {Object.entries(metricas.ventasPorCategoria).map(([cat, cant], idx) => (
                  <div key={idx} className="mb-3">
                    <div className="d-flex justify-content-between mb-1">
                      <span>{cat}</span>
                      <small className="fw-bold">{cant} un.</small>
                    </div>
                    <ProgressBar now={cant * 10} variant="info" />
                  </div>
                ))}
              </div>
            )}
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ReportesAdmin;