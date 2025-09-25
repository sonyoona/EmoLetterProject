package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.user.UserResponse;
import com.yoona.emoletter_be.dto.user.UserUpdateRequest;
import com.yoona.emoletter_be.dto.user.UsersRegistRequest;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

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
            throw new IllegalArgumentException("Invalid Your Current Password!");
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
                userRequest.getUserId(),
                userRequest.getNickname()
        );

        return UserResponse.builder()
                .userId(users.getUserId())
                .nickName(users.getNickname())
                .build();
    }

    //사용자 탈퇴
    @Transactional
    public void deleteUser(String userId) {
        userRepository.deleteById(userId);
    }

    //로그인 인증
    public UserResponse login (String userId, String password){
        User users = userRepository.findById(userId)
                .orElseThrow(()-> new IllegalArgumentException("not founded userId: " + userId));
        if (passwordEncoder.matches(password,users.getPassword())){
            return UserResponse.builder()
                    .userId(users.getUserId())
                    .email(users.getEmail())
                    .role(users.getRole())
                    .nickName(users.getNickname())
                    .build();
        } else{
            throw new IllegalArgumentException("Invalid Password Your Id : " + userId);
        }
    }
}
