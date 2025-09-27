package com.yoona.emoletter_be.config;

import com.yoona.emoletter_be.config.jwt.TokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;
import org.springframework.security.config.http.SessionCreationPolicy;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final UserDetailsService userService;
    private final TokenProvider tokenProvider;

    //스프링 시큐리티 기능 비화성화
    @Bean
    public WebSecurityCustomizer configure(){
        return (web) -> web.ignoring()
                .requestMatchers(new AntPathRequestMatcher("/static/**"));
        // CSS, JavaScript, 이미지 파일 등의 정적(static)파일은 보안 비활성화
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // csrf는 REST API 서버에서는 보통 disable
            .csrf(csrf -> csrf.disable())

            // 세션 비활성화 (JWT 기반 인증) - JWT의 핵심은 서버가 클라이언트 상태(세션)를 저장하지 않는 것
            .sessionManagement(session -> session
                    .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            .authorizeHttpRequests(auth -> auth
                    // 1. 회원가입: POST 요청만 명시적으로 permitAll
                    .requestMatchers(HttpMethod.POST, "/api/user").permitAll()

                    // 2. 로그인: POST 요청만 명시적으로 permitAll
                    .requestMatchers(HttpMethod.POST, "/api/user/login").permitAll()

                    // 3. 토큰 재발급: POST 요청만 명시적으로 permitAll
                    .requestMatchers(HttpMethod.POST, "/api/token").permitAll()

                    .requestMatchers(HttpMethod.DELETE, "/api/user/logout").permitAll()

                    // 4. 나머지는 인증 필요
                    .anyRequest().authenticated()
            );

        // 커스텀 JWT 필터 적용
        http.addFilterBefore(
                new TokenAuthenticationFilter(tokenProvider), // 구현한 JWT 필터
                UsernamePasswordAuthenticationFilter.class    // ID/PW 기반 인증 필터 이전에 실행
        );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {  //비밀번호를 암호화하기 위한 PasswordEncoder를 빈으로 정의
        return new BCryptPasswordEncoder();  //여기서는 BCryptPasswordEncoder를 사용
    }

}