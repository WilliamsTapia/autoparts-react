package com.example.demo.controller;


import com.example.demo.dto.*;
import com.example.demo.model.AppUser;
import com.example.demo.service.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

@RestController
@RequestMapping("/api/v1/auth")
public class AuthController {
    private final AuthService auth;
    private final UsuarioService usuarios;

    public AuthController(AuthService auth, UsuarioService usuarios) {
        this.auth = auth;
        this.usuarios = usuarios;
    }

    @PostMapping("/register")
    @ResponseStatus(HttpStatus.CREATED)
    public void registrar(@RequestBody UsuarioRequest datos) {
        usuarios.crear(datos, true);
    }

    @PostMapping("/login")
    public AuthResponse login(@RequestBody LoginRequest datos) {
        return auth.login(datos.username(), datos.password());
    }

    @GetMapping("/me")
    @io.swagger.v3.oas.annotations.security.SecurityRequirement(name = "JWT")
    public AppUser perfil(Principal principal) {
        return usuarios.porCorreo(principal.getName());
    }
}
