package com.tribalconnect.service;

import com.tribalconnect.dto.AuthResponse;
import com.tribalconnect.dto.LoginRequest;
import com.tribalconnect.dto.RegisterRequest;
import com.tribalconnect.model.User;
import com.tribalconnect.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Objects;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Email already registered");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        user.setPhone(request.getPhone());
        user.setAddress(request.getAddress());

        User savedUser = userRepository.save(user);
        return toAuthResponse(savedUser);
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail().trim().toLowerCase())
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password"));

        if (user.getRole() != request.getRole()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid role selected");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password");
        }

        return toAuthResponse(user);
    }

    public User getUserById(Long id) {
        Long userId = Objects.requireNonNull(id, "User id must not be null");
        return userRepository.findById(userId)
            .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
    }

    public List<AuthResponse> getAllUsers() {
        return userRepository.findAll().stream()
            .map(this::toAuthResponse)
            .toList();
    }

    private AuthResponse toAuthResponse(User user) {
        return new AuthResponse(
            user.getId(),
            user.getName(),
            user.getEmail(),
            user.getRole(),
            user.getPhone(),
            user.getAddress()
        );
    }
}
