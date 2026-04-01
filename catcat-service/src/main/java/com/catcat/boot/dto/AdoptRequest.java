package com.catcat.boot.dto;

import lombok.Data;

/**
 * 领养请求
 */
@Data
public class AdoptRequest {

    /**
     * 猫咪名字
     */
    private String name;
}
