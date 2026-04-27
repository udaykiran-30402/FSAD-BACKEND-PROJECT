package com.tribalconnect.service;

import com.tribalconnect.dto.ReviewRequest;
import com.tribalconnect.model.Review;
import com.tribalconnect.repository.ReviewRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final ProductService productService;
    private final UserService userService;

    public ReviewService(ReviewRepository reviewRepository, ProductService productService, UserService userService) {
        this.reviewRepository = reviewRepository;
        this.productService = productService;
        this.userService = userService;
    }

    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    public Review save(Review review) {
        productService.getProductById(review.getProductId());
        userService.getUserById(review.getUserId());

        if (review.getComment() != null) {
            review.setComment(review.getComment().trim());
        }

        return reviewRepository.save(review);
    }

    public List<Review> getByProduct(Long productId) {
        productService.getProductById(productId);
        return reviewRepository.findByProductIdOrderByIdDesc(productId);
    }

    public Review createReview(ReviewRequest request) {
        Review review = new Review();
        review.setProductId(request.getProductId());
        review.setUserId(request.getUserId());
        review.setRating(request.getRating());
        review.setComment(request.getComment());
        return save(review);
    }

    public List<Review> getReviewsByProductId(Long productId) {
        return getByProduct(productId);
    }
}
