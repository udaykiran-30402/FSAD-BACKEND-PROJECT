package com.tribalconnect.dto;

import com.tribalconnect.model.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private Long id;
    private String name;
    private String email;
    private Role role;
    private String phone;
    private String address;
}
