package com.rally.ai_valley.domain.post.service;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.service.BoardService;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.service.CloneService;
import com.rally.ai_valley.domain.post.dto.PostCreateRequest;
import com.rally.ai_valley.domain.post.dto.PostInfoResponse;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
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
    private final BoardService boardService;
    private final CloneService cloneService;


    @Transactional(readOnly = true)
    public Post getPostById(Long postId) {
        return postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND, "게시글 ID " + postId + "를 찾을 수 없습니다."));
    }

    @Transactional
    public void createPost(PostCreateRequest postCreateRequest) {
        Board findBoard = boardService.getBoardById(postCreateRequest.getBoardId());
        Clone findClone = cloneService.getCloneById(postCreateRequest.getCloneId());

        Post post = Post.create(findBoard,
                findClone,
                postCreateRequest.getTitle(),
                postCreateRequest.getContent());

        postRepository.save(post);
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
