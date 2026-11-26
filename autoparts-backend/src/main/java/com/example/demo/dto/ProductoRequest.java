package com.example.demo.dto;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

@Schema(description = "Datos para crear o actualizar un producto en el catálogo")
public record ProductoRequest(
        @Schema(description = "Código único del producto (SKU)", example = "AP-FIL-001")
        @NotBlank(message = "El código del producto es obligatorio")
        String codigo,

        @Schema(description = "Nombre del producto", example = "Filtro de aceite Bosch")
        @NotBlank(message = "El nombre del producto es obligatorio")
        String nombre,

        @Schema(description = "Descripción detallada del producto", example = "Filtro de aceite de alta eficiencia compatible con motores 1.6 y 2.0")
        String descripcion,

        @Schema(description = "Precio unitario del producto en CLP", example = "15990")
        @NotNull(message = "El precio es obligatorio")
        @Positive(message = "El precio debe ser mayor a 0")
        Integer precio,

        @Schema(description = "Cantidad disponible en inventario", example = "25")
        @NotNull(message = "El stock es obligatorio")
        @PositiveOrZero(message = "El stock no puede ser negativo")
        Integer stock,

        @Schema(description = "Umbral mínimo de stock para generar alerta", example = "5")
        @PositiveOrZero(message = "El stock crítico no puede ser negativo")
        Integer stockCritico,

        @Schema(description = "Categoría a la que pertenece el producto", example = "Filtros")
        @NotBlank(message = "La categoría es obligatoria")
        String categoria,

        @Schema(description = "URL o ruta de la imagen del producto", example = "https://ejemplo.com/img/filtro.jpg")
        String imagen,

        @Schema(description = "Porcentaje de descuento aplicado (0 a 100)", example = "10")
        @Min(value = 0, message = "El descuento no puede ser menor a 0")
        @Max(value = 100, message = "El descuento no puede ser mayor a 100")
        Integer descuento
) {
}