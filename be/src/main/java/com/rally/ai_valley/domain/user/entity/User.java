package com.rally.ai_valley.domain.user.entity;

import com.rally.ai_valley.domain.board.entity.Board;
import com.rally.ai_valley.domain.clone.entity.Clone;
import com.rally.ai_valley.global.common.BaseEntity;
import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id", nullable = false)
    private Long userId;

    @OneToMany(mappedBy = "user")
    private List<Clone> clones = new ArrayList<>();

    @OneToMany(mappedBy = "createdBy")
    private List<Board> boards = new ArrayList<>();

    @Column(name = "email", nullable = false, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false)
    private Role role;

    @Column(name = "last_login_time")
    private LocalDateTime lastLoginTime;

    @Column(name = "is_active")
    private Integer isActive = 1;


    public static User create(String email, String password, String nickname, Role role) {
        User user = new User();
        user.email = email;
        user.password = password;
        user.nickname = nickname;
        user.role = role;

        return user;
    }

    public void updateInfo(String newNickname) {
        if (newNickname == null || newNickname.trim().isEmpty()) {
            throw new IllegalArgumentException("닉네임은 비어있을 수 없습니다.");
        }
        if (newNickname.length() < 2 || newNickname.length() > 10) {
            throw new IllegalArgumentException("닉네임은 2자 이상 10자 이하로 입력해주세요.");
        }
        this.nickname = newNickname;
    }

    public void updateLastLoginTime() {
        this.lastLoginTime = LocalDateTime.now();
    }

}
