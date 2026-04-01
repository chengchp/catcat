package com.catcat.boot.controller;

import com.catcat.boot.bo.ResultBO;
import com.catcat.boot.dto.LoginRequest;
import com.catcat.boot.dto.RegisterRequest;
import com.catcat.boot.service.UserService;
import com.catcat.boot.util.JwtUtil;
import com.catcat.boot.vo.UserVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * 用户 Controller
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /**
     * 用户注册
     */
    @PostMapping("/register")
    public ResultBO<UserVO> register(@RequestBody RegisterRequest request) {
        UserVO user = userService.register(request);
        return ResultBO.success(user);
    }

    /**
     * 用户登录
     */
    @PostMapping("/login")
    public ResultBO<Map<String, Object>> login(@RequestBody LoginRequest request) {
        String token = userService.login(request);
        Map<String, Object> data = new HashMap<>();
        data.put("token", token);
        return ResultBO.success(data);
    }

    /**
     * 退出登录
     */
    @PostMapping("/logout")
    public ResultBO<Void> logout(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId != null) {
            userService.logout(userId);
        }
        return ResultBO.success(null);
    }

    /**
     * 获取当前用户信息
     */
    @GetMapping("/current")
    public ResultBO<UserVO> getCurrentUser(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        UserVO user = userService.getCurrentUser(userId);
        if (user == null) {
            return ResultBO.failure("用户不存在");
        }

        return ResultBO.success(user);
    }

    /**
     * 从请求中获取用户ID
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        Long userId = JwtUtil.getUserIdFromToken(token);
        if (userId == null) {
            return null;
        }

        // 验证Token是否有效
        if (!userService.validateToken(token, userId)) {
            return null;
        }

        return userId;
    }
}
