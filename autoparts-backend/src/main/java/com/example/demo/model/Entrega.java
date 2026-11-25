package com.example.demo.model;


import jakarta.persistence.Embeddable;
import jakarta.persistence.Column;

@Embeddable
public record Entrega(String nombre, String apellidos, String correo, String calle,
        String departamento, String region, String comuna,
        @Column(length = 1000) String indicaciones) {}
