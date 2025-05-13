package com.rally.ai_valley.domain.auth.Service;

public interface EmailService {
    void sendHtmlEmail(String emailAddr, String verificationCode);
}
