import { useState, useEffect } from "react";
import { Container, Table, Badge, ProgressBar } from "react-bootstrap";
import { productosDB } from "../../data/db";

const StockCriticoAdmin = () => {
  const [productosCriticos, setProductosCriticos] = useState([]);

  useEffect(() => {
    const todos = productosDB.listar();
    // Filtra productos donde el stock sea menor o igual al stock crítico
    const criticos = todos.filter((p) => Number(p.stock) <= Number(p.stockCritico));
    setProductosCriticos(criticos);
  }, []);

  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2>Alerta de Stock Crítico</h2>
          <p className="text-muted mb-0">Productos con inventario igual o inferior al umbral crítico</p>
        </div>
        <Badge bg="danger" className="fs-6 p-2">
          {productosCriticos.length} Productos Críticos
        </Badge>
      </div>

      {productosCriticos.length === 0 ? (
        <div className="alert alert-success">
          Excelente, actualmente ningún producto se encuentra en nivel crítico de inventario.
        </div>
      ) : (
        <Table responsive hover striped className="align-middle shadow-sm bg-white rounded">
          <thead className="table-dark">
            <tr>
              <th>Código</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th className="text-center">Stock Actual</th>
              <th className="text-center">Stock Mínimo</th>
              <th>Nivel</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {productosCriticos.map((p) => {
              const porcentaje = Math.min(100, Math.round((p.stock / (p.stockCritico || 1)) * 100));
              const estaAgotado = Number(p.stock) === 0;

              return (
                <tr key={p.id}>
                  <td><code>{p.codigo}</code></td>
                  <td><strong>{p.nombre}</strong></td>
                  <td>{p.categoria}</td>
                  <td className="text-center fw-bold text-danger">{p.stock}</td>
                  <td className="text-center text-muted">{p.stockCritico}</td>
                  <td style={{ minWidth: "120px" }}>
                    <ProgressBar
                      now={porcentaje}
                      variant={estaAgotado ? "danger" : "warning"}
                      label={`${p.stock}`}
                    />
                  </td>
                  <td>
                    <Badge bg={estaAgotado ? "danger" : "warning"}>
                      {estaAgotado ? "Agotado" : "Bajo Stock"}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </Table>
      )}
    </Container>
  );
};

export default StockCriticoAdmin;