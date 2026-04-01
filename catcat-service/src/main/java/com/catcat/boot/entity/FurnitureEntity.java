package com.catcat.boot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 家具实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("furniture")
public class FurnitureEntity extends BaseEntity {

    /**
     * 家具名称
     */
    private String name;

    /**
     * 分类（床、玩具、食盆、装饰）
     */
    private String category;

    /**
     * 家具图片URL
     */
    private String imageUrl;

    /**
     * emoji 图标
     */
    private String emoji;

    /**
     * 是否解锁（默认true）
     */
    private Boolean isUnlocked;
}
