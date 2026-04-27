package com.tribalconnect.service;

import com.tribalconnect.dto.ProductRequest;
import com.tribalconnect.model.Product;
import com.tribalconnect.model.Role;
import com.tribalconnect.model.User;
import com.tribalconnect.repository.ProductRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;
    private final UserService userService;

    public ProductService(ProductRepository productRepository, UserService userService) {
        this.productRepository = productRepository;
        this.userService = userService;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product getProductById(Long id) {
        return productRepository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    public Product createProduct(ProductRequest request) {
        User artisan = userService.getUserById(request.getArtisanId());
        if (artisan.getRole() != Role.ARTISAN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provided artisanId does not belong to an artisan user");
        }

        Product product = new Product();
        product.setName(request.getName().trim());
        product.setDescription(request.getDescription().trim());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
        product.setCategory(request.getCategory());
        product.setArtisanId(request.getArtisanId());
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = getProductById(id);
        User artisan = userService.getUserById(request.getArtisanId());
        if (artisan.getRole() != Role.ARTISAN) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provided artisanId does not belong to an artisan user");
        }

        product.setName(request.getName().trim());
        product.setDescription(request.getDescription().trim());
        product.setPrice(request.getPrice());
        product.setImage(request.getImage());
        product.setCategory(request.getCategory());
        product.setArtisanId(request.getArtisanId());
        return productRepository.save(product);
    }

    public void deleteProduct(Long id) {
        Product product = getProductById(id);
        productRepository.delete(product);
    }
}
