import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import { validarProducto } from "../utils/validaciones";

const VACIO = { codigo: "", nombre: "", descripcion: "", precio: "", stock: "", stockCritico: "", descuento: "0", categoria: "", imagen: "" };

/** Formulario de producto del admin (sirve para crear y para editar) */
const FormProducto = ({ inicial, categorias, onGuardar }) => {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarProducto(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) { setAviso({ ok: false, mensaje: "Revisa los campos marcados en rojo." }); return; }
    setAviso(onGuardar({
      codigo: valores.codigo.trim(), nombre: valores.nombre.trim(), descripcion: valores.descripcion.trim(),
      precio: Number(valores.precio), stock: Number(valores.stock),
      stockCritico: valores.stockCritico !== "" ? Number(valores.stockCritico) : null,
      descuento: Number(valores.descuento) || 0, categoria: valores.categoria,
      imagen: valores.imagen.trim() || "https://placehold.co/400x300/1c1c1c/f0a500?text=Producto",
    }) ?? null);
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <Alerta tipo={aviso?.ok ? "success" : "warning"} mensaje={aviso?.mensaje} />
      <Row>
        <Col md={4}><Campo id="codigo" label="Código" value={valores.codigo} onChange={cambiar} error={errores.codigo} /></Col>
        <Col md={8}><Campo id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} maxLength={100} /></Col>
        <Col xs={12}><Campo id="descripcion" label="Descripción" as="textarea" rows="3" value={valores.descripcion} onChange={cambiar} error={errores.descripcion} /></Col>
        <Col xs={6} md={3}><Campo id="precio" label="Precio" type="number" min="0" value={valores.precio} onChange={cambiar} error={errores.precio} /></Col>
        <Col xs={6} md={3}><Campo id="descuento" label="Descuento (%)" type="number" min="0" max="90" value={valores.descuento} onChange={cambiar} error={errores.descuento} /></Col>
        <Col xs={6} md={3}><Campo id="stock" label="Stock" type="number" min="0" value={valores.stock} onChange={cambiar} error={errores.stock} /></Col>
        <Col xs={6} md={3}><Campo id="stockCritico" label="Stock crítico" type="number" min="0" value={valores.stockCritico} onChange={cambiar} error={errores.stockCritico} /></Col>
        <Col md={6}>
          <Campo id="categoria" label="Categoría" as="select" value={valores.categoria} onChange={cambiar} error={errores.categoria}>
            <option value="">Seleccione categoría</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </Campo>
        </Col>
        <Col md={6}><Campo id="imagen" label="URL de imagen (opcional)" value={valores.imagen} onChange={cambiar} /></Col>
      </Row>
      <Button type="submit" variant="autoparts">Guardar</Button>
    </Form>
  );
};

export default FormProducto;
