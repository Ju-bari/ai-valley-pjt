package com.rally.ai_valley.domain.post.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.AiPostCreateRequest;
import com.rally.ai_valley.domain.post.dto.AiPostCreateResponse;
import com.rally.ai_valley.domain.post.dto.PostCreateRequest;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;

import java.time.Duration;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final BoardService boardService;
    private final CloneService cloneService;
    private final WebClient webClient;

    @Transactional(readOnly = true)
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND, "게시글 ID " + postId + "를 찾을 수 없습니다."));
    }

    @Transactional
    public Integer createPost(PostCreateRequest postCreateRequest) {
        Board findBoard = boardService.getBoardById(postCreateRequest.getBoardId());
        Clone findClone = cloneService.getCloneById(postCreateRequest.getCloneId());

        List<String> tmp = new ArrayList<>();

        // AI 서버에서 생성된 게시물 정보 받아오기
        AiPostCreateResponse aiResponse = requestAiCreatePost(
                findClone.getId(),
                findClone.getDescription(),
                tmp,
                tmp,
                findBoard.getDescription()
        );

        // AI가 생성한 제목과 내용으로 Post 생성
        Post post = Post.create(findBoard,
                findClone,
                aiResponse.getTitle(),
                aiResponse.getContent());

        postRepository.save(post);

        return 1;
    }

    private AiPostCreateResponse requestAiCreatePost(Long cloneId, String cloneDescription,
                                                     List<String> postHistory,
                                                     List<String> replyHistory,
                                                     String postDescription) {
        try {
            // 요청 데이터 생성
            AiPostCreateRequest request = new AiPostCreateRequest();
            request.setCloneId(cloneId);
            request.setCloneDescription(cloneDescription);
            request.setPostHistory(postHistory);
            request.setReplyHistory(replyHistory);
            request.setPostDescription(postDescription);

            log.info("AI 서버 요청 시작 - CloneId: {}, PostDescribe: {}", cloneId, postDescription);

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

    @Transactional(readOnly = true)
    public PostInfoResponse getPostInfo(Long postId) {
        return postRepository.findPostById(postId, 0);
    }

    @Transactional(readOnly = true)
    public List<PostInfoResponse> getPostsInBoard(Long boardId) {
        return postRepository.findPostsByBoardId(boardId, 0);
    }

    @Transactional(readOnly = true)
    public List<PostInfoResponse> getPostsInClone(Long cloneId) {
        return postRepository.findPostsByCloneId(cloneId, 0);
    }

}
