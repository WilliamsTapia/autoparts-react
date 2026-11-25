import { Col } from "react-bootstrap";
import Campo from "./Campo";
import { REGIONES } from "../data/regiones";

/** Par de selects dependientes: al cambiar la región se reinicia la comuna */
const RegionComuna = ({ region, comuna, errores = {}, onChange }) => {
  const comunas = REGIONES.find((r) => r.region === region)?.comunas ?? [];
  return (
    <>
      <Col md={6}>
        <Campo id="region" label="Región" as="select" value={region} error={errores.region}
          onChange={(e) => { onChange("region", e.target.value); onChange("comuna", ""); }}>
          <option value="">Seleccione región</option>
          {REGIONES.map((r) => <option key={r.region} value={r.region}>{r.region}</option>)}
        </Campo>
      </Col>
      <Col md={6}>
        <Campo id="comuna" label="Comuna" as="select" value={comuna} error={errores.comuna}
          onChange={(e) => onChange("comuna", e.target.value)}>
          <option value="">{region ? "Seleccione comuna" : "Seleccione región primero"}</option>
          {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
        </Campo>
      </Col>
    </>
  );
};

export default RegionComuna;
