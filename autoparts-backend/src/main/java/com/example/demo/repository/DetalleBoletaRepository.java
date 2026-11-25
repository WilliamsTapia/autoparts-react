package com.example.demo.repository;

import com.example.demo.model.DetalleBoleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface DetalleBoletaRepository extends JpaRepository<DetalleBoleta, Long> {
    @Query("select count(d) > 0 from DetalleBoleta d where d.producto.id = :productoId")
    boolean existsByProductoId(@Param("productoId") Long productoId);
}
