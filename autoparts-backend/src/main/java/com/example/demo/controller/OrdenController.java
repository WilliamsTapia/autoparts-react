package com.example.demo.controller;


import com.example.demo.dto.OrdenRequest;
import com.example.demo.model.Boleta;
import com.example.demo.service.*;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ordenes")
@SecurityRequirement(name = "JWT")
public class OrdenController {
    private final OrdenService ordenes;
    private final UsuarioService usuarios;
    public OrdenController(OrdenService ordenes, UsuarioService usuarios) {
        this.ordenes = ordenes;
        this.usuarios = usuarios;
    }
    @GetMapping
    public List<Boleta> listar() { return ordenes.listar(); }
    @GetMapping("/mias")
    public List<Boleta> listarMias(Principal actor) {
        return ordenes.listarDelCliente(actor.getName());
    }

    @GetMapping("/{id}")
    public Boleta obtener(@PathVariable Long id, Principal actor) {
        return ordenes.obtener(id, usuarios.porCorreo(actor.getName()));
    }
    @PostMapping @ResponseStatus(HttpStatus.CREATED)
    public Boleta crear(@RequestBody OrdenRequest datos, Principal actor) { return ordenes.crear(datos, actor.getName()); }
}
