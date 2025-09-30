package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.diary.AddDiaryRequest;
import com.yoona.emoletter_be.dto.diary.UpdateDiaryRequest;
import com.yoona.emoletter_be.entity.Diary;
import com.yoona.emoletter_be.repository.DiaryRepository;
import com.yoona.emoletter_be.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import com.yoona.emoletter_be.entity.User;


@Service //빈으로 등록
@RequiredArgsConstructor // final이 붙거나 NotNull이 붙은 필드의 생성자 추가
public class DiaryService {
    private final DiaryRepository diaryRepository;
    private final UserRepository userRepository;

    //일기 추가
//    public Diary save(AddDiaryRequest request) {
//        return diaryRepository.save(request.toEntity());
//    }

    // 일기 추가 (메서드 시그니처 변경: authenticatedUserId 추가)
    @Transactional
    public Diary save(AddDiaryRequest request, String authenticatedUserId) {
        // 1. 인증된 사용자 ID로 User 엔티티를 조회합니다.
        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated User not found with ID: " + authenticatedUserId));

        // 2. Diary 엔티티를 User 객체를 포함하여 생성합니다.
        Diary diary = Diary.builder()
                .content(request.getContent())
                .emojiCode(request.getEmojiCode())
                .user(user) // User 객체를 전달
                .build();

        return diaryRepository.save(diary);
    }


    //일기 전체 조회
    public List<Diary> findByUserId(String userId) {
        // 이 메서드를 사용하도록 Controller의 findAll()을 수정해야 합니다.
        diaryRepository.findByUser_UserId(userId); //와 같은 메서드를 사용할 수 있습니다.
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
