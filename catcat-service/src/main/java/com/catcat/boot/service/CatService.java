package com.catcat.boot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.catcat.boot.dto.AdoptRequest;
import com.catcat.boot.dto.CatDNA;
import com.catcat.boot.entity.BreedEntity;
import com.catcat.boot.entity.CatEntity;
import com.catcat.boot.entity.UserEntity;
import com.catcat.boot.exception.BusinessException;
import com.catcat.boot.mapper.CatMapper;
import com.catcat.boot.mapper.UserMapper;
import com.catcat.boot.vo.CatVO;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

/**
 * 虚拟猫服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class CatService {

    private final CatMapper catMapper;
    private final UserMapper userMapper;
    private final BreedService breedService;
    private final CatDnaGenerator catDnaGenerator;
    private final ObjectMapper objectMapper;

    private final Random random = new Random();

    /**
     * 领养新猫
     */
    @Transactional
    public CatVO adoptCat(Long userId, AdoptRequest request) {
        // 获取所有品种
        List<BreedEntity> breeds = breedService.getAllBreeds();
        if (breeds == null || breeds.isEmpty()) {
            throw new BusinessException("暂无可领养的品种，请先同步品种数据");
        }

        // 随机选择一个品种
        BreedEntity randomBreed = breeds.get(random.nextInt(breeds.size()));

        // 生成 DNA
        CatDNA dna = catDnaGenerator.generateByBreed(randomBreed.getBreedId());

        // 创建猫记录
        CatEntity cat = new CatEntity();
        cat.setUserId(userId);
        cat.setBreedId(randomBreed.getBreedId());
        cat.setName(request.getName() != null ? request.getName() : generateRandomName());
        cat.setDna(convertDnaToJson(dna));
        cat.setIsCurrent(false);

        catMapper.insert(cat);

        // 如果用户没有当前猫，设置这只为当前猫
        UserEntity user = userMapper.selectById(userId);
        if (user != null && user.getCurrentCatId() == null) {
            cat.setIsCurrent(true);
            catMapper.updateById(cat);
            user.setCurrentCatId(cat.getId());
            userMapper.updateById(user);
        }

        log.info("用户 {} 领养了新猫: {} (品种: {})", userId, cat.getName(), randomBreed.getName());

        return convertToVO(cat, randomBreed);
    }

    /**
     * 获取用户的所有猫
     */
    public List<CatVO> getUserCats(Long userId) {
        List<CatEntity> cats = catMapper.selectList(new LambdaQueryWrapper<CatEntity>()
                .eq(CatEntity::getUserId, userId)
                .orderByDesc(CatEntity::getCreateTime));

        if (cats == null || cats.isEmpty()) {
            return new ArrayList<>();
        }

        return cats.stream()
                .map(cat -> {
                    BreedEntity breed = breedService.getBreedById(cat.getBreedId());
                    return convertToVO(cat, breed);
                })
                .collect(Collectors.toList());
    }

    /**
     * 设置当前猫
     */
    @Transactional
    public CatVO setCurrentCat(Long userId, Long catId) {
        // 检查猫是否属于该用户
        CatEntity cat = catMapper.selectOne(new LambdaQueryWrapper<CatEntity>()
                .eq(CatEntity::getId, catId)
                .eq(CatEntity::getUserId, userId));

        if (cat == null) {
            throw new BusinessException("猫不存在或不属于当前用户");
        }

        // 取消用户的所有当前猫标记
        List<CatEntity> userCats = catMapper.selectList(new LambdaQueryWrapper<CatEntity>()
                .eq(CatEntity::getUserId, userId)
                .eq(CatEntity::getIsCurrent, true));

        for (CatEntity c : userCats) {
            c.setIsCurrent(false);
            catMapper.updateById(c);
        }

        // 设置新的当前猫
        cat.setIsCurrent(true);
        catMapper.updateById(cat);

        // 更新用户的当前猫ID
        UserEntity user = userMapper.selectById(userId);
        if (user != null) {
            user.setCurrentCatId(catId);
            userMapper.updateById(user);
        }

        BreedEntity breed = breedService.getBreedById(cat.getBreedId());
        log.info("用户 {} 设置当前猫为: {}", userId, cat.getName());

        return convertToVO(cat, breed);
    }

    /**
     * 删除猫
     */
    @Transactional
    public void deleteCat(Long userId, Long catId) {
        CatEntity cat = catMapper.selectOne(new LambdaQueryWrapper<CatEntity>()
                .eq(CatEntity::getId, catId)
                .eq(CatEntity::getUserId, userId));

        if (cat == null) {
            throw new BusinessException("猫不存在或不属于当前用户");
        }

        // 如果删除的是当前猫，更新用户的当前猫ID
        UserEntity user = userMapper.selectById(userId);
        if (user != null && catId.equals(user.getCurrentCatId())) {
            user.setCurrentCatId(null);
            userMapper.updateById(user);
        }

        catMapper.deleteById(catId);
        log.info("用户 {} 删除了猫: {}", userId, cat.getName());
    }

    /**
     * 转换为 VO
     */
    private CatVO convertToVO(CatEntity cat, BreedEntity breed) {
        CatVO vo = new CatVO();
        vo.setId(cat.getId());
        vo.setUserId(cat.getUserId());
        vo.setBreedId(cat.getBreedId());
        vo.setBreedName(breed != null ? breed.getName() : "未知品种");
        vo.setName(cat.getName());
        vo.setDna(cat.getDna());
        vo.setIsCurrent(cat.getIsCurrent());
        vo.setImageUrl(breed != null ? breed.getImageUrl() : null);
        return vo;
    }

    /**
     * DNA 转 JSON
     */
    private String convertDnaToJson(CatDNA dna) {
        try {
            return objectMapper.writeValueAsString(dna);
        } catch (JsonProcessingException e) {
            log.error("DNA 序列化失败", e);
            throw new BusinessException("DNA 生成失败");
        }
    }

    /**
     * 生成随机名字
     */
    private String generateRandomName() {
        String[] names = {"小橘", "咪咪", "主子", "团子", "雪球", "毛球", "糖糖", "豆豆", "球球", "花花"};
        return names[random.nextInt(names.length)];
    }
}
