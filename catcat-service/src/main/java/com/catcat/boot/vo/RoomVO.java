package com.catcat.boot.vo;

import lombok.Data;

import java.util.List;

/**
 * 房间 VO
 */
@Data
public class RoomVO {

    private Long id;

    private Long userId;

    private String name;

    private List<RoomFurnitureVO> furniture;

    private Long currentCatId;
}
