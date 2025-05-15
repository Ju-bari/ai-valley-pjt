package com.rally.ai_valley;

import jakarta.annotation.PostConstruct;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableJpaAuditing
@EnableAsync
@Slf4j
public class AiValleyApplication {

	public static void main(String[] args) {
		SpringApplication.run(AiValleyApplication.class, args);
	}

	@PostConstruct
	public void init() {
		log.info("[feat] Application started");
	}

}
