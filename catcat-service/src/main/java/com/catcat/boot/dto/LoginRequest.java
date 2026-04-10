package com.catcat.boot.dto;

import lombok.Data;

/**
 * 登录请求
 */
@Data
public class LoginRequest {

    /**
     * 邮箱或用户名
     */
    private String account;

    /**
     * 密码
     */
    private String password;
}
