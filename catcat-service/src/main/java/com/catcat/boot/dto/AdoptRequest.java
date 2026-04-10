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

    /**
     * 指定品种ID（可选，为空时随机选择品种）
     */
    private String breedId;
}
