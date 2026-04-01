package com.catcat.boot.vo;

import lombok.Data;

/**
 * 虚拟猫 VO
 */
@Data
public class CatVO {

    private Long id;

    private Long userId;

    private String breedId;

    private String breedName;

    private String name;

    private String dna;

    private Boolean isCurrent;

    private String imageUrl;
}
