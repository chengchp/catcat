package com.catcat.boot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.catcat.boot.entity.CatEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 虚拟猫 Mapper
 */
@Mapper
public interface CatMapper extends BaseMapper<CatEntity> {
}
