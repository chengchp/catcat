package com.catcat.boot.vo;

import lombok.Data;

/**
 * 用户视图对象（不包含密码）
 */
@Data
public class UserVO {

    /**
     * 用户ID
     */
    private Long id;

    /**
     * 用户名
     */
    private String username;

    /**
     * 昵称
     */
    private String nickname;

    /**
     * 邮箱
     */
    private String email;

    /**
     * 头像URL
     */
    private String avatarUrl;

    /**
     * 当前猫咪ID
     */
    private Long currentCatId;

    /**
     * 当前房间ID
     */
    private Long currentRoomId;
}
