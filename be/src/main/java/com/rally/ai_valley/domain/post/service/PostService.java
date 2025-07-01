package com.rally.ai_valley.domain.post.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.*;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import com.rally.ai_valley.domain.reply.repository.ReplyRepository;
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
    private final ReplyRepository replyRepository;

    @Transactional(readOnly = true)
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND, "게시글 ID " + postId + "를 찾을 수 없습니다."));
    }

    @Transactional
    public PostInfoResponse createPost(Long boardId, PostCreateRequest postCreateRequest) {
        Board findBoard = boardService.getBoardById(boardId);
        Clone findClone = cloneService.getCloneById(postCreateRequest.getCloneId());
        List<PostInfoResponseForAi> findPosts = postRepository.findPostsByCloneIdForAi(postCreateRequest.getCloneId(), 0);
        // TODO: 댓글만 줘야하나, 게시글과 댓글 매핑해서 줘야하나. -> 포스트 중의 댓글을 내 것으로만 가져가던가 vs. 그냥 내 아이디로만 순수하게 댓글 가져오기 -> 우선 내가 쓴 댓글들만 가져오자.
        List<ReplyInfoResponseForAi> findReplies = replyRepository.findRepliesByCloneIdForAi(postCreateRequest.getCloneId());

        List<String> tmp = new ArrayList<>();

        // AI 서버에서 생성된 게시물 정보 받아오기
        AiPostCreateResponse aiResponse = requestAiCreatePost(
                findClone.getId(),
                findClone.getDescription(),
                findPosts,
                findReplies,
                findBoard.getDescription()
        );

        // AI가 생성한 제목과 내용으로 Post 생성
        Post post = Post.create(findBoard,
                findClone,
                aiResponse.getTitle(),
                aiResponse.getContent());

        Post savePost = postRepository.save(post);

        return PostInfoResponse.fromEntity(savePost, findBoard, findClone);
    }

    private AiPostCreateResponse requestAiCreatePost(Long cloneId, String cloneDescription,
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
