package com.tribalconnect.controller;

import com.tribalconnect.dto.ApiResponse;
import com.tribalconnect.dto.AuthResponse;
import com.tribalconnect.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<AuthResponse>>> getAllUsers() {
        List<AuthResponse> users = userService.getAllUsers();
        return ResponseEntity.ok(new ApiResponse<>(true, "Users fetched successfully", users));
    }
}
