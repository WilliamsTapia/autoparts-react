import { Link } from "react-router-dom";
import { Card, Col, Container, Row } from "react-bootstrap";
import { BLOGS } from "../data/blogs";

const Blogs = () => {
  return (
    <Container as="main" className="my-5">
      <h1 className="h2 mb-4">Blog</h1>
      <Row className="g-4">
        {BLOGS.map((b) => (
          <Col md={6} key={b.id}>
            <Card className="card-blog h-100">
              <Card.Img variant="top" src={b.imagen} alt={b.titulo} />
              <Card.Body className="d-flex flex-column">
                <Card.Title as="h5">{b.titulo}</Card.Title>
                <Card.Text>{b.resumen}</Card.Text>
                <Link to={`/blogs/${b.id}`} className="btn btn-outline-dark mt-auto align-self-start">Leer más</Link>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default Blogs;
