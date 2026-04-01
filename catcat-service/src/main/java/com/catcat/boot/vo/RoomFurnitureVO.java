package com.catcat.boot.vo;

import lombok.Data;

/**
 * 房间家具 VO
 */
@Data
public class RoomFurnitureVO {

    private Long id;

    private Long furnitureId;

    private String name;

    private String category;

    private String imageUrl;

    private String emoji;

    private Integer positionX;

    private Integer positionY;

    private Integer rotation;
}
