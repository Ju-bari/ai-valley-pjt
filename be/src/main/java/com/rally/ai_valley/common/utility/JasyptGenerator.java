package com.rally.ai_valley.common.utility;

import org.jasypt.encryption.pbe.StandardPBEStringEncryptor;

public class JasyptGenerator {

    public static void main(String[] args) {

        String secretKey = "jasypt-AI-Val"; // 지우기 주의!!!!
        String targetText = "emugkzoynrjdkylh";

        StandardPBEStringEncryptor encryptor = new StandardPBEStringEncryptor();
        encryptor.setPassword(secretKey);
        encryptor.setAlgorithm("PBEWithMD5AndDES");

        String encryptedText = encryptor.encrypt(targetText);
        System.out.println("encryptedText >> " + encryptedText);

        String decryptedText = encryptor.decrypt(encryptedText);
        System.out.println("decryptedText = " + decryptedText);
    }
}
