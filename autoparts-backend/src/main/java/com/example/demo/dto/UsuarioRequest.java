package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

@Schema(description = "Datos para registrar o actualizar un usuario")
public record UsuarioRequest(
        @Schema(description = "RUN del usuario", example = "12.345.678-9")
        @NotBlank(message = "El RUN es obligatorio")
        String run,

        @Schema(description = "Nombre del usuario", example = "Franco")
        @NotBlank(message = "El nombre es obligatorio")
        String nombre,

        @Schema(description = "Apellidos del usuario", example = "Pérez González")
        @NotBlank(message = "Los apellidos son obligatorios")
        String apellidos,

        @Schema(description = "Correo electrónico del usuario", example = "franco@autoparts.cl")
        @NotBlank(message = "El correo electrónico es obligatorio")
        @Email(message = "El correo electrónico debe tener un formato válido")
        String correo,

        @Schema(description = "Fecha de nacimiento en formato YYYY-MM-DD", example = "1998-05-14")
        String fechaNacimiento,

        @Schema(description = "Rol o tipo de usuario", example = "CLIENTE")
        String tipoUsuario,

        @Schema(description = "Región de residencia", example = "Región Metropolitana")
        String region,

        @Schema(description = "Comuna de residencia", example = "Maipú")
        String comuna,

        @Schema(description = "Dirección postal", example = "Av. Pajaritos 1234")
        String direccion,

        @Schema(description = "Contraseña de acceso (mínimo 6 caracteres)", example = "segura123")
        @Size(min = 6, message = "La contraseña debe tener al menos 6 caracteres")
        String contrasena
) {
}