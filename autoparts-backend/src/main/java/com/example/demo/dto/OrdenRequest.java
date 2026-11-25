package com.example.demo.dto;


import com.example.demo.model.Entrega;
import java.util.List;

public record OrdenRequest(Entrega cliente, List<Item> items, boolean aprobado) {
    public record Item(Long id, int cantidad) {}
}
