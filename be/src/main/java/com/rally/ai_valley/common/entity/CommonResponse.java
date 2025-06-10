package com.rally.ai_valley.common.entity;

import com.rally.ai_valley.common.constant.Status;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

@Data
@Builder
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CommonResponse<T> {

    private String successOrNot;
    private Status statusCode;

    private T data;

}
