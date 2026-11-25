package com.example.demo;

import com.example.demo.dto.AuthResponse;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.web.server.LocalServerPort;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestClient;
import static org.junit.jupiter.api.Assertions.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT, properties = {
    "spring.datasource.url=jdbc:h2:mem:autoparts",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "app.jwt.secret=YXV0b3BhcnRzLXRlc3Qtb25seS1zaWduaW5nLWtleS0wMTIzNDU2Nzg5",
    "app.admin.username=admin@duoc.cl",
    "app.admin.password=ClavePrueba1"
})
class AutoPartsIntegrationTests {
    record Producto(long id, int stock) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Detalle(long id, String nombre, int precio, int cantidad) {}
    @JsonIgnoreProperties(ignoreUnknown = true)
    record Orden(long id, String estado, long total, java.util.List<Detalle> items) {}

    @LocalServerPort int port;

    @Test
    void verificaRolesCompraYStock() {
        var api = RestClient.builder().baseUrl("http://localhost:" + port + "/api/v1")
                .defaultStatusHandler(HttpStatusCode::isError, (request, response) -> {}).build();
        var catalogo = api.get().uri("/productos").retrieve().body(Producto[].class);
        assertNotNull(catalogo);
        assertEquals(9, catalogo.length);

        assertEquals(401, api.get().uri("/ordenes").retrieve().toBodilessEntity().getStatusCode().value());
        assertEquals(401, api.post().uri("/auth/login").contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(login("admin@duoc.cl", "incorrecta")).retrieve().toBodilessEntity().getStatusCode().value());
        String admin = entrar(api, "admin@duoc.cl");
        assertEquals(201, post(api, "/usuarios", admin, perfil("123456785", "vendedor@duoc.cl", "Vendedor")).getStatusCode().value());
        assertEquals(201, post(api, "/auth/register", "", perfil("190110222", "cliente@gmail.com", "Administrador")).getStatusCode().value());
        assertEquals(201, post(api, "/auth/register", "", perfil("111111111", "otro@gmail.com", "Cliente")).getStatusCode().value());
        String vendedor = entrar(api, "vendedor@duoc.cl");
        String cliente = entrar(api, "cliente@gmail.com");
        String otro = entrar(api, "otro@gmail.com");

        assertEquals(200, get(api, "/ordenes", vendedor));
        assertEquals(403, get(api, "/usuarios", vendedor));
        assertEquals(403, get(api, "/ordenes", cliente));
        assertEquals(403, post(api, "/productos", vendedor, "{}").getStatusCode().value());

        long id = catalogo[0].id();
        int stock = catalogo[0].stock();
        String compra = """
            {"cliente":{"nombre":"Ana","apellidos":"Soto","calle":"Calle 1","region":"Maule","comuna":"Talca"},
             "items":[{"id":%d,"cantidad":2}],"aprobado":%s}
            """;
        assertEquals(403, post(api, "/ordenes", vendedor, compra.formatted(id, "true")).getStatusCode().value());
        assertEquals(201, post(api, "/ordenes", cliente, compra.formatted(id, "false")).getStatusCode().value());
        assertEquals(stock, api.get().uri("/productos/" + id).retrieve().body(Producto.class).stock());
        assertEquals(201, post(api, "/ordenes", cliente, compra.formatted(id, "true")).getStatusCode().value());
        assertEquals(stock - 2, api.get().uri("/productos/" + id).retrieve().body(Producto.class).stock());

        var ordenes = api.get().uri("/ordenes").header("Authorization", "Bearer " + admin)
                .retrieve().body(Orden[].class);
        assertNotNull(ordenes);
        var pagada = java.util.Arrays.stream(ordenes).filter(o -> "Pagado".equals(o.estado())).findFirst().orElseThrow();
        assertEquals(2, pagada.items().get(0).cantidad());
        String ruta = "/ordenes/" + pagada.id();
        assertEquals(200, get(api, ruta, cliente));
        assertEquals(200, get(api, ruta, vendedor));
        assertEquals(404, get(api, ruta, otro));

        var historial = api.get().uri("/ordenes/mias").header("Authorization", "Bearer " + cliente)
                .retrieve().body(Orden[].class);
        assertNotNull(historial);
        assertEquals(2, historial.length);
        assertEquals(pagada.id(), historial[0].id());
        assertEquals("Rechazado", historial[1].estado());
        var historialAjeno = api.get().uri("/ordenes/mias").header("Authorization", "Bearer " + otro)
                .retrieve().body(Orden[].class);
        assertNotNull(historialAjeno);
        assertEquals(0, historialAjeno.length);
        assertEquals(403, get(api, "/ordenes/mias", vendedor));
    }

    private int get(RestClient api, String ruta, String token) {
        return api.get().uri(ruta).header("Authorization", "Bearer " + token)
                .retrieve().toBodilessEntity().getStatusCode().value();
    }

    private ResponseEntity<Void> post(RestClient api, String ruta, String token, String json) {
        var request = api.post().uri(ruta).contentType(org.springframework.http.MediaType.APPLICATION_JSON);
        if (!token.isEmpty()) request.header("Authorization", "Bearer " + token);
        return request.body(json).retrieve().toBodilessEntity();
    }

    private String entrar(RestClient api, String correo) {
        var respuesta = api.post().uri("/auth/login").contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                .body(login(correo, "ClavePrueba1")).retrieve().body(AuthResponse.class);
        assertNotNull(respuesta);
        return respuesta.accessToken();
    }

    private String login(String correo, String password) {
        return """
            {"username":"%s","password":"%s"}
            """.formatted(correo, password);
    }

    private String perfil(String run, String correo, String rol) {
        return """
            {"run":"%s","nombre":"Ana","apellidos":"Soto","correo":"%s",
             "direccion":"Calle 1","contrasena":"ClavePrueba1","tipoUsuario":"%s"}
            """.formatted(run, correo, rol);
    }
}

