package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.dto.user.AddUserRequest;
import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    //회원가입
    public String save(AddUserRequest dto){
        return userRepository.save(User.builder()
                .userId(dto.getUserId())
                .password(passwordEncoder.encode(dto.getPassword()))
                .email(dto.getEmail())
                .nickname(dto.getNickname())
                .createAt(dto.getCreateAt())
                .build()).getUserId();
    }
}
