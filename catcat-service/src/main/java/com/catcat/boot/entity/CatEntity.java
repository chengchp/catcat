package com.catcat.boot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 虚拟猫实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("cats")
public class CatEntity extends BaseEntity {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 品种ID (The Cat API 的 breed_id)
     */
    private String breedId;

    /**
     * 猫的名字
     */
    private String name;

    /**
     * DNA (JSON格式：毛色、花纹、眼睛颜色、毛长、尾巴)
     */
    private String dna;

    /**
     * 是否当前选中的猫
     */
    private Boolean isCurrent;
}
