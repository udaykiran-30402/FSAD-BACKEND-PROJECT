package com.tribalconnect.controller;

import com.tribalconnect.model.Review;
import com.tribalconnect.service.ReviewService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    @GetMapping
    public ResponseEntity<?> getAllReviews() {
        return ResponseEntity.ok(reviewService.getAll());
    }

    @PostMapping
    public ResponseEntity<?> addReview(@RequestBody Review review) {
        return ResponseEntity.ok(reviewService.save(review));
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<?> getByProduct(@PathVariable Long productId) {
        return ResponseEntity.ok(reviewService.getByProduct(productId));
    }
}
