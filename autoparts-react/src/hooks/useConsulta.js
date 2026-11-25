import { useEffect, useState } from "react";

export default function useConsulta(consultar, id) {
  const [resultado, setResultado] = useState({ consultar, id, datos: null, error: "" });
  const [revision, setRevision] = useState(0);

  useEffect(() => {
    let activa = true;
    if (id !== null) {
      consultar(id)
        .then((datos) => { if (activa) setResultado({ consultar, id, datos, error: "" }); })
        .catch((error) => { if (activa) setResultado({ consultar, id, datos: null, error: error.message }); });
    }
    return () => { activa = false; };
  }, [consultar, id, revision]);

  const vigente = resultado.id === id && resultado.consultar === consultar;
  const datos = vigente ? resultado.datos : null;
  const error = vigente ? resultado.error : "";
  return { datos, error, cargando: id !== null && !datos && !error, recargar: () => setRevision((n) => n + 1) };
}
