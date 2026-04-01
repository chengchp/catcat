package com.catcat.boot.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.catcat.boot.entity.UserEntity;
import org.apache.ibatis.annotations.Mapper;

/**
 * 用户 Mapper
 */
@Mapper
public interface UserMapper extends BaseMapper<UserEntity> {
}
