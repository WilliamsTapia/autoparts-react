package com.example.demo.dto;


public record UsuarioRequest(String run, String nombre, String apellidos, String correo,
        String fechaNacimiento, String tipoUsuario, String region, String comuna,
        String direccion, String contrasena) {}
