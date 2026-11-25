package com.example.demo;

import com.example.demo.dto.OrdenRequest;
import com.example.demo.dto.ProductoRequest;
import com.example.demo.dto.UsuarioRequest;
import com.example.demo.model.AppRole;
import com.example.demo.model.AppUser;
import com.example.demo.model.Entrega;
import com.example.demo.model.Producto;
import com.example.demo.service.AuthService;
import com.example.demo.service.CategoriaService;
import com.example.demo.service.OrdenService;
import com.example.demo.service.ProductoService;
import com.example.demo.service.UsuarioService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

/**
 * Pruebas de la lógica de negocio a nivel de servicios, con la base H2 en memoria.
 * Cada prueba se revierte al terminar, por eso no afectan a las demás.
 */
@SpringBootTest(properties = {
    "spring.datasource.url=jdbc:h2:mem:reglas",
    "spring.datasource.username=sa",
    "spring.datasource.password=",
    "spring.jpa.hibernate.ddl-auto=create-drop",
    "app.jwt.secret=YXV0b3BhcnRzLXRlc3Qtb25seS1zaWduaW5nLWtleS0wMTIzNDU2Nzg5",
    "app.admin.username=admin@duoc.cl",
    "app.admin.password=ClavePrueba1"
})
@Transactional
class ReglasDeNegocioTests {
    private static final String CLAVE = "ClavePrueba1";

    @Autowired OrdenService ordenes;
    @Autowired ProductoService productos;
    @Autowired CategoriaService categorias;
    @Autowired UsuarioService usuarios;
    @Autowired AuthService auth;

    // ---------- Compras (boletas) ----------

    @Test
    void compraAprobadaAplicaDescuentoGuardaDetalleYDescuentaStock() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("FRE-001"); // $25.990 con 15 % de descuento
        int stock = producto.getStock();

        var boleta = ordenes.crear(compra(true, item(producto.getId(), 2)), cliente.getCorreo());

        assertEquals("Pagado", boleta.getEstado());
        assertEquals(2L * 22092, boleta.getTotal());
        assertEquals(cliente.getId(), boleta.getCompradorId());
        assertEquals(1, boleta.getItems().size());
        var detalle = boleta.getItems().get(0);
        assertEquals(producto.getId(), detalle.getProductoId());
        assertEquals(22092, detalle.getPrecio());
        assertEquals(2, detalle.getCantidad());
        assertSame(boleta, detalle.getBoleta());
        assertEquals(stock - 2, productos.obtener(producto.getId()).getStock());
    }

    @Test
    void compraRechazadaSeGuardaPeroConservaElStock() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("FIL-001");
        int stock = producto.getStock();

        var boleta = ordenes.crear(compra(false, item(producto.getId(), 3)), cliente.getCorreo());

        assertEquals("Rechazado", boleta.getEstado());
        assertEquals(stock, productos.obtener(producto.getId()).getStock());
        assertEquals(1, ordenes.listarDelCliente(cliente.getCorreo()).size());
    }

    @Test
    void itemsRepetidosSeConsolidanEnUnSoloDetalle() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("FIL-002");

        var boleta = ordenes.crear(compra(true, item(producto.getId(), 1), item(producto.getId(), 2)),
                cliente.getCorreo());

        assertEquals(1, boleta.getItems().size());
        assertEquals(3, boleta.getItems().get(0).getCantidad());
        assertEquals(3L * producto.getPrecio(), boleta.getTotal());
    }

    @Test
    void stockInsuficienteDevuelveConflicto() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("LUZ-001"); // stock 3
        var datos = compra(true, item(producto.getId(), producto.getStock() + 1));

        assertEstado(409, () -> ordenes.crear(datos, cliente.getCorreo()));
        assertEquals(3, productos.obtener(producto.getId()).getStock());
    }

    @Test
    void compraInvalidaDevuelveBadRequest() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("FIL-001");
        String correo = cliente.getCorreo();

        assertEstado(400, () -> ordenes.crear(compra(true), correo));
        assertEstado(400, () -> ordenes.crear(compra(true, item(producto.getId(), 0)), correo));
        assertEstado(400, () -> ordenes.crear(compra(true, item(999_999L, 1)), correo));
        assertEstado(400, () -> ordenes.crear(
                new OrdenRequest(new Entrega("", "Soto", null, "Calle 1", null, "Maule", "Talca", null),
                        List.of(item(producto.getId(), 1)), true), correo));
        assertEstado(400, () -> ordenes.crear(new OrdenRequest(null, List.of(item(producto.getId(), 1)), true), correo));
    }

    @Test
    void clienteSoloVeSusBoletasPeroElPersonalInternoVeTodas() {
        var ana = nuevoUsuario("111111111", "ana@test.cl", "Cliente", true);
        var luis = nuevoUsuario("190110222", "luis@test.cl", "Cliente", true);
        var vendedor = nuevoUsuario("123456785", "vendedor@test.cl", "Vendedor", false);
        Producto producto = producto("FIL-001");
        var boleta = ordenes.crear(compra(true, item(producto.getId(), 1)), ana.getCorreo());

        assertEquals(boleta.getId(), ordenes.obtener(boleta.getId(), ana).getId());
        assertEquals(boleta.getId(), ordenes.obtener(boleta.getId(), vendedor).getId());
        assertEstado(404, () -> ordenes.obtener(boleta.getId(), luis));
        assertEquals(1, ordenes.listarDelCliente(ana.getCorreo()).size());
        assertTrue(ordenes.listarDelCliente(luis.getCorreo()).isEmpty());
        assertEquals(1, ordenes.listar().size());
    }

    @Test
    void historialDelClienteVieneDelMasRecienteAlMasAntiguo() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto producto = producto("FIL-001");
        var primera = ordenes.crear(compra(false, item(producto.getId(), 1)), cliente.getCorreo());
        var segunda = ordenes.crear(compra(true, item(producto.getId(), 1)), cliente.getCorreo());

        var historial = ordenes.listarDelCliente(cliente.getCorreo());

        assertEquals(List.of(segunda.getId(), primera.getId()), historial.stream().map(b -> b.getId()).toList());
    }

    // ---------- Integridad referencial del modelo USUARIO-BOLETA-DETALLE-PRODUCTO ----------

    @Test
    void noSeEliminaUnProductoNiUnUsuarioConVentasRegistradas() {
        var cliente = nuevoUsuario("111111111", "cliente@test.cl", "Cliente", true);
        Producto vendido = producto("FIL-001");
        ordenes.crear(compra(true, item(vendido.getId(), 1)), cliente.getCorreo());

        assertEstado(409, () -> productos.eliminar(vendido.getId()));
        assertEstado(409, () -> usuarios.eliminar(cliente.getRun(), "admin@duoc.cl"));
    }

    @Test
    void sePuedeEliminarUnProductoSinVentas() {
        Producto libre = producto("FIL-002");

        productos.eliminar(libre.getId());

        assertEstado(404, () -> productos.obtener(libre.getId()));
    }

    // ---------- Productos y categorías ----------

    @Test
    void productoValidaDatosYCodigoUnico() {
        assertEstado(400, () -> productos.guardar(null, datosProducto("NUE-001", -1, "Frenos")));
        assertEstado(400, () -> productos.guardar(null, datosProducto("NUE-001", 1000, "No existe")));
        assertEquals("NUE-001", productos.guardar(null, datosProducto("NUE-001", 1000, "Frenos")).getCodigo());
    }

    @Test
    void productoConCodigoRepetidoDevuelveConflicto() {
        assertEstado(409, () -> productos.guardar(null, datosProducto("FRE-001", 1000, "Frenos")));
    }

    @Test
    void categoriaEnUsoNoSePuedeEliminarPeroVaciaSi() {
        var enUso = categorias.listar().stream().filter(c -> c.nombre().equals("Frenos")).findFirst().orElseThrow();
        assertTrue(enUso.cantidad() > 0);
        assertEstado(409, () -> categorias.eliminar(enUso.id()));

        var nueva = categorias.guardar(null, "Accesorios");
        categorias.eliminar(nueva.id());
        assertEstado(404, () -> categorias.obtener(nueva.id()));
    }

    @Test
    void categoriaValidaElNombre() {
        assertEstado(400, () -> categorias.guardar(null, "  "));
    }

    @Test
    void categoriaRepetidaDevuelveConflicto() {
        assertEstado(409, () -> categorias.guardar(null, "Frenos"));
    }

    // ---------- Usuarios y autenticación ----------

    @Test
    void elRegistroPublicoSiempreCreaClientes() {
        var usuario = usuarios.crear(datosUsuario("111111111", "nuevo@test.cl", "Administrador"), true);

        assertEquals(AppRole.CLIENTE, usuario.getRole());
        assertNotEquals(CLAVE, usuario.getPassword(), "La contraseña debe guardarse con hash");
        assertTrue(usuario.getPassword().startsWith("$2"), "Debe ser un hash BCrypt");
    }

    @Test
    void usuarioValidaRunCorreoYContrasena() {
        assertEstado(400, () -> usuarios.crear(datosUsuario("111111112", "a@test.cl", "Cliente"), true));
        assertEstado(400, () -> usuarios.crear(datosUsuario("111111111", "correo-malo", "Cliente"), true));
        assertEstado(400, () -> usuarios.crear(
                new UsuarioRequest("111111111", "Ana", "Soto", "a@test.cl", "1990-01-01", "Cliente",
                        "Maule", "Talca", "Calle 1", "corta"), true));
        assertEstado(400, () -> usuarios.crear(datosUsuario("111111111", "a@test.cl", "Inexistente"), false));
    }

    @Test
    void usuarioConCorreoORunRepetidoDevuelveConflicto() {
        nuevoUsuario("111111111", "ana@test.cl", "Cliente", true);

        assertEstado(409, () -> usuarios.crear(datosUsuario("190110222", "ana@test.cl", "Cliente"), true));
    }

    @Test
    void elAdministradorNoPuedeCambiarSuRolNiEliminarSuCuenta() {
        var admin = usuarios.porCorreo("admin@duoc.cl");

        assertEstado(400, () -> usuarios.actualizar(admin.getRun(),
                datosUsuario(admin.getRun(), "admin@duoc.cl", "Vendedor"), "admin@duoc.cl"));
        assertEstado(400, () -> usuarios.eliminar(admin.getRun(), "admin@duoc.cl"));
    }

    @Test
    void loginEmiteTokenConElRolYRechazaCredencialesInvalidas() {
        nuevoUsuario("111111111", "ana@test.cl", "Cliente", true);

        var respuesta = auth.login("ana@test.cl", CLAVE);
        assertEquals("CLIENTE", respuesta.role());
        assertEquals("Bearer", respuesta.tokenType());
        assertFalse(respuesta.accessToken().isBlank());
        assertTrue(respuesta.expiresAt().isAfter(java.time.Instant.now()));

        assertEstado(401, () -> auth.login("ana@test.cl", "incorrecta"));
        assertEstado(401, () -> auth.login("noexiste@test.cl", CLAVE));
        assertEstado(401, () -> auth.login(null, null));
    }

    // ---------- Utilidades ----------

    private AppUser nuevoUsuario(String run, String correo, String tipo, boolean registro) {
        return usuarios.crear(datosUsuario(run, correo, tipo), registro);
    }

    private UsuarioRequest datosUsuario(String run, String correo, String tipo) {
        return new UsuarioRequest(run, "Ana", "Soto", correo, "1990-01-01", tipo, "Maule", "Talca", "Calle 1", CLAVE);
    }

    private ProductoRequest datosProducto(String codigo, int precio, String categoria) {
        return new ProductoRequest(codigo, "Producto de prueba", "Descripción", precio, 10, 2, categoria, null, 0);
    }

    private Producto producto(String codigo) {
        return productos.listar().stream().filter(p -> p.getCodigo().equals(codigo)).findFirst().orElseThrow();
    }

    private OrdenRequest.Item item(Long id, int cantidad) {
        return new OrdenRequest.Item(id, cantidad);
    }

    private OrdenRequest compra(boolean aprobado, OrdenRequest.Item... items) {
        return new OrdenRequest(new Entrega("Ana", "Soto", null, "Calle 1", null, "Maule", "Talca", null),
                List.of(items), aprobado);
    }

    private void assertEstado(int esperado, org.junit.jupiter.api.function.Executable accion) {
        var error = assertThrows(ResponseStatusException.class, accion);
        assertEquals(esperado, error.getStatusCode().value());
    }
}
