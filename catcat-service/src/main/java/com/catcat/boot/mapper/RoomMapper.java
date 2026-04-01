package com.catcat.boot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.catcat.boot.entity.RoomEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 房间 Mapper
 */
@Mapper
public interface RoomMapper extends BaseMapper<RoomEntity> {
}
