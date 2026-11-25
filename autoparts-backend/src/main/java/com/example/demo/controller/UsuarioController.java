package com.example.demo.controller;


import com.example.demo.dto.UsuarioRequest;
import com.example.demo.model.AppUser;
import com.example.demo.service.UsuarioService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "JWT")
@RestController
@RequestMapping("/api/v1/usuarios")
public class UsuarioController {
    private final UsuarioService usuarios;

    public UsuarioController(UsuarioService usuarios) { this.usuarios = usuarios; }

    @GetMapping
    public List<AppUser> listar() { return usuarios.listar(); }

    @GetMapping("/{run}")
    public AppUser obtener(@PathVariable String run) { return usuarios.obtener(run); }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public AppUser crear(@RequestBody UsuarioRequest datos) { return usuarios.crear(datos, false); }

    @PutMapping("/{run}")
    public AppUser actualizar(@PathVariable String run, @RequestBody UsuarioRequest datos, Principal actor) {
        return usuarios.actualizar(run, datos, actor.getName());
    }

    @DeleteMapping("/{run}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void eliminar(@PathVariable String run, Principal actor) { usuarios.eliminar(run, actor.getName()); }
}
