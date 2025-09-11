package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.diary.AddDiaryRequest;
import com.yoona.emoletter_be.dto.diary.DiaryResponse;
import com.yoona.emoletter_be.dto.diary.UpdateDiaryRequest;
import com.yoona.emoletter_be.entity.Diary;
import com.yoona.emoletter_be.service.DiaryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController//Http Res Body에 객체 데이터를 json 형식으로 반환하는 컨트롤러
@RequiredArgsConstructor
@RequestMapping("/api/diary")
public class DiaryController {
    private final DiaryService diaryService;

    //저장
    @PostMapping()
    public ResponseEntity<Diary> addDiary(@RequestBody AddDiaryRequest request) {
        // 디버깅을 위해 추가
        System.out.println("Received emojiCode: " + request.getEmojiCode());
        System.out.println("Received content: " + request.getContent());
        Diary savedDiary = diaryService.save(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedDiary);
    }

    //전체 조회
    @GetMapping()
    public ResponseEntity<List<DiaryResponse>> getAllDiarys() {
        List<DiaryResponse> diarys = diaryService.findAll()
                .stream()
                .map(DiaryResponse::new)
                .toList();

        return ResponseEntity.ok()
                .body(diarys);
    }

    //상세 조회
    @GetMapping("/{diaryId}")
    public ResponseEntity<DiaryResponse> getDiary(@PathVariable("diaryId") Long diaryId) {
        Diary diary = diaryService.findById(diaryId);

        return ResponseEntity.ok()
                .body(new DiaryResponse(diary));
    }

    //수정
    @PutMapping("/{diaryId}")
    public ResponseEntity<Diary> updateDiary(@PathVariable("diaryId") Long diaryId,
                                             @RequestBody UpdateDiaryRequest request) {
        Diary updatedDiary = diaryService.updateById(diaryId, request);

        return ResponseEntity.ok()
                .body(updatedDiary);
    }

    //삭제
    @DeleteMapping("/{diaryId}")
    public ResponseEntity<Void> deleteDiary(@PathVariable("diaryId") Long diaryId) {
        diaryService.deleteById(diaryId);
        return ResponseEntity.ok()
                .build();
    }

}
