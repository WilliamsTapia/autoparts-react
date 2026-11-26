package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import java.time.Instant;

@Schema(description = "Respuesta de autenticación con el token JWT generado")
public record AuthResponse(
        @Schema(description = "Token JWT de acceso", example = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...")
        String accessToken,

        @Schema(description = "Tipo de token de autorización", example = "Bearer")
        String tokenType,

        @Schema(description = "Fecha y hora de expiración del token en formato UTC", example = "2026-11-26T02:00:00Z")
        Instant expiresAt,

        @Schema(description = "Rol asignado al usuario autenticado", example = "ROLE_USER")
        String role
) {
}