package com.catcat.boot.dto;

import lombok.Data;

/**
 * 注册请求
 */
@Data
public class RegisterRequest {

    /**
     * 邮箱（必填，作为账号标识）
     */
    private String email;

    /**
     * 密码
     */
    private String password;

    /**
     * 昵称（必填，展示名）
     */
    private String nickname;
}
