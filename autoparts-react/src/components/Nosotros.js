import { Card, Col, Container, Row } from "react-bootstrap";

const VALORES = [["Calidad certificada", "Repuestos que cumplen normas de seguridad"], ["Despacho a todo Chile", "Recíbelo directo en tu domicilio"], ["Asesoría real", "Te ayudamos a elegir la pieza correcta"], ["Garantía incluida", "Respaldo en todos los repuestos"]];
const EQUIPO = [["FA", "Francisco Ancamil"], ["FA", "Felipe Arce"], ["WT", "Williams Tapia"]];

const Nosotros = () => {
  return (
    <Container as="main" className="my-5">
      <Row as="section" className="align-items-center g-5 mb-5">
        <Col md={6}>
          <h2>Nuestra historia</h2>
          <p>AutoParts CL nació en un taller de barrio, de la frustración de no encontrar repuestos confiables sin pagar de más ni esperar semanas. Hoy convertimos esa idea en una tienda online que conecta a conductores de todo Chile con piezas certificadas, listas para despachar a la puerta de tu casa.</p>
          <p>No vendemos "cualquier repuesto": seleccionamos cada producto pensando en la seguridad de quien va a instalarlo, ya sea un mecánico profesional o alguien que recién está aprendiendo a cuidar su propio vehículo.</p>
        </Col>
        <Col md={6}><div className="nosotros-imagen-box"><img src={`${process.env.PUBLIC_URL}/img/fachada.jpg`} alt="Equipo de AutoParts CL" /></div></Col>
      </Row>
      <Row as="section" className="g-4 mb-5">
        <Col md={6}><Card className="card-mision p-4"><h3 className="h4">Misión</h3><p className="mb-0">Facilitar el mantenimiento y la reparación de vehículos, ofreciendo un catálogo amplio de repuestos con una plataforma simple, rápida y confiable.</p></Card></Col>
        <Col md={6}><Card className="card-vision p-4"><h3 className="h4">Visión</h3><p className="mb-0">Ser la tienda de repuestos online de referencia en Chile, reconocida por la calidad certificada de sus productos y por acompañar a cada cliente antes, durante y después de la compra.</p></Card></Col>
      </Row>
      <section className="mb-5">
        <h2 className="text-center mb-4">Por qué elegirnos</h2>
        <Row className="g-4">
          {VALORES.map(([t, d]) => <Col xs={6} md={3} key={t}><Card className="card-valor p-3 text-center"><h6>{t}</h6><small className="text-muted">{d}</small></Card></Col>)}
        </Row>
      </section>
      <section>
        <h2 className="text-center mb-4">Equipo de desarrollo</h2>
        <Row className="g-4 justify-content-center">
          {EQUIPO.map(([ini, nom]) => <Col xs={6} md={3} key={nom}><Card className="card-equipo p-3"><div className="avatar-equipo">{ini}</div><h6 className="mb-0">{nom}</h6><small className="text-muted">Desarrollo Fullstack</small></Card></Col>)}
        </Row>
      </section>
    </Container>
  );
};

export default Nosotros;
