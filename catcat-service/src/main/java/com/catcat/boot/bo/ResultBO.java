package com.catcat.boot.bo;

import lombok.Data;
import java.io.Serializable;

/**
 * 统一返回结果
 */
@Data
public class ResultBO<T> implements Serializable {
    private static final long serialVersionUID = 1L;

    private boolean success;
    private T data;
    private String errorMessage;
    private Integer errorCode;

    public static <T> ResultBO<T> success() {
        ResultBO<T> result = new ResultBO<>();
        result.setSuccess(true);
        return result;
    }

    public static <T> ResultBO<T> success(T data) {
        ResultBO<T> result = new ResultBO<>();
        result.setSuccess(true);
        result.setData(data);
        return result;
    }

    public static <T> ResultBO<T> failure(String errorMessage) {
        ResultBO<T> result = new ResultBO<>();
        result.setSuccess(false);
        result.setErrorMessage(errorMessage);
        return result;
    }

    public static <T> ResultBO<T> failure(Integer errorCode, String errorMessage) {
        ResultBO<T> result = new ResultBO<>();
        result.setSuccess(false);
        result.setErrorCode(errorCode);
        result.setErrorMessage(errorMessage);
        return result;
    }
}
