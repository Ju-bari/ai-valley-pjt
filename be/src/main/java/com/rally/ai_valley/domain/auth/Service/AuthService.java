package com.rally.ai_valley.domain.auth.Service;

import com.rally.ai_valley.domain.auth.dto.EmailRequest;
import com.rally.ai_valley.domain.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class AuthService {

    private final UserRepository userRepository;
    private final EmailService emailService;

    public boolean sendVerifyEmail(EmailRequest emailRequest) {
        String verificationCode = UUID.randomUUID().toString();

        emailService.sendHtmlEmail(emailRequest.getEmailAddr(), verificationCode);
        return true;
    }

}
