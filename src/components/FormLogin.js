import { useState } from "react";
import { Form, Button } from "react-bootstrap";
import Campo from "./Campo";
import Alerta from "./Alerta";
import { validarLogin } from "../utils/validaciones";

/** onIngresar(datos) devuelve { ok, mensaje } y lo decide el padre */
const FormLogin = ({ onIngresar }) => {
  const [valores, setValores] = useState({ correo: "", contrasena: "" });
  const [errores, setErrores] = useState({});
  const [resultado, setResultado] = useState(null);

  const cambiar = (e) => setValores({ ...valores, [e.target.name]: e.target.value });

  const enviar = (e) => {
    e.preventDefault();
    const errs = validarLogin(valores);
    setErrores(errs);
    if (Object.keys(errs).length > 0) {
      setResultado({ ok: false, mensaje: "Revisa los campos marcados: correo válido y contraseña de 4 a 10 caracteres." });
      return;
    }
    setResultado(onIngresar(valores));
  };

  return (
    <Form onSubmit={enviar} noValidate>
      <Alerta tipo={resultado?.ok ? "success" : "warning"} mensaje={resultado?.mensaje} />
      <Campo id="correo" label="Correo electrónico" type="email" value={valores.correo} onChange={cambiar} error={errores.correo} placeholder="tucorreo@duoc.cl" />
      <Campo id="contrasena" label="Contraseña" type="password" value={valores.contrasena} onChange={cambiar} error={errores.contrasena} />
      <Button type="submit" variant="autoparts" className="w-100">Ingresar</Button>
    </Form>
  );
};

export default FormLogin;
