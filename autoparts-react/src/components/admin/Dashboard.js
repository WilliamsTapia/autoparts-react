import useConsulta from "../../hooks/useConsulta";
import EstadoConsulta from "../../components/EstadoConsulta";
import { Link } from "react-router-dom";
import { Card, Col, Row } from "react-bootstrap";
import { ordenesDB, productosDB, usuariosDB } from "../../services/AutoPartsService";
import { esStockCritico } from "../../utils/formato";

const Dashboard = () => {
  const lista = useConsulta(productosDB.listar);
  const usuarios = useConsulta(usuariosDB.listar);
  const ordenes = useConsulta(ordenesDB.listar);
  const pendiente = [lista, usuarios, ordenes].find((consulta) => !consulta.datos);
  if (pendiente) return <EstadoConsulta {...pendiente} />;
  const productos = lista.datos;
  const tarjetas = [
    ["Productos", productos.length, "primary", "/admin/productos"],
    ["Stock crítico", productos.filter(esStockCritico).length, "warning", "/admin/criticos"],
    ["Usuarios", usuarios.datos.length, "success", "/admin/usuarios"],
    ["Órdenes", ordenes.datos.length, "dark", "/admin/ordenes"],
  ];
  return (
    <>
      <h1 className="h3 mb-3">Bienvenido/a al panel de administración</h1>
      <Link to="/admin/reportes" className="btn btn-outline-dark mb-4">Ver reportes de ventas e inventario</Link>
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
