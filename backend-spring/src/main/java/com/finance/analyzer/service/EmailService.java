package com.finance.analyzer.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import java.util.logging.Logger;

@Service
public class EmailService {

    private static final Logger logger = Logger.getLogger(EmailService.class.getName());
    private static final int MAX_RETRIES = 3;
    private static final long RETRY_DELAY_MS = 500;

    @Autowired
    private JavaMailSender mailSender;

    @Value("${app.mail.from:smartfinanceanalyzer@gmail.com}")
    private String senderEmail;

    /**
     * Send OTP email with retry logic
     */
    public boolean sendOtpEmail(String email, String otp) {
        return sendEmailWithRetry(
                email,
                "Email Verification OTP - Smart Finance Analyzer",
                buildOtpEmailBody(otp),
                "OTP");
    }

    /**
     * Send password reset email with retry logic
     */
    public boolean sendPasswordResetEmail(String email, String otp) {
        return sendEmailWithRetry(
                email,
                "Password Reset OTP - Smart Finance Analyzer",
                buildPasswordResetEmailBody(otp),
                "Password Reset");
    }

    /**
     * Send email with retry logic for reliability
     */
    private boolean sendEmailWithRetry(String email, String subject, String body, String type) {
        int attempt = 0;
        while (attempt < MAX_RETRIES) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setFrom(senderEmail);
                message.setTo(email);
                message.setSubject(subject);
                message.setText(body);

                mailSender.send(message);
                logger.info(type + " email sent successfully to: " + email);
                return true;

            } catch (Exception e) {
                attempt++;
                logger.warning("Attempt " + attempt + " failed to send " + type + " email to " + email + ": "
                        + e.getMessage());

                if (attempt < MAX_RETRIES) {
                    try {
                        Thread.sleep(RETRY_DELAY_MS);
                    } catch (InterruptedException ie) {
                        Thread.currentThread().interrupt();
                        logger.severe("Email retry interrupted for " + email);
                        return false;
                    }
                }
            }
        }

        logger.severe("Failed to send " + type + " email to " + email + " after " + MAX_RETRIES + " attempts");
        return false;
    }

    /**
     * Build OTP email body
     */
    private String buildOtpEmailBody(String otp) {
        return "Hello,\n\n" +
                "Your OTP for email verification is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes only.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Smart Finance Analyzer Team";
    }

    /**
     * Build password reset email body
     */
    private String buildPasswordResetEmailBody(String otp) {
        return "Hello,\n\n" +
                "Your OTP for password reset is: " + otp + "\n\n" +
                "This OTP is valid for 5 minutes only.\n\n" +
                "If you did not request this, please ignore this email.\n\n" +
                "Best regards,\n" +
                "Smart Finance Analyzer Team";
    }
}
