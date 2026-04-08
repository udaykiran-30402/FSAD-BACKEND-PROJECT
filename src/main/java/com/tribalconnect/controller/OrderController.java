package com.tribalconnect.controller;

import com.tribalconnect.model.Order;
import com.tribalconnect.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin("*")
public class OrderController {

    @Autowired
    private OrderRepository repo;

    @GetMapping
    public List<Order> getAll() {
        return repo.findAll();
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setStatus("PLACED");
        return repo.save(order);
    }
}
