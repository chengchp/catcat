package com.catcat.boot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 房间家具关联实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("room_furniture")
public class RoomFurnitureEntity extends BaseEntity {

    /**
     * 房间ID
     */
    private Long roomId;

    /**
     * 家具ID
     */
    private Long furnitureId;

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
