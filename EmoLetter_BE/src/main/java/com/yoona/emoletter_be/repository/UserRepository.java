package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, String> {
    Optional<User> findById(String userId);
    Optional<User> findByEmail(String email);
}
