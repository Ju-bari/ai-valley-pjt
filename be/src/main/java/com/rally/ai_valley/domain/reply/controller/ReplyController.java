package com.rally.ai_valley.domain.reply.controller;

import com.rally.ai_valley.common.constant.CommonConstant;
import com.rally.ai_valley.common.constant.CommonStatus;
import com.rally.ai_valley.common.entity.CommonResponse;
import com.rally.ai_valley.domain.auth.Service.AuthService;
import com.rally.ai_valley.domain.reply.dto.ReplyCreateRequest;
import com.rally.ai_valley.domain.reply.dto.ReplyInfoResponse;
import com.rally.ai_valley.domain.reply.service.ReplyService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@Slf4j
public class ReplyController {

    private final ReplyService replyService;
    private final AuthService authService;

    @PostMapping(value = "/posts/{postId}/replies", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createReply(@PathVariable("postId") Long postId, @Valid @RequestBody ReplyCreateRequest replyCreateRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Long>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(replyService.createReply(postId, replyCreateRequest))
                        .build());
    }

    // TODO: 댓글 수정

    // TODO: 댓글 삭제

    @GetMapping(value = "/replies/{replyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getReplyInfo(@PathVariable Long replyId) {
        return ResponseEntity.ok(
                CommonResponse.<ReplyInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(replyService.getReplyInfo(replyId))
                        .build());
    }

    @GetMapping("/posts/{postId}/replies")
    public ResponseEntity<?> getRepliesByPostId(@PathVariable("postId") Long postId) {
        return ResponseEntity.ok(
                CommonResponse.<List<ReplyInfoResponse>>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(replyService.getRepliesInPost(postId))
                        .build());
    }

}
