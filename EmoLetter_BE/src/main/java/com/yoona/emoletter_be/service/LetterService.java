package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.letter.AddLetterRequest;
import com.yoona.emoletter_be.dto.letter.UpdateLetterRequest;
import com.yoona.emoletter_be.entity.Letter;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.LetterRepository;
import com.yoona.emoletter_be.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.scheduling.annotation.Scheduled; //@Scheduled 임포트

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor // final이 붙거나 NotNull이 붙은 필드의 생성자 추가
public class LetterService {
    private final LetterRepository letterRepository;
    private final UserRepository userRepository;

    //편지 생성
    @Transactional
    public Letter save(AddLetterRequest request, String authenticatedUserId) {
        // 1. 인증된 사용자 ID (authenticatedUserId)로 User 엔티티를 조회합니다.
        User user = userRepository.findById(authenticatedUserId)
                .orElseThrow(() -> new IllegalArgumentException("Authenticated User not found with ID: " + authenticatedUserId));

        // 2. Letter 엔티티를 생성합니다.
        Letter letter = Letter.builder()
                .content(request.getContent())
                .deliverDate(request.getDeliverDate())
                .noteCode(request.getNoteCode())
                .user(user) // 조회된 User 객체를 전달
                .build();

        return letterRepository.save(letter);
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



    // 새로운 알림 API용 메서드: isDelivered=true, isOpened=false인 편지만 조회
    public List<Letter> findReadyToOpenLetters() {
        // 이미 배달 시간이 지나서 (스케줄러에 의해) isDelivered=true가 되었고, 아직 열리지 않은 편지들을 찾습니다.
        return letterRepository.findByIsDeliveredTrueAndIsOpenedFalse();
    }


     // [수정된 스케줄러] 배달 시간이 지난 편지의 상태를 '배달 완료'로 변경 (isDelivered = true)
     // isOpened는 변경하지 않습니다.
    @Scheduled(cron = "0 * * * * *") // 매분 0초에 실행
    @Transactional
    public void processDeliveredLetters() {
        LocalDateTime now = LocalDateTime.now();
        // deliverDate가 현재 시간 이전(Before)이고 아직 isDelivered=false인 편지 조회
        // 현재 시간이 deliverDate를 넘었다
        List<Letter> readyToDeliverLetters = letterRepository.findByDeliverDateBeforeAndIsDeliveredFalse(now);

        if (!readyToDeliverLetters.isEmpty()) {
            System.out.println(String.format("[%s] %d개의 편지를 '배달 완료' (isDelivered=true)로 업데이트 시작.", now, readyToDeliverLetters.size()));

            for (Letter letter : readyToDeliverLetters) {
                // isDelivered 상태만 true로 변경
                letter.updateIsDelivered(true);

                // 여기에 알림 메시지 발송 로직을 추가합니다. (예: FCM/Push 알림)
                // notificationService.sendNotification(letter.getUser().getUserId(), "과거의 나로부터 편지가 도착했어요!");
            }
            System.out.println("업데이트 완료.");
        }
    }
}
