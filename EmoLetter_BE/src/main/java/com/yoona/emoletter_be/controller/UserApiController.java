package com.yoona.emoletter_be.controller;

import com.yoona.emoletter_be.dto.user.AddUserRequest;
import com.yoona.emoletter_be.repository.UserRepository;
import com.yoona.emoletter_be.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RequiredArgsConstructor
@Controller
@RequestMapping("/api")
public class UserApiController {

    private final UserService userService;

    @PostMapping("/user")
    public ResponseEntity<Void> signUp(AddUserRequest request){
        userService.save(request);
        return ResponseEntity.ok().build();
    }


}
