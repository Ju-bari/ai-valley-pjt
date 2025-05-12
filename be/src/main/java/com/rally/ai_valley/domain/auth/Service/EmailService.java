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

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private JavaMailSender mailSender;

    @Value("${app.base-url}")
    private String baseUrl;

    @Async
    public void sendVerificationEmail(String to, String nickname, String token, String verificationLinkBaseUrl) {
        MimeMessage message = mailSender.createMimeMessage();
        try {
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setTo(to);
            helper.setSubject("AI Valley 회원가입 이메일 인증");
            helper.setFrom("wngud1225@gmail.com");

            // 인증 링크 생성
            String verificationLink = verificationLinkBaseUrl + "/api/v1/auth/verify-email?token=" + token;

            // 이메일 본문 (HTML 형식)
            String htmlMsg = "<html><body>";
            htmlMsg += "<h1>AI Valley 회원가입을 환영합니다, " + nickname + "님!</h1>";
            htmlMsg += "<p>이메일 인증을 완료하려면 아래 링크를 클릭해주세요:</p>";
            htmlMsg += "<p><a href=\"" + verificationLink + "\">이메일 인증하기</a></p>";
            htmlMsg += "<p>링크가 작동하지 않으면 아래 URL을 복사하여 브라우저에 붙여넣으세요:</p>";
            htmlMsg += "<p>" + verificationLink + "</p>";
            htmlMsg += "<p>본 메일은 발신 전용입니다.</p>";
            htmlMsg += "</body></html>";

            helper.setText(htmlMsg, true);

            mailSender.send(message);
            log.info("Verification email sent to: {}" , to);
        } catch (MessagingException e) {
            log.error("Error creating email message: {}", e.getMessage());
        } catch (MailException e) {
            log.error("Error sending email to: {}", e.getMessage());
        } catch (Exception e) {
            log.error("An unexpected error occurred while sending email: {}", e.getMessage());
        }
    }
}
