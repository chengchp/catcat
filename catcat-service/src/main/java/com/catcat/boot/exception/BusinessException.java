package com.catcat.boot.exception;

import lombok.Getter;

/**
 * 业务异常
 */
@Getter
public class BusinessException extends RuntimeException {

    private final Integer code;
    private final String desc;

    public BusinessException(MessageCode messageCode, Object... args) {
        super(String.format(messageCode.getMsg(), args));
        this.code = messageCode.getCode();
        this.desc = String.format(messageCode.getMsg(), args);
    }

    public BusinessException(Integer code, String desc) {
        super(desc);
        this.code = code;
        this.desc = desc;
    }

    /**
     * 使用字符串消息创建业务异常（自动使用 BUSINESS_ERROR 错误码）
     */
    public BusinessException(String message) {
        super(message);
        this.code = MessageCode.BUSINESS_ERROR.getCode();
        this.desc = message;
    }

    /**
     * 错误码枚举
     */
    public enum MessageCode {
        SYSTEM_ERROR(1000, "系统错误"),
        PARAM_ERROR(1001, "参数错误: %s"),
        NOT_FOUND(1002, "资源不存在: %s"),
        BUSINESS_ERROR(2000, "业务错误: %s"),
        UNAUTHORIZED(2001, "未授权访问"),
        TOKEN_EXPIRED(2002, "Token 已过期"),
        USER_NOT_FOUND(3001, "用户不存在"),
        USER_ALREADY_EXISTS(3002, "用户已存在"),
        PASSWORD_ERROR(3003, "密码错误"),
        CAT_NOT_FOUND(4001, "猫咪不存在"),
        BREED_NOT_FOUND(4002, "品种不存在"),
        ROOM_NOT_FOUND(5001, "房间不存在");

        private final Integer code;
        private final String msg;

        MessageCode(Integer code, String msg) {
            this.code = code;
            this.msg = msg;
        }

        public Integer getCode() {
            return code;
        }

        public String getMsg() {
            return msg;
        }
    }
}
