package com.yoona.emoletter_be.config;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Configurable;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class WebSecurityConfig {
    private final UserDetailsService userService;

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

                // URL별 권한 설정
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/login", "/signup", "/public/**").permitAll()  // 인증 필요 없는 URL
                        .anyRequest().authenticated() // 나머지는 인증 필요
                )

                // 기본 로그인 폼 사용 (JWT 붙이기 전 임시)
                .formLogin(form -> form
                        .loginPage("/login") // 커스텀 로그인 페이지 (없으면 default 제공됨)
                        .permitAll()
                )

                // 로그아웃 기능 (Spring Security 기본 제공)
                .logout(logout -> logout
                        .logoutUrl("/logout")
                        .permitAll()
                );

        return http.build();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {  //비밀번호를 암호화하기 위한 PasswordEncoder를 빈으로 정의
        return new BCryptPasswordEncoder();  //여기서는 BCryptPasswordEncoder를 사용
    }

}