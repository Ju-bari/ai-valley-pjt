package com.rally.ai_valley.domain.auth.dto;

import lombok.Data;

@Data
public class LoginRequest {

    String email;
    String password;

}
