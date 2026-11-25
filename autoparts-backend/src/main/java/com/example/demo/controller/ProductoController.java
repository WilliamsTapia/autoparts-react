package com.example.demo.controller;


import com.example.demo.dto.ProductoRequest;
import com.example.demo.model.Producto;
import com.example.demo.service.ProductoService;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/productos")
public class ProductoController {
    private final ProductoService productos;
    public ProductoController(ProductoService productos) { this.productos = productos; }
    @GetMapping
    public List<Producto> listar() { return productos.listar(); }
    @GetMapping("/{id}")
    public Producto obtener(@PathVariable Long id) { return productos.obtener(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @SecurityRequirement(name = "JWT")
    public Producto crear(@RequestBody ProductoRequest datos) { return productos.guardar(null, datos); }
    @PutMapping("/{id}") @SecurityRequirement(name = "JWT")
    public Producto actualizar(@PathVariable Long id, @RequestBody ProductoRequest datos) {
        return productos.guardar(id, datos);
    }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @SecurityRequirement(name = "JWT")
    public void eliminar(@PathVariable Long id) { productos.eliminar(id); }
}
