import { Link, useParams } from "react-router-dom";
import { Alert, Container } from "react-bootstrap";
import { BLOGS } from "../data/blogs";

const BlogDetalle = () => {
  const { id } = useParams();
  const b = BLOGS.find((x) => String(x.id) === id);
  if (!b) return <Container as="main" className="my-5"><Alert variant="warning">Artículo no encontrado.</Alert><Link to="/blogs">Volver al blog</Link></Container>;

  return (
    <Container as="main" className="my-5" style={{ maxWidth: 800 }}>
      <Link to="/blogs" className="btn btn-outline-dark btn-sm mb-4">&larr; Volver al blog</Link>
      <article>
        <img src={b.imagen} alt={b.titulo} className="img-fluid rounded mb-4" style={{ width: "100%", height: 350, objectFit: "cover" }} />
        <h1 className="h2">{b.titulo}</h1>
        <p className="text-muted">Publicado por AutoParts CL</p>
        {b.bloques.map((bl, i) => {
          if (bl.tipo === "p") return <p key={i}>{bl.destacado && <strong>{bl.destacado} </strong>}{bl.texto}</p>;
          if (bl.tipo === "ol") return <ol key={i}>{bl.items.map(([t, d]) => <li key={t}><strong>{t}</strong> {d}</li>)}</ol>;
          return <ul key={i}>{bl.items.map((t) => <li key={t}>{t}</li>)}</ul>;
        })}
        <Link to={b.cta.ruta} className="btn btn-autoparts">{b.cta.texto}</Link>
      </article>
    </Container>
  );
};

export default BlogDetalle;
