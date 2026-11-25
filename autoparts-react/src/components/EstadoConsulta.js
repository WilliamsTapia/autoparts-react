export default function EstadoConsulta({ error, cargando }) {
  if (error) return <p className="alert alert-warning" role="alert">{error}</p>;
  if (cargando) return <p className="text-muted" role="status">Cargando datos…</p>;
  return null;
}
