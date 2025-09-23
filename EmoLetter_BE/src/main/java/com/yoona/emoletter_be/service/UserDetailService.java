package com.yoona.emoletter_be.service;

import com.yoona.emoletter_be.entity.User;
import com.yoona.emoletter_be.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@RequiredArgsConstructor
@Service
public class UserDetailService implements UserDetailsService {
    private final UserRepository userRepository;

    // 기존의 userId로 사용자를 찾는 메소드 (Spring Security 인터페이스 구현)
    @Override
    public User loadUserByUsername(String userId){
        return userRepository.findById(userId)
                .orElseThrow(() -> new UsernameNotFoundException("not Founded userId: " + userId));
    }

    //email로 사용자를 찾는 새로운 서비스 메소드
    public User loadUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("not Founded email: " + email));
    }
}
