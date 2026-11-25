package com.example.demo.controller;


import com.example.demo.service.CategoriaService;
import com.example.demo.service.CategoriaService.CategoriaVista;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/categorias")
public class CategoriaController {
    public record CategoriaRequest(String nombre) {}
    private final CategoriaService categorias;
    public CategoriaController(CategoriaService categorias) { this.categorias = categorias; }
    @GetMapping
    public List<CategoriaVista> listar() { return categorias.listar(); }
    @GetMapping("/{id}") @SecurityRequirement(name = "JWT")
    public CategoriaVista obtener(@PathVariable Long id) { return categorias.obtener(id); }
    @DeleteMapping("/{id}") @ResponseStatus(HttpStatus.NO_CONTENT) @SecurityRequirement(name = "JWT")
    public void eliminar(@PathVariable Long id) { categorias.eliminar(id); }
    @PostMapping @ResponseStatus(HttpStatus.CREATED) @SecurityRequirement(name = "JWT")
    public CategoriaVista crear(@RequestBody CategoriaRequest datos) { return categorias.guardar(null, datos.nombre()); }
    @PutMapping("/{id}") @SecurityRequirement(name = "JWT")
    public CategoriaVista actualizar(@PathVariable Long id, @RequestBody CategoriaRequest datos) {
        return categorias.guardar(id, datos.nombre());
    }
}
