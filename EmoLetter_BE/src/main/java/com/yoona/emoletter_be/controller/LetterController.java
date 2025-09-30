package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.letter.AddLetterRequest;
import com.yoona.emoletter_be.dto.letter.LetterResponse;
import com.yoona.emoletter_be.dto.letter.UpdateLetterRequest;
import com.yoona.emoletter_be.entity.Letter;
import com.yoona.emoletter_be.service.LetterService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.security.Principal;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/letter")
public class LetterController {
    private final LetterService letterService;

    // 저장
    @PostMapping()
    public ResponseEntity<Letter> saveLetter(@RequestBody AddLetterRequest request, Principal principal) {
        // Principal 객체에서 사용자 ID를 가져옵니다.
        // (User 엔티티가 UserDetails를 구현하고 getUsername()이 userId를 반환하기 때문)
        String userId = principal.getName();
        Letter savedLetter = letterService.save(request, userId);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedLetter);
    }

    //전체 조회
    @GetMapping()
    public ResponseEntity<List<LetterResponse>> getAllLetters(@RequestParam boolean isOpened) {
        List<LetterResponse> letters = letterService.findLetters(isOpened)
                .stream()
                .map(LetterResponse::new)
                .toList();

        return ResponseEntity.ok()
                .body(letters);
    }

    //상세 조회 및 isOpened수정
    @GetMapping("/{letterId}")
    public ResponseEntity<LetterResponse> getLetter(@PathVariable("letterId") Long letterId) {
        Letter letter = letterService.findLetterById(letterId);

        return ResponseEntity.ok()
                .body(new LetterResponse(letter));
    }

    //내용 수정
    @PutMapping("/{letterId}")
    public ResponseEntity<Letter> updateLetter(@PathVariable("letterId") Long letterId,
                                              @RequestBody UpdateLetterRequest request) {
        Letter updatedLetter = letterService.updateById(letterId, request);

        return ResponseEntity.ok()
                .body(updatedLetter);
    }

    //삭제
    @DeleteMapping("/{letterId}")
    public ResponseEntity<Void> deleteLetter(@PathVariable("letterId") Long letterId) {
        letterService.deleteById(letterId);
        return ResponseEntity.ok()
                .build();
    }

    // 알림을 띄울 수 있는 (배달 완료 & 미개봉) 편지 목록 조회
    @GetMapping("/notification")
    public ResponseEntity<List<LetterResponse>> getReadyToOpenLetters() {
        // isDelivered=true 이고 isOpened=false 인 편지들만 조회하여 알림 용도로 사용합니다.
        List<LetterResponse> letters = letterService.findReadyToOpenLetters()
                .stream()
                .map(LetterResponse::new)
                .toList();

        return ResponseEntity.ok()
                .body(letters);
    }


}
