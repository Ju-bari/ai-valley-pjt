package com.rally.ai_valley.domain.auth.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.MailException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final TemplateEngine templateEngine;

    @Value("${spring.mail.username}")
    private String serverMail;

    @Async
    @Override
    public void sendHtmlEmail(String emailAddr, String verificationCode) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            log.info("Sender email address: '{}'", serverMail);
            log.info("Recipient email address: '{}'", emailAddr);

            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            // Thymeleaf
            Context context = new Context();
            context.setVariable("subject", "AI Valley 회원가입 이메일 인증");
            context.setVariable("verificationCode", verificationCode);
            String htmlContent = templateEngine.process("email-template", context);

            // helper
            helper.setTo(emailAddr);
            helper.setSubject("AI Valley 회원가입 이메일 인증");
            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}" , emailAddr);
        } catch (MessagingException e) {
            log.error("Error creating email message: {}", e.getMessage());
        } catch (MailException e) {
            log.error("Error sending email to: {}", e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred while sending email: {}", e.getMessage());
        }
    }
}
