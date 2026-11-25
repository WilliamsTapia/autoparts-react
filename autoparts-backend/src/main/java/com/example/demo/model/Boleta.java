package com.example.demo.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

/**
 * BOLETA del modelo propuesto: pertenece a un USUARIO (FK usuario_id) y
 * agrupa varios DETALLE_BOLETA. La API la expone en /api/v1/ordenes.
 */
@Entity
@Table(name = "boletas")
@Getter @Setter
public class Boleta {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Instant fecha;
    @Embedded
    private Entrega cliente;
    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "usuario_id", nullable = false)
    private AppUser comprador;
    @OneToMany(mappedBy = "boleta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    @OrderBy("detalleId ASC")
    private List<DetalleBoleta> items = new ArrayList<>();
    private long total;
    private String estado;

    public void agregar(DetalleBoleta detalle) {
        detalle.setBoleta(this);
        items.add(detalle);
    }

    @JsonIgnore
    public Long getCompradorId() { return comprador.getId(); }
}
