package com.tribalconnect.dto;

import com.tribalconnect.model.OrderStatus;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderRequest {
    @NotNull
    private Long userId;

    @NotNull
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal totalPrice;

    private OrderStatus status;
}
