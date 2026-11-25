package com.example.demo.service;


import com.example.demo.dto.OrdenRequest;
import com.example.demo.model.*;
import com.example.demo.repository.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.time.Instant;
import java.util.List;
import java.util.TreeMap;

@Service
public class OrdenService {
    private final BoletaRepository ordenes;
    private final ProductoRepository productos;
    private final UsuarioService usuarios;

    public OrdenService(BoletaRepository ordenes, ProductoRepository productos, UsuarioService usuarios) {
        this.ordenes = ordenes;
        this.productos = productos;
        this.usuarios = usuarios;
    }

    public List<Boleta> listar() { return ordenes.findAll(); }

    public List<Boleta> listarDelCliente(String correo) {
        var cliente = usuarios.porCorreo(correo);
        return ordenes.findByCompradorIdOrderByFechaDescIdDesc(cliente.getId());
    }

    public Boleta obtener(Long id, AppUser actor) {
        var orden = ordenes.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada"));
        if (actor.getRole() == AppRole.CLIENTE && !orden.getCompradorId().equals(actor.getId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Orden no encontrada");
        }
        return orden;
    }

    @Transactional
    public Boleta crear(OrdenRequest datos, String correo) {
        var entrega = datos.cliente();
        if (entrega == null || incompleto(entrega.nombre(), entrega.apellidos(), entrega.calle(), entrega.region(), entrega.comuna())
                || datos.items() == null || datos.items().isEmpty() || datos.items().size() > 100
                || (entrega.departamento() != null && entrega.departamento().length() > 255)
                || (entrega.indicaciones() != null && entrega.indicaciones().length() > 1000)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Completa los datos de entrega y agrega productos");
        }
        var comprador = usuarios.porCorreo(correo);
        var orden = new Boleta();
        orden.setComprador(comprador);
        orden.setCliente(new Entrega(entrega.nombre(), entrega.apellidos(), comprador.getCorreo(), entrega.calle(),
                entrega.departamento(), entrega.region(), entrega.comuna(), entrega.indicaciones()));
        orden.setFecha(Instant.now());
        orden.setEstado(datos.aprobado() ? "Pagado" : "Rechazado");
        var cantidades = new TreeMap<Long, Integer>();
        for (var item : datos.items()) {
            if (item == null || item.id() == null || item.cantidad() < 1 || item.cantidad() > 1000000) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Cantidad de producto inválida");
            }
            cantidades.merge(item.id(), item.cantidad(), Integer::sum);
        }
        long total = 0;
        for (var item : cantidades.entrySet()) {
            var producto = productos.buscarParaCompra(item.getKey())
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "Un producto ya no está disponible"));
            int cantidad = item.getValue();
            if (cantidad > producto.getStock()) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Stock insuficiente para " + producto.getNombre());
            }
            int precio = (int) Math.round(producto.getPrecio() * (100.0 - producto.getDescuento()) / 100);
            var detalle = new DetalleBoleta();
            detalle.setProducto(producto);
            detalle.setNombre(producto.getNombre());
            detalle.setPrecio(precio);
            detalle.setCantidad(cantidad);
            orden.agregar(detalle);
            total += (long) precio * cantidad;
            if (datos.aprobado()) producto.setStock(producto.getStock() - cantidad);
        }
        orden.setTotal(total);
        return ordenes.save(orden);
    }

    private boolean incompleto(String... campos) {
        for (String campo : campos) {
            if (campo == null || campo.isBlank() || campo.length() > 255) return true;
        }
        return false;
    }
}
