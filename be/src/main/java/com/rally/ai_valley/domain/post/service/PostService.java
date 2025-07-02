package com.rally.ai_valley.domain.post.service;

import com.rally.ai_valley.common.ai.service.AiService;
import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.repository.BoardRepository;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import com.rally.ai_valley.domain.post.dto.AiPostCreateResponse;
import com.rally.ai_valley.domain.post.dto.PostCreateRequest;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.dto.PostInfoResponseForAi;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import com.rally.ai_valley.domain.reply.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PostService {

    private final PostRepository postRepository;
    private final ReplyRepository replyRepository;
    private final BoardRepository boardRepository;
    private final CloneRepository cloneRepository;
    private final AiService aiService;

    @Transactional(readOnly = true)
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND, "게시글 ID " + postId + "를 찾을 수 없습니다."));
    }

    @Transactional
    public PostInfoResponse createPost(Long boardId, PostCreateRequest postCreateRequest) {
        Board findBoard = boardRepository.findBoardById(boardId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));
        Clone findClone = cloneRepository.findCloneById(postCreateRequest.getCloneId())
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND));
        List<PostInfoResponseForAi> findPosts = postRepository.findPostsByCloneIdForAi(postCreateRequest.getCloneId());
        // TODO: 댓글만 줘야하나, 게시글과 댓글 매핑해서 줘야하나. -> 포스트 중의 댓글을 내 것으로만 가져가던가 vs. 그냥 내 아이디로만 순수하게 댓글 가져오기 -> 우선 내가 쓴 댓글들만 가져오자.
        List<ReplyInfoResponseForAi> findReplies = replyRepository.findRepliesByCloneIdForAi(postCreateRequest.getCloneId());

        // AI 서버에서 생성된 Post 정보로받기
        AiPostCreateResponse aiPostCreateResponse = aiService.AiCreatePost(
                findClone.getId(),
                findClone.getDescription(),
                findPosts,
                findReplies,
                findBoard.getDescription()
        );

        // AI가 생성한 내용으 Post 생성
        Post post = Post.create(findBoard,
                findClone,
                aiPostCreateResponse.getTitle(),
                aiPostCreateResponse.getContent());

        Post savePost = postRepository.save(post);

        return PostInfoResponse.fromEntity(savePost, findBoard, findClone);
    }

    @Transactional(readOnly = true)
    public PostInfoResponse getPostInfo(Long postId) {
        return postRepository.findPostByPostId(postId);
    }

    @Transactional(readOnly = true)
    public List<PostInfoResponse> getPostsInBoard(Long boardId) {
        return postRepository.findPostsByBoardId(boardId);
    }

    @Transactional(readOnly = true)
    public List<PostInfoResponse> getPostsInClone(Long cloneId) {
        return postRepository.findPostsByCloneId(cloneId);
    }

}
