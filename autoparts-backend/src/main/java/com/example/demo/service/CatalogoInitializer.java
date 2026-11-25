package com.example.demo.service;


import com.example.demo.dto.ProductoRequest;
import com.example.demo.repository.CategoriaRepository;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;
import java.util.List;

@Component
public class CatalogoInitializer implements ApplicationRunner {
    private final CategoriaRepository repositorio;
    private final CategoriaService categorias;
    private final ProductoService productos;
    private final boolean cargar;

    public CatalogoInitializer(CategoriaRepository repositorio, CategoriaService categorias, ProductoService productos,
            @Value("${app.catalogo.inicial:true}") boolean cargar) {
        this.repositorio = repositorio;
        this.categorias = categorias;
        this.productos = productos;
        this.cargar = cargar;
    }

    @Override
    @org.springframework.transaction.annotation.Transactional
    public void run(ApplicationArguments args) {
        if (!cargar || repositorio.count() > 0) return;
        var catalogo = List.of(
            new ProductoRequest("FRE-001", "Pastillas de freno delanteras", "Juego de pastillas de freno cerámicas para vehículos livianos. Alta duración y bajo nivel de polvo.", 25990, 40, 5, "Frenos", "/img/freno-delantero.jpg", 15),
            new ProductoRequest("FRE-002", "Disco de freno ventilado", "Disco de freno ventilado 260mm, compatible con la mayoría de sedanes medianos.", 39990, 18, 4, "Frenos", "/img/pastillas-freno.jpg", 0),
            new ProductoRequest("BAT-001", "Batería 12V 60Ah", "Batería libre de mantenimiento, 60Ah, ideal para autos y camionetas medianas.", 59990, 12, 3, "Baterías", "/img/bateria-12v.jpg", 10),
            new ProductoRequest("FIL-001", "Filtro de aceite", "Filtro de aceite de alta filtración, compatible con motores 1.6 a 2.0.", 8990, 60, 10, "Filtros", "/img/filtro-aceite.jpg", 0),
            new ProductoRequest("FIL-002", "Filtro de aire", "Filtro de aire de alto flujo, mejora el rendimiento del motor.", 7490, 55, 10, "Filtros", "/img/filtro-aire.jpg", 0),
            new ProductoRequest("SUS-001", "Amortiguador delantero", "Amortiguador a gas para eje delantero, mejora estabilidad y confort.", 45990, 20, 4, "Suspensión", "/img/amortiguador-delantero.jpg", 0),
            new ProductoRequest("LUZ-001", "Ampolleta LED H4", "Ampolleta LED de alto brillo, bajo consumo, fácil instalación.", 12990, 3, 5, "Iluminación", "/img/led-h4.jpg", 0),
            new ProductoRequest("ACE-001", "Aceite de motor 5W-30 (4L)", "Aceite sintético 5W-30, protección avanzada del motor.", 32990, 35, 8, "Aceites y lubricantes", "/img/aceite-motor.jpg", 20),
            new ProductoRequest("NEU-001", "Neumático 195/65 R15", "Neumático radial para uso urbano y carretera, excelente agarre en mojado.", 69990, 24, 6, "Neumáticos", "/img/neumatico-r15.jpg", 25)
        );
        catalogo.stream().map(ProductoRequest::categoria).distinct().forEach(nombre -> categorias.guardar(null, nombre));
        catalogo.forEach(producto -> productos.guardar(null, producto));
    }
}
