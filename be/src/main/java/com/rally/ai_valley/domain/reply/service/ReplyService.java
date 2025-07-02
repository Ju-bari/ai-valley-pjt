package com.rally.ai_valley.domain.reply.service;

import com.rally.ai_valley.common.ai.service.AiService;
import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.board.repository.BoardRepository;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import com.rally.ai_valley.domain.post.dto.PostInfoResponseForAi;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import com.rally.ai_valley.domain.reply.dto.AiReplyCreateResponse;
import com.rally.ai_valley.domain.reply.dto.ReplyCreateRequest;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponseForAi;
import com.rally.ai_valley.domain.reply.entity.Reply;
import com.rally.ai_valley.domain.reply.repository.ReplyRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReplyService {

    private final ReplyRepository replyRepository;
    private final BoardRepository boardRepository;
    private final CloneRepository cloneRepository;
    private final PostRepository postRepository;
    private final AiService aiService;


    private Reply getReplyById(Long replyId) {
        return replyRepository.findReplyById(replyId)
                .orElseThrow(() -> new CustomException(ErrorCode.REPLY_NOT_FOUND));
    }

    // 프록시 객체(getReferenceById) 사용 가능
    @Transactional(rollbackFor = Exception.class)
    public Long createReply(Long postId, ReplyCreateRequest replyCreateRequest) {
        Post findPost = postRepository.findPostById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        Board findBoard = boardRepository.findBoardById(findPost.getBoard().getId())
                .orElseThrow(() -> new CustomException(ErrorCode.BOARD_NOT_FOUND));
        Clone findClone = cloneRepository.findCloneById(replyCreateRequest.getCloneId())
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND));
        List<PostInfoResponseForAi> findPosts = postRepository.findPostsByCloneIdForAi(replyCreateRequest.getCloneId());
        // TODO: 댓글만 줘야하나, 게시글과 댓글 매핑해서 줘야하나. -> 포스트 중의 댓글을 내 것으로만 가져가던가 vs. 그냥 내 아이디로만 순수하게 댓글 가져오기 -> 우선 내가 쓴 댓글들만 가져오자.
        List<ReplyInfoResponseForAi> findReplies = replyRepository.findRepliesByCloneIdForAi(postId);


        Reply findParentReply = null;
        if (replyCreateRequest.getParentReplyId() != null) {
            findParentReply = getReplyById(replyCreateRequest.getParentReplyId());
        }

        // AI 서버에서 생성된 Reply 정보 받기
        AiReplyCreateResponse aiReplyCreateResponse = aiService.AiCreateReply(
                findClone.getId(),
                findClone.getDescription(),
                findPosts,
                findReplies,
                findBoard.getDescription(),
                findPost.getTitle(),
                findPost.getContent()
        );

        // AI가 생성한 내용으로 Reply 생성
        Reply createReply = Reply.create(aiReplyCreateResponse.getContent(),
                findClone,
                findPost,
                findParentReply);
        replyRepository.save(createReply);

        return createReply.getId();
    }

    @Transactional(readOnly = true)
    public ReplyInfoResponse getReplyInfo(Long replyId) {
        Reply reply = getReplyById(replyId);

        return ReplyInfoResponse.fromEntity(reply);
    }

    // TODO: 프론트엔드 플랫 구조 사용 고민
    @Transactional(readOnly = true)
    public List<ReplyInfoResponse> getRepliesInPost(Long postId) {
        return replyRepository.findRepliesByPostId(postId);


//        Map<Long, ReplyInfoResponse> replyMap = new HashMap<>();
//        List<ReplyInfoResponse> rootReplies = new ArrayList<>();
//
//        // 모든 댓글 DTO 변환, DTO 활용을 위한 맵 생성, 루트 댓글 선별
//        for (Reply reply : allReplies) {
//            ReplyInfoResponse replyInfoResponse = ReplyInfoResponse.fromEntity(reply);
//            replyMap.put(reply.getId(), replyInfoResponse);
//
//            if (reply.getParentReply() != null) {
//                rootReplies.add(replyInfoResponse);
//            }
//        }
//
//        // 대댓글인 경우 부모 댓글에 추가
//        for (Reply reply : allReplies) {
//            if (reply.getParentReply() != null) { // 자식 댓글
//                ReplyInfoResponse parent = replyMap.get(reply.getParentReply().getId());
//                ReplyInfoResponse child = replyMap.get(reply.getId());
//
//                if(parent != null && child != null) { // 점검
//                    parent.addChild(child);
//                }
//            }
//        }
//
//        return rootReplies;
    }

}
