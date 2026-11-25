package com.example.demo.dto;


public record ProductoRequest(String codigo, String nombre, String descripcion, Integer precio,
        Integer stock, Integer stockCritico, String categoria, String imagen, Integer descuento) {}
