import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import { validarContacto } from "../utils/validaciones";

const VACIO = { nombre: "", correo: "", comentario: "" };

const FormContacto = () => {
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  const cambiar = (e) => { setEnviado(false); setValores({ ...valores, [e.target.name]: e.target.value }); };

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarContacto(valores);
    setErrores(errs);
    if (Object.keys(errs).length === 0) { setEnviado(true); setValores(VACIO); }
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <Alerta tipo="success" mensaje={enviado ? "¡Gracias! Tu mensaje fue enviado, te contactaremos pronto." : ""} />
      <Alerta tipo="warning" mensaje={Object.keys(errores).length ? "Revisa los campos marcados en rojo antes de enviar." : ""} />
      <Campo id="nombre" label="Nombre" value={valores.nombre} onChange={cambiar} error={errores.nombre} maxLength={100} />
      <Campo id="correo" label="Correo electrónico (opcional)" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} />
      <Campo id="comentario" label="Comentario" as="textarea" rows="4" value={valores.comentario} onChange={cambiar} error={errores.comentario} maxLength={500} />
      <Button type="submit" variant="autoparts" className="w-100">Enviar mensaje</Button>
    </Form>
  );
};

export default FormContacto;
