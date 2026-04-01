package com.catcat.boot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.catcat.boot.dto.AddFurnitureRequest;
import com.catcat.boot.dto.UpdateFurniturePositionRequest;
import com.catcat.boot.entity.FurnitureEntity;
import com.catcat.boot.entity.RoomEntity;
import com.catcat.boot.entity.RoomFurnitureEntity;
import com.catcat.boot.entity.UserEntity;
import com.catcat.boot.exception.BusinessException;
import com.catcat.boot.mapper.FurnitureMapper;
import com.catcat.boot.mapper.RoomFurnitureMapper;
import com.catcat.boot.mapper.RoomMapper;
import com.catcat.boot.mapper.UserMapper;
import com.catcat.boot.vo.RoomFurnitureVO;
import com.catcat.boot.vo.RoomVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

/**
 * 房间服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomMapper roomMapper;
    private final RoomFurnitureMapper roomFurnitureMapper;
    private final FurnitureMapper furnitureMapper;
    private final UserMapper userMapper;

    /**
     * 获取用户房间（如果不存在则创建默认房间）
     */
    @Transactional
    public RoomVO getOrCreateUserRoom(Long userId) {
        RoomEntity room = roomMapper.selectOne(new LambdaQueryWrapper<RoomEntity>()
                .eq(RoomEntity::getUserId, userId)
                .orderByDesc(RoomEntity::getCreateTime)
                .last("LIMIT 1"));

        if (room == null) {
            // 创建默认房间
            room = new RoomEntity();
            room.setUserId(userId);
            room.setName("我的小窝");
            roomMapper.insert(room);
            log.info("为用户 {} 创建默认房间", userId);
        }

        // 获取用户的当前猫
        UserEntity user = userMapper.selectById(userId);

        return convertToVO(room, user != null ? user.getCurrentCatId() : null);
    }

    /**
     * 添加家具到房间
     */
    @Transactional
    public RoomFurnitureVO addFurnitureToRoom(Long userId, Long roomId, AddFurnitureRequest request) {
        // 验证房间属于用户
        RoomEntity room = roomMapper.selectOne(new LambdaQueryWrapper<RoomEntity>()
                .eq(RoomEntity::getId, roomId)
                .eq(RoomEntity::getUserId, userId));

        if (room == null) {
            throw new BusinessException("房间不存在");
        }

        // 验证家具存在
        FurnitureEntity furniture = furnitureMapper.selectById(request.getFurnitureId());
        if (furniture == null) {
            throw new BusinessException("家具不存在");
        }

        // 创建房间家具关联
        RoomFurnitureEntity roomFurniture = new RoomFurnitureEntity();
        roomFurniture.setRoomId(roomId);
        roomFurniture.setFurnitureId(request.getFurnitureId());
        roomFurniture.setPositionX(request.getPositionX() != null ? request.getPositionX() : 0);
        roomFurniture.setPositionY(request.getPositionY() != null ? request.getPositionY() : 0);
        roomFurniture.setRotation(request.getRotation() != null ? request.getRotation() : 0);

        roomFurnitureMapper.insert(roomFurniture);
        log.info("用户 {} 在房间 {} 添加家具 {}", userId, roomId, furniture.getName());

        return convertToFurnitureVO(roomFurniture, furniture);
    }

    /**
     * 更新房间家具位置
     */
    @Transactional
    public RoomFurnitureVO updateFurniturePosition(Long userId, Long roomFurnitureId, UpdateFurniturePositionRequest request) {
        RoomFurnitureEntity roomFurniture = roomFurnitureMapper.selectById(roomFurnitureId);
        if (roomFurniture == null) {
            throw new BusinessException("房间家具不存在");
        }

        // 验证房间属于用户
        RoomEntity room = roomMapper.selectOne(new LambdaQueryWrapper<RoomEntity>()
                .eq(RoomEntity::getId, roomFurniture.getRoomId())
                .eq(RoomEntity::getUserId, userId));

        if (room == null) {
            throw new BusinessException("房间不存在");
        }

        // 更新位置
        if (request.getPositionX() != null) {
            roomFurniture.setPositionX(request.getPositionX());
        }
        if (request.getPositionY() != null) {
            roomFurniture.setPositionY(request.getPositionY());
        }
        if (request.getRotation() != null) {
            roomFurniture.setRotation(request.getRotation());
        }

        roomFurnitureMapper.updateById(roomFurniture);

        FurnitureEntity furniture = furnitureMapper.selectById(roomFurniture.getFurnitureId());
        return convertToFurnitureVO(roomFurniture, furniture);
    }

    /**
     * 从房间移除家具
     */
    @Transactional
    public void removeFurnitureFromRoom(Long userId, Long roomFurnitureId) {
        RoomFurnitureEntity roomFurniture = roomFurnitureMapper.selectById(roomFurnitureId);
        if (roomFurniture == null) {
            throw new BusinessException("房间家具不存在");
        }

        // 验证房间属于用户
        RoomEntity room = roomMapper.selectOne(new LambdaQueryWrapper<RoomEntity>()
                .eq(RoomEntity::getId, roomFurniture.getRoomId())
                .eq(RoomEntity::getUserId, userId));

        if (room == null) {
            throw new BusinessException("房间不存在");
        }

        roomFurnitureMapper.deleteById(roomFurnitureId);
        log.info("用户 {} 从房间 {} 移除家具 {}", userId, room.getId(), roomFurnitureId);
    }

    /**
     * 获取可用家具列表
     */
    public List<FurnitureEntity> getAvailableFurniture() {
        return furnitureMapper.selectList(new LambdaQueryWrapper<FurnitureEntity>()
                .eq(FurnitureEntity::getIsUnlocked, true));
    }

    /**
     * 初始化家具数据
     */
    @Transactional
    public void initFurnitureData() {
        long count = furnitureMapper.selectCount(new LambdaQueryWrapper<FurnitureEntity>());
        if (count > 0) {
            log.info("家具数据已存在，跳过初始化");
            return;
        }

        // 添加默认家具
        List<FurnitureEntity> furnitureList = new ArrayList<>();

        // 床
        addFurniture(furnitureList, "猫窝", "bed", "🛏️", "床");
        addFurniture(furnitureList, "毛绒垫", "bed", "🧸", "床");
        addFurniture(furnitureList, "纸箱床", "bed", "📦", "床");

        // 玩具
        addFurniture(furnitureList, "逗猫棒", "toy", "🎮", "玩具");
        addFurniture(furnitureList, "毛线球", "toy", "🧶", "玩具");
        addFurniture(furnitureList, "激光笔", "toy", "🔴", "玩具");

        // 食盆
        addFurniture(furnitureList, "猫食盆", "food", "🍽️", "食盆");
        addFurniture(furnitureList, "猫水盆", "food", "💧", "食盆");
        addFurniture(furnitureList, "自动喂食器", "food", "🤖", "食盆");

        // 装饰
        addFurniture(furnitureList, "猫爬架", "decor", "🏠", "装饰");
        addFurniture(furnitureList, "绿植", "decor", "🌿", "装饰");
        addFurniture(furnitureList, "地毯", "decor", "🟫", "装饰");

        // 猫砂盆
        addFurniture(furnitureList, "猫砂盆", "litter", "🚽", "猫砂盆");
        addFurniture(furnitureList, "猫砂铲", "litter", "🔧", "猫砂盆");

        for (FurnitureEntity furniture : furnitureList) {
            furnitureMapper.insert(furniture);
        }

        log.info("初始化 {} 个家具", furnitureList.size());
    }

    private void addFurniture(List<FurnitureEntity> list, String name, String category, String emoji, String categoryName) {
        FurnitureEntity furniture = new FurnitureEntity();
        furniture.setName(name);
        furniture.setCategory(categoryName);
        furniture.setEmoji(emoji);
        furniture.setIsUnlocked(true);
        list.add(furniture);
    }

    /**
     * 转换为 VO
     */
    private RoomVO convertToVO(RoomEntity room, Long currentCatId) {
        RoomVO vo = new RoomVO();
        vo.setId(room.getId());
        vo.setUserId(room.getUserId());
        vo.setName(room.getName());
        vo.setCurrentCatId(currentCatId);

        // 获取房间家具
        List<RoomFurnitureEntity> roomFurnitureList = roomFurnitureMapper.selectList(
                new LambdaQueryWrapper<RoomFurnitureEntity>()
                        .eq(RoomFurnitureEntity::getRoomId, room.getId()));

        List<RoomFurnitureVO> furnitureVOList = new ArrayList<>();
        for (RoomFurnitureEntity rf : roomFurnitureList) {
            FurnitureEntity furniture = furnitureMapper.selectById(rf.getFurnitureId());
            if (furniture != null) {
                furnitureVOList.add(convertToFurnitureVO(rf, furniture));
            }
        }

        vo.setFurniture(furnitureVOList);
        return vo;
    }

    private RoomFurnitureVO convertToFurnitureVO(RoomFurnitureEntity rf, FurnitureEntity furniture) {
        RoomFurnitureVO vo = new RoomFurnitureVO();
        vo.setId(rf.getId());
        vo.setFurnitureId(furniture.getId());
        vo.setName(furniture.getName());
        vo.setCategory(furniture.getCategory());
        vo.setImageUrl(furniture.getImageUrl());
        vo.setEmoji(furniture.getEmoji());
        vo.setPositionX(rf.getPositionX());
        vo.setPositionY(rf.getPositionY());
        vo.setRotation(rf.getRotation());
        return vo;
    }
}
