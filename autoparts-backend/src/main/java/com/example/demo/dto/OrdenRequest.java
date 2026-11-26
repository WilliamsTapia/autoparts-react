package com.example.demo.dto;

import com.example.demo.model.Entrega;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import java.util.List;

@Schema(description = "Datos para registrar una nueva orden de compra")
public record OrdenRequest(
        @Schema(description = "Información de entrega y datos del cliente")
        @NotNull(message = "Los datos de entrega del cliente son obligatorios")
        @Valid
        Entrega cliente,

        @Schema(description = "Lista de productos incluidos en la orden")
        @NotEmpty(message = "La orden debe contener al menos un producto")
        @Valid
        List<Item> items,

        @Schema(description = "Indica si la orden fue aprobada", example = "true")
        boolean aprobado
) {
    @Schema(description = "Detalle de un producto dentro de la orden")
    public record Item(
            @Schema(description = "ID del producto", example = "1")
            @NotNull(message = "El ID del producto es obligatorio")
            @Positive(message = "El ID del producto debe ser mayor a 0")
            Long id,

            @Schema(description = "Cantidad solicitada del producto", example = "2")
            @Positive(message = "La cantidad debe ser mayor a 0")
            int cantidad
    ) {
    }
}