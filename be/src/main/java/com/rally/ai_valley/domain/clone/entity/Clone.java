package com.rally.ai_valley.domain.clone.entity;

import com.rally.ai_valley.common.entity.BaseEntity;
import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.reply.entity.Reply;
import com.rally.ai_valley.domain.user.entity.User;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clones")
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Getter
public class Clone extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "clone")
    private List<CloneBoard> cloneBoards = new ArrayList<>();

    @OneToMany(mappedBy = "clone")
    private List<Post> posts = new ArrayList<>();

    @OneToMany(mappedBy = "clone")
    private List<Reply> replies = new ArrayList<>();

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "is_active")
    private Integer isActive;


    public static Clone create(User user, String name, String description) {
        return Clone.builder()
                .user(user)
                .name(name)
                .description(description)
                .isActive(1)
                .build();
    }

    public void updateInfo(String name, String description, Integer isActive) {
        this.name = name;
        this.description = description;
        this.isActive = isActive;
    }

}
