package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.diary.AddDiaryRequest;
import com.yoona.emoletter_be.dto.diary.UpdateDiaryRequest;
import com.yoona.emoletter_be.entity.Diary;
import com.yoona.emoletter_be.repository.DiaryRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service //빈으로 등록
@RequiredArgsConstructor // final이 붙거나 NotNull이 붙은 필드의 생성자 추가
public class DiaryService {
    private final DiaryRepository diaryRepository;

    //일기 추가
    public Diary save(AddDiaryRequest request) {
        return diaryRepository.save(request.toEntity());
    }

    //일기 전체 조회
    public List<Diary> findAll() {
        return diaryRepository.findAll();
    }

    //일기 상세 조회
    public Diary findById(Long id) {
        return diaryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DiaryId not found: " + id));
    }

    //일기 수정
    @Transactional
    public Diary updateById(Long id, UpdateDiaryRequest request) {
        Diary diary = diaryRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("DiaryId not found: " + id));
        diary.update(request.getContent(), request.getCreateAt(), request.getEmojiCode());

        return diary;
    }

    //일기 삭제
    public void deleteById(Long id) {
        diaryRepository.deleteById(id);
    }
}
