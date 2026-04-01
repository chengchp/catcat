package com.catcat.boot.dto;

import lombok.Data;

/**
 * 虚拟猫 DNA 数据
 */
@Data
public class CatDNA {

    /**
     * 毛色：白色、黑色、橘色、灰色、奶油色、玳瑁色
     */
    private String color;

    /**
     * 花纹：纯色、双色、三花、虎斑、条纹、斑点
     */
    private String pattern;

    /**
     * 眼睛颜色：蓝色、绿色、黄色、铜色、琥珀色、异瞳
     */
    private String eyeColor;

    /**
     * 毛长：短毛、长毛、中长毛、无毛
     */
    private String furLength;

    /**
     * 尾巴：正常、长尾、短尾
     */
    private String tail;
}
