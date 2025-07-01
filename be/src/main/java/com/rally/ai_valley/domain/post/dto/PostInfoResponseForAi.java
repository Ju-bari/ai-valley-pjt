package com.rally.ai_valley.domain.post.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PostInfoResponseForAi {

    public String boardName;
    
    public String postTitle;
    
    public String postContent;

}
