import { useState } from "react";
import { Form, Row, Col, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import RegionComuna from "./RegionComuna";
import useFormulario from "../hooks/useFormulario";
import { validarUsuario } from "../utils/validaciones";

const VACIO = { run: "", nombre: "", apellidos: "", correo: "", fechaNacimiento: "", tipoUsuario: "Cliente", region: "", comuna: "", direccion: "", contrasena: "" };

/**
 * Formulario de usuario reutilizado en el registro público (modo "registro")
 * y en el panel admin (modo "admin", que agrega el tipo de usuario).
 */
const FormUsuario = ({ inicial, modo = "registro", editando = false, onGuardar, textoBoton = "Guardar" }) => {
  const { valores, errores, poner, cambiar, validarTodo } = useFormulario(
    { ...VACIO, ...inicial },
    validarUsuario
  );
  const [aviso, setAviso] = useState(null);


  const [enviando, setEnviando] = useState(false);
  const enviar = async (e) => {
    e.preventDefault();
    const errs = validarTodo();
    if (Object.keys(errs).length > 0) {
      setAviso({ ok: false, mensaje: "Revisa los campos marcados en rojo." });
      return;
    }
    if ((!editando || valores.contrasena) && (valores.contrasena.length < 8 || new Blob([valores.contrasena]).size > 72)) {
      setAviso({ ok: false, mensaje: "La contraseña requiere al menos 8 caracteres y como máximo 72 bytes." });
      return;
    }
    setEnviando(true);
    try {
      const resultado = await onGuardar({ ...valores, run: valores.run.trim().toUpperCase(), nombre: valores.nombre.trim(), apellidos: valores.apellidos.trim(), correo: valores.correo.trim(), direccion: valores.direccion.trim() });
      setAviso(resultado ?? null);
    } catch (error) {
      setAviso({ ok: false, mensaje: error.message });
    } finally {
      setEnviando(false);
    }
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
        <Col md={6}><Campo id="contrasena" label={editando ? "Nueva contraseña (opcional)" : "Contraseña"} type="password" autoComplete="new-password" value={valores.contrasena} onChange={cambiar} /></Col>
        <RegionComuna region={valores.region} comuna={valores.comuna} onChange={poner} />
        <Col xs={12}><Campo id="direccion" label="Dirección" value={valores.direccion} onChange={cambiar} error={errores.direccion} maxLength={300} /></Col>
      </Row>
      <Button type="submit" variant="autoparts" disabled={enviando}>{textoBoton}</Button>
    </Form>
  );
};

export default FormUsuario;
