package com.catcat.boot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.catcat.boot.entity.RoomFurnitureEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 房间家具关联 Mapper
 */
@Mapper
public interface RoomFurnitureMapper extends BaseMapper<RoomFurnitureEntity> {
}
