package com.yoona.emoletter_be.entity;

import jakarta.persistence.*;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.List;


@Table(name="user")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@Getter
@Entity
public class User implements UserDetails {
    //UserDetails 클래스는 스프링 시큐리티에서 사용자의 인증 저보를 담아주는 인터페이스임

    @Id
    @Column(name = "user_id", nullable = false)
    private String userId;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "nickname", nullable = false)
    private String nickname;

    @Column(name = "email", nullable = false)
    private String email;

    @Column(name = "role", nullable = false)
    private String role;

    @Column(name = "create_at", nullable = false)
    private LocalDateTime createAt;

    @Builder
    public User(String userId, String password, String nickname, String email, LocalDateTime createAt, String role) {
        this.userId = userId;
        this.password = password;
        this.nickname = nickname;
        this.email = email;
        this.createAt = createAt;
        this.role = role;
    }


    @Override //권한 반환
    public Collection<? extends GrantedAuthority> getAuthorities(){
        return List.of(new SimpleGrantedAuthority(this.role));
    }

    @Override //사용자의 id를 반환(고유한 값)
    public String getUsername() {
        return this.userId;
    }

    @Override //사용자의 pw를 반환(고유한 값)
    public String getPassword() {
        return this.password;
    }

    //계정 만료 여부 반환
    @Override
    public boolean isAccountNonExpired() {
        return true;  //아직 만료 X
    }

    //계정 잠금 여부 반환
    @Override
    public boolean isAccountNonLocked() {
        return true;  //아직 잠금 X
    }

    //pw 만료 여부 반환
    @Override
    public boolean isCredentialsNonExpired() {
        return true; //아직 만료 X
    }

    //계정 사용 여부 반환
    @Override
    public boolean isEnabled() {
        return true; //아직 사용 가능
    }

    //사용자 정보 갱신 시에 해당 필드 값만 변경
    public void updateUser(String userId, String nickname) {
        this.userId = userId;
        this.nickname = nickname;
    }

    public void updatePassword(String password) {
        this.password = password;
    }


}
