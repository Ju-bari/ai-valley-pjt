package com.rally.ai_valley.common.ai.service;

import com.rally.ai_valley.domain.post.dto.AiPostCreateRequest;
import com.rally.ai_valley.domain.post.dto.AiPostCreateResponse;
import com.rally.ai_valley.domain.post.dto.PostInfoResponseForAi;
import com.rally.ai_valley.domain.reply.dto.AiReplyCreateRequest;
import com.rally.ai_valley.domain.reply.dto.AiReplyCreateResponse;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class AiService {

    private final WebClient webClient;


    public AiPostCreateResponse AiCreatePost(Long cloneId,
                                             String cloneDescription,
                                             List<PostInfoResponseForAi> postHistory,
                                             List<ReplyInfoResponseForAi> replyHistory,
                                             String boardDescription) {
        try {
            // 요청 데이터 생성
            AiPostCreateRequest request = new AiPostCreateRequest();
            request.setCloneId(cloneId);
            request.setCloneDescription(cloneDescription);
            request.setPostHistory(postHistory);
            request.setReplyHistory(replyHistory);
            request.setBoardDescription(boardDescription);

            log.info("AI 서버 요청 시작 - CloneId: {}, PostDescribe: {}", cloneId, boardDescription);

            return webClient
                    .post()
                    .uri("/post")
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response -> {
                        log.error("AI 서버 오류 응답 - Status: {}", response.statusCode());
                        return response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("AI 서버 오류 내용: {}", errorBody);
                                    return Mono.error(new RuntimeException(
                                            "AI 서버 오류: " + response.statusCode() + " - " + errorBody));
                                });
                    })
                    .bodyToMono(AiPostCreateResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .doOnSuccess(response -> log.info("AI 서버 응답 성공 - Title: {} \n Contnet: {}",
                            response != null ? response.getTitle() : "null",
                            response.getContent() != null ? response.getContent() : "null"))
                    .doOnError(error -> log.error("AI 서버 호출 실패: {}", error.getMessage()))
                    .block(); // 동기 처리

        } catch (Exception e) {
            log.error("AI 서버 호출 중 예외 발생", e);
            throw new RuntimeException("AI 서버 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }

    public AiReplyCreateResponse AiCreateReply(Long cloneId,
                                               String cloneDescription,
                                               List<PostInfoResponseForAi> postHistory,
                                               List<ReplyInfoResponseForAi> replyHistory,
                                               String boardDescription,
                                               String postTitle,
                                               String postContent) {
        try {
            // 댓글 생성을 위한 요청 데이터 생성
            AiReplyCreateRequest request = new AiReplyCreateRequest();
            request.setCloneId(cloneId);
            request.setCloneDescription(cloneDescription);
            request.setPostHistory(postHistory);
            request.setReplyHistory(replyHistory);
            request.setBoardDescription(boardDescription);
            request.setPostTitle(postTitle);
            request.setPostContent(postContent);

            log.info("AI 서버 댓글 생성 요청 시작 - CloneId: {}, PostTitle: {}", cloneId, postTitle);

            // WebClient를 사용하여 AI 서버에 POST 요청
            return webClient
                    .post()
                    .uri("/reply") // 댓글 생성 엔드포인트로 가정
                    .bodyValue(request)
                    .retrieve()
                    .onStatus(HttpStatusCode::isError, response -> {
                        log.error("AI 서버 오류 응답 - Status: {}", response.statusCode());
                        return response.bodyToMono(String.class)
                                .flatMap(errorBody -> {
                                    log.error("AI 서버 오류 내용: {}", errorBody);
                                    return Mono.error(new RuntimeException(
                                            "AI 서버 오류: " + response.statusCode() + " - " + errorBody));
                                });
                    })
                    .bodyToMono(AiReplyCreateResponse.class)
                    .timeout(Duration.ofSeconds(30))
                    .doOnSuccess(response -> log.info("AI 서버 댓글 생성 응답 성공 - Content: {}",
                            response != null ? response.getContent() : "null"))
                    .doOnError(error -> log.error("AI 서버 댓글 생성 호출 실패: {}", error.getMessage()))
                    .block(); // 동기 처리

        } catch (Exception e) {
            log.error("AI 서버 댓글 생성 호출 중 예외 발생", e);
            throw new RuntimeException("AI 서버 댓글 생성 호출 중 오류 발생: " + e.getMessage(), e);
        }
    }

}
