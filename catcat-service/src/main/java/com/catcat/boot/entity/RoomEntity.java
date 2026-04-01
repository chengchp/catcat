package com.catcat.boot.entity;

import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;
import lombok.EqualsAndHashCode;

/**
 * 房间实体
 */
@Data
@EqualsAndHashCode(callSuper = true)
@TableName("rooms")
public class RoomEntity extends BaseEntity {

    /**
     * 用户ID
     */
    private Long userId;

    /**
     * 房间名称
     */
    private String name;
}
