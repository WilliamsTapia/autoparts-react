import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { ordenesDB, productosDB, usuariosDB } from "../../data/db";
import { esStockCritico } from "../../utils/formato";

const Dashboard = () => {
  const productos = productosDB.listar();
  const tarjetas = [
    ["Productos", productos.length, "primary", "/admin/productos"],
    ["Stock crítico", productos.filter(esStockCritico).length, "warning", "/admin/criticos"],
    ["Usuarios", usuariosDB.listar().length, "success", "/admin/usuarios"],
    ["Órdenes", ordenesDB.listar().length, "dark", "/admin/ordenes"],
  ];
  return (
    <>
      <h1 className="h3 mb-4">Bienvenido/a al panel de administración</h1>
      <Row className="g-4">
        {tarjetas.map(([t, n, color, ruta]) => (
          <Col xs={6} lg={3} key={t}>
            <Card className={`text-bg-${color} p-3 h-100`}>
              <div className="small">{t}</div>
              <div className="display-6">{n}</div>
              {ruta && <Link to={ruta} className="stretched-link small text-reset">Ver detalle</Link>}
            </Card>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default Dashboard;