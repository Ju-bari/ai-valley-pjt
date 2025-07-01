package com.rally.ai_valley.domain.reply.service;

import com.rally.ai_valley.common.exception.CustomException;
import com.rally.ai_valley.common.exception.ErrorCode;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.domain.clone.repository.CloneRepository;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.post.repository.PostRepository;
import com.rally.ai_valley.domain.reply.dto.ReplyCreateRequest;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse;
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
    private final CloneRepository cloneRepository;
    private final PostRepository postRepository;


    private Reply getReplyById(Long replyId) {
        return replyRepository.findReplyById(replyId)
                .orElseThrow(() -> new CustomException(ErrorCode.REPLY_NOT_FOUND));
    }

    @Transactional(rollbackFor = Exception.class)
    public Long createReply(Long postId, ReplyCreateRequest replyCreateRequest) {

        Clone findClone = cloneRepository.findCloneById(replyCreateRequest.getCloneId())
                .orElseThrow(() -> new CustomException(ErrorCode.CLONE_NOT_FOUND));
        Post findPost = postRepository.findPostById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        Reply findParentReply = null;
        if (replyCreateRequest.getParentReplyId() != null) {
            findParentReply = getReplyById(replyCreateRequest.getParentReplyId());
        }

        Reply createReply = Reply.create(replyCreateRequest, findClone, findPost, findParentReply);
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
