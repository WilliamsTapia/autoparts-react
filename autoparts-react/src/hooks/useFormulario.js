import { useState } from "react";

export default function useFormulario(inicial, validar) {
  const [estado, setEstado] = useState(() => ({
    valores: inicial,
    tocados: {},
    enviado: false,
  }));

  const { valores, tocados, enviado } = estado;
  const actuales = validar(valores);

  const errores = Object.fromEntries(
    Object.entries(actuales).filter(
      ([campo]) => enviado || tocados[campo]
    )
  );

  const poner = (campo, valor) => {
    setEstado((anterior) => ({
      ...anterior,
      valores: { ...anterior.valores, [campo]: valor },
      tocados: { ...anterior.tocados, [campo]: true },
    }));
  };

  const cambiar = (evento) => {
    poner(evento.target.name, evento.target.value);
  };

  const validarTodo = () => {
    setEstado((anterior) => ({ ...anterior, enviado: true }));
    return actuales;
  };

  const reiniciar = () => {
    setEstado({
      valores: inicial,
      tocados: {},
      enviado: false,
    });
  };

  return {
    valores,
    errores,
    poner,
    cambiar,
    validarTodo,
    reiniciar,
  };
}