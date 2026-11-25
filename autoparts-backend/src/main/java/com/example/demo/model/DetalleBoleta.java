package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

/**
 * DETALLE_BOLETA del modelo propuesto: FK a boletas (boleta_id) y a productos
 * (producto_id). Conserva nombre y precio aplicado al momento de la compra.
 * El JSON mantiene {id (del producto), nombre, precio, cantidad}.
 */
@Entity
@Table(name = "detalles_boleta")
@Getter @Setter @NoArgsConstructor
public class DetalleBoleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    @JsonIgnore
    private Long detalleId;
    @ManyToOne(optional = false)
    @JoinColumn(name = "boleta_id", nullable = false)
    @JsonIgnore
    private Boleta boleta;
    @ManyToOne(optional = false)
    @JoinColumn(name = "producto_id", nullable = false)
    @JsonIgnore
    private Producto producto;
    private String nombre;
    private int precio;
    private int cantidad;

    @JsonProperty("id")
    public Long getProductoId() { return producto.getId(); }
}
