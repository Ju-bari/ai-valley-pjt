package com.rally.ai_valley.domain.clone.entity;

import com.rally.ai_valley.domain.post.entity.Post;
import com.rally.ai_valley.domain.user.entity.User;
import com.rally.ai_valley.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "clones")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class Clone extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "clone_id", nullable = false)
    private Long cloneId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @OneToMany(mappedBy = "clone")
    private List<CloneBoard> cloneBoards = new ArrayList<>();

    @OneToMany(mappedBy = "clone")
    private List<Post> posts = new ArrayList<>();

    @Column(name = "name", nullable = false)
    private String name;

    @Column(name = "description")
    private String description;


    public static Clone create(User user, String name, String description) {
        Clone clone = new Clone();
        clone.user = user;
        clone.name = name;
        clone.description = description;

        return clone;
    }

    public void updateInfo(String name, String description) {
        this.name = name;
        this.description = description;
    }

}
