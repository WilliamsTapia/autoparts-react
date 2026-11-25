package com.example.demo.model;


import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "productos")
@Getter @Setter
public class Producto {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, unique = true)
    private String codigo;
    private String nombre;
    @Column(length = 2000)
    private String descripcion;
    private int precio;
    private int stock;
    private int stockCritico;
    @Column(length = 2000)
    private String imagen;
    private int descuento;
    @ManyToOne(optional = false)
    @JsonIgnore
    private Categoria categoriaEntidad;

    public String getCategoria() { return categoriaEntidad.getNombre(); }
}
