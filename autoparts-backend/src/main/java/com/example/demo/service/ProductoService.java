package com.example.demo.service;


import com.example.demo.dto.ProductoRequest;
import com.example.demo.model.Producto;
import com.example.demo.repository.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class ProductoService {
    private final ProductoRepository productos;
    private final CategoriaRepository categorias;
    private final DetalleBoletaRepository detalles;

    public ProductoService(ProductoRepository productos, CategoriaRepository categorias,
            DetalleBoletaRepository detalles) {
        this.productos = productos;
        this.categorias = categorias;
        this.detalles = detalles;
    }

    public List<Producto> listar() { return productos.findAll(); }

    public Producto obtener(Long id) {
        return productos.findById(id).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
    }

    @Transactional
    public Producto guardar(Long id, ProductoRequest datos) {
        if (datos.codigo() == null || datos.codigo().isBlank() || datos.codigo().length() > 255
                || datos.nombre() == null || datos.nombre().isBlank() || datos.nombre().length() > 255
                || datos.descripcion() == null || datos.descripcion().length() > 2000
                || (datos.imagen() != null && datos.imagen().length() > 2000)
                || datos.precio() == null || datos.precio() < 0 || datos.stock() == null || datos.stock() < 0
                || datos.stockCritico() == null || datos.stockCritico() < 0 || datos.descuento() == null
                || datos.descuento() < 0 || datos.descuento() > 100 || datos.categoria() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Revisa los datos del producto");
        }
        var categoria = categorias.findByNombreIgnoreCase(datos.categoria().trim())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.BAD_REQUEST, "La categoría no existe"));
        var producto = id == null ? new Producto() : productos.buscarParaCompra(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Producto no encontrado"));
        producto.setCodigo(datos.codigo().trim());
        producto.setNombre(datos.nombre().trim());
        producto.setDescripcion(datos.descripcion());
        producto.setPrecio(datos.precio());
        producto.setStock(datos.stock());
        producto.setStockCritico(datos.stockCritico());
        producto.setCategoriaEntidad(categoria);
        producto.setImagen(datos.imagen());
        producto.setDescuento(datos.descuento());
        try {
            return productos.saveAndFlush(producto);
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "El código del producto ya existe");
        }
    }

    @Transactional
    public void eliminar(Long id) {
        var producto = obtener(id);
        if (detalles.existsByProductoId(id)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT,
                    "El producto tiene ventas registradas y no se puede eliminar");
        }
        productos.delete(producto);
    }
}
