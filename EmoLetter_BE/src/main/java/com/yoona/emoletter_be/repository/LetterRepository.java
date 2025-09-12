package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.Letter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LetterRepository extends JpaRepository<Letter, Long> {
    // isOpened 필드의 값과 일치하는 모든 Letter를 조회하는 메소드
    // true를 넘기면 열린 편지만, false를 넘기면 닫힌 편지만 조회됩니다.
    List<Letter> findByIsOpened(boolean isOpened);
}
