package com.example.demo;

import com.example.demo.dto.AuthResponse;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.MediaType;
import org.springframework.web.client.RestClient;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Matriz de permisos por rol sobre la API REST (JWT + Spring Security).
 * Roles: ADMIN (todo), VENDEDOR (solo consulta productos y órdenes) y CLIENTE (tienda).
 */
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:seguridad",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "app.jwt.secret=YXV0b3BhcnRzLXRlc3Qtb25seS1zaWduaW5nLWtleS0wMTIzNDU2Nzg5",
    "app.admin.username=admin@duoc.cl",
    "app.admin.password=ClavePrueba1"
})
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
class SeguridadRolesTests {
    private static final String CLAVE = "ClavePrueba1";

    @JsonIgnoreProperties(ignoreUnknown = true)
    record Producto(long id, int stock) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Detalle(long id, String nombre, int precio, int cantidad) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Boleta(long id, String estado, long total, java.util.List<Detalle> items) {}

    @LocalServerPort int port;

    RestClient api;
    String admin;
    String vendedor;
    String cliente;
    long productoId;
    long boletaId;

    @BeforeAll
    void prepararUsuariosYUnaBoleta() {
        api = RestClient.builder().baseUrl("http://localhost:" + port + "/api/v1")
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {}).build();
        admin = entrar("admin@duoc.cl");
        assertEquals(201, enviar(HttpMethod.POST, "/usuarios", admin, perfil("123456785", "vendedor@duoc.cl", "Vendedor")));
        assertEquals(201, enviar(HttpMethod.POST, "/auth/register", null, perfil("111111111", "cliente@duoc.cl", "Cliente")));
        vendedor = entrar("vendedor@duoc.cl");
        cliente = entrar("cliente@duoc.cl");

        productoId = api.get().uri("/productos").retrieve().body(Producto[].class)[0].id();
        var boleta = api.post().uri("/ordenes").header("Authorization", "Bearer " + cliente)
                .contentType(MediaType.APPLICATION_JSON).body(compra(productoId, "true"))
                .retrieve().body(Boleta.class);
        assertNotNull(boleta);
        boletaId = boleta.id();
    }

    @Test
    void sinTokenSoloSePuedeConsultarLaTienda() {
        assertEquals(200, enviar(HttpMethod.GET, "/productos", null, null));
        assertEquals(200, enviar(HttpMethod.GET, "/productos/" + productoId, null, null));
        assertEquals(200, enviar(HttpMethod.GET, "/categorias", null, null));

        for (String ruta : new String[] {"/ordenes", "/ordenes/mias", "/ordenes/" + boletaId, "/usuarios", "/auth/me", "/categorias/1"}) {
            assertEquals(401, enviar(HttpMethod.GET, ruta, null, null), "GET " + ruta);
        }
        assertEquals(401, enviar(HttpMethod.POST, "/productos", null, "{}"));
        assertEquals(401, enviar(HttpMethod.POST, "/ordenes", null, compra(productoId, "true")));
    }

    @Test
    void swaggerYElDocumentoOpenApiSonPublicos() {
        var raiz = RestClient.builder().baseUrl("http://localhost:" + port)
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {}).build();
        assertEquals(200, raiz.get().uri("/v3/api-docs").retrieve().toBodilessEntity().getStatusCode().value());
        String documento = raiz.get().uri("/v3/api-docs").retrieve().body(String.class);
        assertNotNull(documento);
        assertTrue(documento.contains("/api/v1/productos"), "Swagger debe documentar las rutas versionadas");
        assertTrue(documento.contains("/api/v1/ordenes"));
    }

    @Test
    void unTokenInvalidoSeRechaza() {
        assertEquals(401, enviar(HttpMethod.GET, "/ordenes", "token.falso.invalido", null));
        assertEquals(401, enviar(HttpMethod.GET, "/auth/me", "abc", null));
    }

    @Test
    void administradorTieneAccesoTotalSalvoLasComprasPropias() {
        assertEquals(200, enviar(HttpMethod.GET, "/usuarios", admin, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes", admin, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/" + boletaId, admin, null));
        assertEquals(200, enviar(HttpMethod.GET, "/categorias/1", admin, null));
        assertEquals(200, enviar(HttpMethod.GET, "/auth/me", admin, null));
        assertEquals(403, enviar(HttpMethod.GET, "/ordenes/mias", admin, null));
    }

    @Test
    void vendedorSoloConsultaProductosYOrdenes() {
        assertEquals(200, enviar(HttpMethod.GET, "/productos", vendedor, null));
        assertEquals(200, enviar(HttpMethod.GET, "/productos/" + productoId, vendedor, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes", vendedor, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/" + boletaId, vendedor, null));

        assertEquals(403, enviar(HttpMethod.GET, "/usuarios", vendedor, null));
        assertEquals(403, enviar(HttpMethod.GET, "/categorias/1", vendedor, null));
        assertEquals(403, enviar(HttpMethod.GET, "/ordenes/mias", vendedor, null));
        assertEquals(403, enviar(HttpMethod.POST, "/productos", vendedor, "{}"));
        assertEquals(403, enviar(HttpMethod.PUT, "/productos/" + productoId, vendedor, "{}"));
        assertEquals(403, enviar(HttpMethod.DELETE, "/productos/" + productoId, vendedor, null));
        assertEquals(403, enviar(HttpMethod.POST, "/categorias", vendedor, "{\"nombre\":\"X\"}"));
        assertEquals(403, enviar(HttpMethod.POST, "/usuarios", vendedor, "{}"));
        assertEquals(403, enviar(HttpMethod.POST, "/ordenes", vendedor, compra(productoId, "true")));
    }

    @Test
    void clienteSoloAccedeALaTiendaYASusCompras() {
        assertEquals(200, enviar(HttpMethod.GET, "/productos", cliente, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/mias", cliente, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/" + boletaId, cliente, null));
        assertEquals(200, enviar(HttpMethod.GET, "/auth/me", cliente, null));
        assertEquals(201, enviar(HttpMethod.POST, "/ordenes", cliente, compra(productoId, "false")));

        assertEquals(403, enviar(HttpMethod.GET, "/ordenes", cliente, null));
        assertEquals(403, enviar(HttpMethod.GET, "/usuarios", cliente, null));
        assertEquals(403, enviar(HttpMethod.POST, "/productos", cliente, "{}"));
        assertEquals(403, enviar(HttpMethod.DELETE, "/categorias/1", cliente, null));
    }

    @Test
    void unaRutaNoDeclaradaQuedaDenegada() {
        assertEquals(403, enviar(HttpMethod.GET, "/no-existe", admin, null));
        assertEquals(403, enviar(HttpMethod.DELETE, "/ordenes/" + boletaId, admin, null));
    }

    @Test
    void elRegistroPublicoNoPermiteEscalarPrivilegios() {
        assertEquals(201, enviar(HttpMethod.POST, "/auth/register", null, perfil("190110222", "intruso@duoc.cl", "Administrador")));
        String intruso = entrar("intruso@duoc.cl");

        assertEquals(403, enviar(HttpMethod.GET, "/usuarios", intruso, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/mias", intruso, null));
    }

    @Test
    void unTokenDejaDeValerCuandoCambiaElRolDelUsuario() {
        assertEquals(201, enviar(HttpMethod.POST, "/auth/register", null, perfil("222222222", "cambio@duoc.cl", "Cliente")));
        String antiguo = entrar("cambio@duoc.cl");
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes/mias", antiguo, null));

        assertEquals(200, enviar(HttpMethod.PUT, "/usuarios/222222222", admin, perfil("222222222", "cambio@duoc.cl", "Vendedor")));

        assertEquals(401, enviar(HttpMethod.GET, "/ordenes/mias", antiguo, null));
        assertEquals(200, enviar(HttpMethod.GET, "/ordenes", entrar("cambio@duoc.cl"), null));
    }

    @Test
    void laBoletaExponeElMismoJsonQueConsumeElFrontend() {
        var boleta = api.get().uri("/ordenes/" + boletaId).header("Authorization", "Bearer " + cliente)
                .retrieve().body(Boleta.class);

        assertNotNull(boleta);
        assertEquals("Pagado", boleta.estado());
        assertEquals(1, boleta.items().size());
        assertEquals(productoId, boleta.items().get(0).id());
        assertEquals(2, boleta.items().get(0).cantidad());
        assertEquals((long) boleta.items().get(0).precio() * 2, boleta.total());
    }

    // ---------- Utilidades ----------

    private int enviar(HttpMethod metodo, String ruta, String token, String json) {
        var solicitud = api.method(metodo).uri(ruta);
        if (token != null) solicitud.header("Authorization", "Bearer " + token);
        if (json != null) solicitud.contentType(MediaType.APPLICATION_JSON).body(json);
        return solicitud.retrieve().toBodilessEntity().getStatusCode().value();
    }

    private String entrar(String correo) {
        var respuesta = api.post().uri("/auth/login").contentType(MediaType.APPLICATION_JSON)
                .body("{\"username\":\"%s\",\"password\":\"%s\"}".formatted(correo, CLAVE))
                .retrieve().body(AuthResponse.class);
        assertNotNull(respuesta);
        return respuesta.accessToken();
    }

    private String perfil(String run, String correo, String rol) {
        return """
            {"run":"%s","nombre":"Ana","apellidos":"Soto","correo":"%s",
             "direccion":"Calle 1","contrasena":"%s","tipoUsuario":"%s"}
            """.formatted(run, correo, CLAVE, rol);
    }

    private String compra(long id, String aprobado) {
        return """
            {"cliente":{"nombre":"Ana","apellidos":"Soto","calle":"Calle 1","region":"Maule","comuna":"Talca"},
             "items":[{"id":%d,"cantidad":2}],"aprobado":%s}
            """.formatted(id, aprobado);
    }
}
