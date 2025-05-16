package com.rally.ai_valley.domain.clone.controller;

import com.rally.ai_valley.domain.clone.dto.CloneCreateRequest;
import com.rally.ai_valley.domain.clone.dto.CloneInfoResponse;
import com.rally.ai_valley.domain.clone.service.CloneService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/clones")
@RequiredArgsConstructor
@Slf4j
public class CloneController {

    private final CloneService cloneService;

    @PostMapping("/")
    public ResponseEntity<?> createClone(@RequestBody CloneCreateRequest cloneCreateRequest) {
        cloneService.createClone(cloneCreateRequest);

        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    @GetMapping("/{cloneId}")
    public ResponseEntity<?> getClones(@PathVariable Long cloneId) {
        CloneInfoResponse cloneInfoResponse = cloneService.getCloneInfo(cloneId);

        return ResponseEntity.ok(cloneInfoResponse);
    }

}
