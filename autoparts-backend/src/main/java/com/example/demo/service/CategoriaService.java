package com.example.demo.service;


import com.example.demo.model.Categoria;
import com.example.demo.repository.*;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;
import java.util.List;

@Service
public class CategoriaService {
    public record CategoriaVista(Long id, String nombre, long cantidad) {}
    private final CategoriaRepository categorias;
    private final ProductoRepository productos;

    public CategoriaService(CategoriaRepository categorias, ProductoRepository productos) {
        this.categorias = categorias;
        this.productos = productos;
    }

    public List<CategoriaVista> listar() {
        return categorias.findAll().stream().map(this::vista).toList();
    }

    public CategoriaVista guardar(Long id, String nombre) {
        if (nombre == null || nombre.isBlank() || nombre.length() > 255) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Ingresa un nombre de categoría válido");
        }
        Categoria categoria = id == null ? new Categoria() : categorias.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
        categoria.setNombre(nombre.trim());
        try {
            return vista(categorias.saveAndFlush(categoria));
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La categoría ya existe");
        }
    }

    public CategoriaVista obtener(Long id) {
        return categorias.findById(id).map(this::vista)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Categoría no encontrada"));
    }

    @org.springframework.transaction.annotation.Transactional
    public void eliminar(Long id) {
        if (obtener(id).cantidad() > 0) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Reasigna los productos antes de eliminar la categoría");
        }
        try {
            categorias.deleteById(id);
            categorias.flush();
        } catch (DataIntegrityViolationException ex) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "La categoría tiene productos asociados");
        }
    }

    private CategoriaVista vista(Categoria categoria) {
        return new CategoriaVista(categoria.getId(), categoria.getNombre(), productos.countByCategoriaEntidadId(categoria.getId()));
    }
}
