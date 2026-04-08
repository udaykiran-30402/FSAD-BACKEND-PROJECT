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
        return repo.save(order);
    }

    public List<Order> getAll() {
        return repo.findAll();
    }
}
