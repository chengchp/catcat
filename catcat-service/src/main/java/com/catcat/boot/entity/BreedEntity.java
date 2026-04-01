package com.catcat.boot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 品种实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("breeds")
public class BreedEntity extends BaseEntity {

    /**
     * 品种ID (The Cat API 的 id)
     */
    private String breedId;

    /**
     * 品种名称
     */
    private String name;

    /**
     * 性格描述
     */
    private String temperament;

    /**
     * 原产地
     */
    private String origin;

    /**
     * 描述
     */
    private String description;

    /**
     * 寿命
     */
    private String lifeSpan;

    /**
     * 适应度 (1-5)
     */
    private Integer adaptability;

    /**
     * 亲人程度 (1-5)
     */
    private Integer affectionLevel;

    /**
     * 儿童友好度 (1-5)
     */
    private Integer childFriendly;

    /**
     * 狗友好度 (1-5)
     */
    private Integer dogFriendly;

    /**
     * 能量等级 (1-5)
     */
    private Integer energyLevel;

    /**
     * 美容需求 (1-5)
     */
    private Integer grooming;

    /**
     * 健康问题 (1-5)
     */
    private Integer healthIssues;

    /**
     * 智力 (1-5)
     */
    private Integer intelligence;

    /**
     * 掉毛程度 (1-5)
     */
    private Integer sheddingLevel;

    /**
     * 社交需求 (1-5)
     */
    private Integer socialNeeds;

    /**
     * 陌生人友好度 (1-5)
     */
    private Integer strangerFriendly;

    /**
     * 发声程度 (1-5)
     */
    private Integer vocalisation;

    /**
     * 低过敏性 (0/1)
     */
    private Integer hypoallergenic;

    /**
     * 图片URL
     */
    private String imageUrl;

    /**
     * Wikipedia链接
     */
    private String wikipediaUrl;

    /**
     * 体重(英制)
     */
    private String weightImperial;

    /**
     * 体重(公制)
     */
    private String weightMetric;
}
