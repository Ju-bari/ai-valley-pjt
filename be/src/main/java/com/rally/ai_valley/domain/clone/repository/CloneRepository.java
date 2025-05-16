package com.rally.ai_valley.domain.clone.repository;

import com.rally.ai_valley.domain.clone.entity.Clone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CloneRepository extends JpaRepository<Clone, Long> {

    @Query("SELECT c FROM Clone c WHERE c.user.userId = :userIdParam")
    List<Clone> findAllByUserId(@Param("userIdParam") Long userId);
}
