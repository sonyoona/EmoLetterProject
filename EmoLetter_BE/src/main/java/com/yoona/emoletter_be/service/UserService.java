package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.user.UserResponse;
import com.yoona.emoletter_be.dto.user.UserUpdateRequest;
import com.yoona.emoletter_be.dto.user.UsersRegistRequest;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.exception.BusinessRuleException;
import com.yoona.emoletter_be.exception.InvalidCredentialsException;
import com.yoona.emoletter_be.repository.DiaryRepository;
import com.yoona.emoletter_be.repository.LetterRepository;
import com.yoona.emoletter_be.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final DiaryRepository diaryRepository;
    private final LetterRepository letterRepository;
    private final PasswordEncoder passwordEncoder;

    // 아이디가 틀렸든 비밀번호가 틀렸든 사용자에게는 이 문구 하나만 나간다.
    private static final String LOGIN_FAILED_MESSAGE = "아이디 또는 비밀번호가 올바르지 않습니다.";

    //유저 ID로 유저 검색
    public User findById(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("Unexpected user"));
    }

    //회원가입
    @Transactional
    public void registerUser(UsersRegistRequest usersRegistRequest) {
        //비밀번호 암호화
        usersRegistRequest.setPassword(passwordEncoder.encode(usersRegistRequest.getPassword()));

        userRepository.save(usersRegistRequest.toEntity());
    }


    //userId 기반 회원정보 조회
    public User findByUserId(String userId) {
        return userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("not founded userId: " + userId));
    }

    //비밀번호 변경
    @Transactional
    public void updatePassword(String userId, String oldPassword, String newPassword) {
        User users = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("not founded userId: " + userId));
        if (!passwordEncoder.matches(oldPassword, users.getPassword())) {
            // 401이 아니라 400인 이유:
            // 이 요청은 이미 인증을 통과했다(토큰은 멀쩡하다). 틀린 건 본문에 담아 보낸 값이다.
            // 401로 내보내면 프런트의 http.js가 "토큰이 만료됐다"로 오해해서
            // 토큰 재발급을 시도하고, 그마저 실패하면 사용자를 로그아웃시켜 버린다.
            // (로그인 실패는 정말로 인증이 안 된 상태이므로 그쪽은 401이 맞다.)
            throw new BusinessRuleException(
                    "현재 비밀번호가 올바르지 않습니다.",
                    "비밀번호 변경 실패 - 현재 비밀번호 불일치: " + userId);
        }
        users.updatePassword(passwordEncoder.encode(newPassword));
    }

    //사용자 정보 수정
    @Transactional
    public UserResponse updateUser(String userId, UserUpdateRequest userRequest) {
        User users = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("not founded userId: " + userId));

        //영속성 이용하여 정보 갱신
        users.updateUser(
                userRequest.getNickname()
        );

        return UserResponse.builder()
                .nickName(users.getNickname())
                .build();
    }

    /**
     * 사용자 탈퇴.
     *
     * diary/letter의 user_id는 NOT NULL 외래 키라서, user를 먼저 지우려 하면
     * 제약 위반으로 실패한다. (JPA cascade를 걸지 않았으므로 순서를 직접 지켜야 한다.)
     * 자식 -> 부모 순서로 지운다.
     */
    @Transactional
    public void deleteUser(String userId) {
        letterRepository.deleteByUser_UserId(userId);
        diaryRepository.deleteByUser_UserId(userId);
        userRepository.deleteById(userId);
    }

    //로그인 인증
    public UserResponse login (String userId, String password){
        // 아이디가 없을 때와 비밀번호가 틀릴 때 "같은" 문구를 내보낸다.
        // 다르게 응답하면 아이디가 존재하는지 여부를 외부에서 알아낼 수 있다.
        User users = userRepository.findById(userId)
                .orElseThrow(()-> new InvalidCredentialsException(
                        LOGIN_FAILED_MESSAGE,
                        "로그인 실패 - 존재하지 않는 userId: " + userId));

        if (!passwordEncoder.matches(password, users.getPassword())) {
            throw new InvalidCredentialsException(
                    LOGIN_FAILED_MESSAGE,
                    "로그인 실패 - 비밀번호 불일치: " + userId);
        }

        return UserResponse.builder()
                .userId(users.getUserId())
                .email(users.getEmail())
                .role(users.getRole())
                .nickName(users.getNickname())
                .createAt(users.getCreateAt())
                .build();
    }
}
