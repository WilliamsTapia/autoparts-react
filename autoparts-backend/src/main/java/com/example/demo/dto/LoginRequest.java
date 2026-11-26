package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;

@Schema(description = "Credenciales de acceso para iniciar sesión")
public record LoginRequest(
        @Schema(description = "Nombre de usuario registrado", example = "admin")
        @NotBlank(message = "El nombre de usuario es obligatorio")
        String username,

        @Schema(description = "Contraseña del usuario", example = "123456")
        @NotBlank(message = "La contraseña es obligatorio")
        String password
) {
}