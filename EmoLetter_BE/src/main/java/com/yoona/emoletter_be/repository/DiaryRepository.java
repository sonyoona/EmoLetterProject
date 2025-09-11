package com.yoona.emoletter_be.repository;

import com.yoona.emoletter_be.entity.Diary;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DiaryRepository extends JpaRepository<Diary, Long> {

}
