package com.catcat.boot.dto;

import lombok.Data;

/**
 * 更新家具位置请求
 */
@Data
public class UpdateFurniturePositionRequest {

    /**
     * X坐标
     */
    private Integer positionX;

    /**
     * Y坐标
     */
    private Integer positionY;

    /**
     * 旋转角度
     */
    private Integer rotation;
}
