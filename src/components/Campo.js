import { Form } from "react-bootstrap";

/**
 * Campo de formulario reutilizable: etiqueta + control + mensaje de error.
 * Con `as="select"` usa Form.Select y con `as="textarea"` un área de texto.
 */
const Campo = ({ id, label, error, as = "input", children, ...props }) => {
  const Control = as === "select" ? Form.Select : Form.Control;
  const extra = as === "textarea" ? { as: "textarea" } : {};
  return (
    <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Control name={id} isInvalid={!!error} {...extra} {...props}>
        {children}
      </Control>
      {error && <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>}
    </Form.Group>
  );
};

export default Campo;
