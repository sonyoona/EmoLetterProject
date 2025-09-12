package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.letter.AddLetterRequest;
import com.yoona.emoletter_be.dto.letter.UpdateLetterRequest;
import com.yoona.emoletter_be.entity.Letter;
import com.yoona.emoletter_be.repository.LetterRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor // final이 붙거나 NotNull이 붙은 필드의 생성자 추가
public class LetterService {
    private final LetterRepository letterRepository;

    //편지 생성
    public Letter save(AddLetterRequest request) {
        return letterRepository.save(request.toEntity());
    }

    //전체 편지 조회
    // 열린 편지인지 닫힌 편지인지에 따라 나뉩
    // return 값이 없는 경우 예외처리 필요
    public List<Letter> findLetters(boolean isOpened) {
        return letterRepository.findByIsOpened(isOpened);
    }

    //상세 편지 조회 및 상태 변경
    @Transactional // 이 메소드가 끝날 때까지의 모든 DB 작업을 하나의 단위로 묶어줍니다.
    public Letter findLetterById(Long letterId) {
        // 1. ID로 편지를 조회합니다. 없으면 예외를 발생시킵니다.
        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new IllegalArgumentException("not Founded letterId=" + letterId));

        // 2. 만약 편지가 열리지 않은 상태(false)라면, 열린 상태(true)로 변경합니다.
        if (!letter.isOpened()) {
            letter.updateIsOpened(true); // 엔티티의 상태 변경 메소드 호출
        }

        // 3. 편지 객체를 반환합니다.
        return letter;
    }

    //편지 내용 수정
    @Transactional
    public Letter updateById(Long letterId, UpdateLetterRequest request) {
        Letter letter = letterRepository.findById(letterId)
                .orElseThrow(() -> new IllegalArgumentException("LetterId not found: " + letterId));
        letter.update(request.getContent(), request.getDeliverDate(), request.getCreateAt(), request.getNoteCode());

        return letter;
    }

    //편지 삭제
    public void deleteById(Long id) {
        letterRepository.deleteById(id);
    }

}
