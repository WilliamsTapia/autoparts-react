import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import RegionComuna from "./RegionComuna";
import { validarUsuario } from "../utils/validaciones";

const VACIO = { run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "", tipoUsuario: "Cliente", region: "", comuna: "", direccion: "" };

/**
 * Formulario de usuario reutilizado en el registro público (modo "registro")
 * y en el panel admin (modo "admin", que agrega el tipo de usuario).
 */
const FormUsuario = ({ inicial, modo = "registro", editando = false, onGuardar, textoBoton = "Guardar" }) => {
  const [valores, setValores] = useState({ ...VACIO, ...inicial });
  const [errores, setErrores] = useState({});
  const [aviso, setAviso] = useState(null);

  const poner = (campo, valor) => setValores((v) => ({ ...v, [campo]: valor }));
  const cambiar = (e) => poner(e.target.name, e.target.value);

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarUsuario(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) {
      setAviso({ ok: false, mensaje: "Revisa los campos marcados en rojo." });
      return;
    }
    const resultado = onGuardar({ ...valores, run: valores.run.trim().toUpperCase(), nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim(), direccion: valores.direccion.trim() });
    setAviso(resultado ?? null);
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <Alerta tipo={aviso?.ok ? "success" : "warning"} mensaje={aviso?.mensaje} />
      <Row>
        <Col md={6}><Campo id="run" label="RUN (sin puntos ni guion)" value={valores.run} onChange={cambiar} error={errores.run} maxLength={9} placeholder="Ej: 19011022K" readOnly={editando} /></Col>
        {modo === "admin" && (
          <Col md={6}>
            <Campo id="tipoUsuario" label="Tipo de usuario" as="select" value={valores.tipoUsuario} onChange={cambiar}>
              <option>Administrador</option><option>Vendedor</option><option>Cliente</option>
            </Campo>
          </Col>
        )}
        <Col md={6}><Campo id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} maxLength={50} /></Col>
        <Col md={6}><Campo id="apellidos" label="Apellidos" value={valores.apellidos} onChange={cambiar} error={errores.apellidos} maxLength={100} /></Col>
        <Col md={6}><Campo id="correo" label="Correo electrónico" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} placeholder="tucorreo@duoc.cl / @gmail.com" /></Col>
        <Col md={6}><Campo id="fechaNacimiento" label="Fecha de nacimiento (opcional)" type="date" value={valores.fechaNacimiento} onChange={cambiar} /></Col>
        <RegionComuna region={valores.region} comuna={valores.comuna} onChange={poner} />
        <Col xs={12}><Campo id="direccion" label="Dirección" value={valores.direccion} onChange={cambiar} error={errores.direccion} maxLength={300} /></Col>
      </Row>
      <Button type="submit" variant="autoparts">{textoBoton}</Button>
    </Form>
  );
};

export default FormUsuario;
