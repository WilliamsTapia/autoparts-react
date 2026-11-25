package com.example.demo.repository;

import com.example.demo.model.Boleta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BoletaRepository extends JpaRepository<Boleta, Long> {
    @Query("select b from Boleta b where b.comprador.id = :compradorId order by b.fecha desc, b.id desc")
    List<Boleta> findByCompradorIdOrderByFechaDescIdDesc(@Param("compradorId") Long compradorId);

    @Query("select count(b) > 0 from Boleta b where b.comprador.id = :compradorId")
    boolean existsByCompradorId(@Param("compradorId") Long compradorId);
}
