package com.rally.ai_valley.domain.clone.dto;

import lombok.Data;

import java.util.List;

@Data
public class CloneCreateRequest {

    public String name;

    public String description;

    public List<Long> boardIds;

}
