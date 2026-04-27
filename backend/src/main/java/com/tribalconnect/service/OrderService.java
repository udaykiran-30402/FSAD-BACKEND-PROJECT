package com.tribalconnect.service;

import com.tribalconnect.model.Order;
import com.tribalconnect.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class OrderService {

    @Autowired
    private OrderRepository repo;

    public Order create(Order order) {
        order.setStatus("PLACED");
        order.setOrderNumber(null);

        Order savedOrder = repo.save(order);
        savedOrder.setOrderNumber(formatOrderNumber(savedOrder));
        return repo.save(savedOrder);
    }

    public List<Order> getAll() {
        return repo.findAll().stream()
            .map(this::ensureOrderNumber)
            .toList();
    }

    private Order ensureOrderNumber(Order order) {
        String expectedOrderNumber = formatOrderNumber(order);
        if (!expectedOrderNumber.equals(order.getOrderNumber())) {
            order.setOrderNumber(expectedOrderNumber);
            return repo.save(order);
        }
        return order;
    }

    private String formatOrderNumber(Order order) {
        return "ORD-" + order.getId();
    }
}
