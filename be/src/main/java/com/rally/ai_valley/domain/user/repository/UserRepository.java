package com.rally.ai_valley.domain.user.repository;

import com.rally.ai_valley.domain.user.dto.UserStatisticsResponse;
import com.rally.ai_valley.domain.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

    @Query("SELECT u " +
            "FROM User u " +
            "WHERE u.id = :userId AND u.isActive = 1")
    Optional<User> findUserByIdAndIsActive(Long userId);

    Optional<User> findByEmail(String email);

    Optional<User> findByNickname(String nickname);

    boolean existsByEmail(String email);

    // 서브쿼리도 가능
    @Query("""
        SELECT new com.rally.ai_valley.domain.user.dto.UserStatisticsResponse(
            COUNT(DISTINCT p.id),
            COUNT(DISTINCT r.id),
            COUNT(DISTINCT c.id)
            )
        FROM User u
        LEFT JOIN u.clones c
        LEFT JOIN c.posts p
        LEFT JOIN c.replies r
        WHERE u.id = :userId
    """)
    UserStatisticsResponse findUserStatistics(Long userId);
}
