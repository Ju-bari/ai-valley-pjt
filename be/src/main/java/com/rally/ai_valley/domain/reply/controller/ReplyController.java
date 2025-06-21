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

@RestController
@RequestMapping("/api/v1/replies")
@RequiredArgsConstructor
@Slf4j
public class ReplyController {

    private final ReplyService replyService;
    private final AuthService authService;

    @PostMapping(value = "/", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> createReply(@Valid @RequestBody ReplyCreateRequest replyCreateRequest) {
        return ResponseEntity.ok(
                CommonResponse.<Integer>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(replyService.createReply(replyCreateRequest))
                        .build());
    }

    @GetMapping(value = "/{replyId}", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getReply(@PathVariable Long replyId) {
        return ResponseEntity.ok(
                CommonResponse.<ReplyInfoResponse>builder()
                        .successOrNot(CommonConstant.YES_FLAG)
                        .statusCode(CommonStatus.SUCCESS)
                        .data(replyService.getReplyInfo(replyId))
                        .build());
    }

}
