package com.catcat.boot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.catcat.boot.adapter.CatApiAdapter;
import com.catcat.boot.bo.CatBreedDTO;
import com.catcat.boot.entity.BreedEntity;
import com.catcat.boot.mapper.BreedMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

/**
 * 品种服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class BreedService {

    private final BreedMapper breedMapper;
    private final CatApiAdapter catApiAdapter;
    private final RedisTemplate<String, Object> redisTemplate;
    private final OssService ossService;

    private static final String BREED_CACHE_KEY = "breed:";
    private static final String BREED_LIST_CACHE_KEY = "breed:list:all";
    private static final long CACHE_EXPIRE_HOURS = 24;

    /**
     * 从 The Cat API 同步品种数据到本地数据库
     */
    public int syncBreedsFromApi() {
        log.info("开始从 The Cat API 同步品种数据...");
        List<CatBreedDTO> breedsFromApi = catApiAdapter.getBreeds();
        if (breedsFromApi.isEmpty()) {
            log.warn("The Cat API 返回空数据，同步取消");
            return 0;
        }

        int successCount = 0;
        for (CatBreedDTO dto : breedsFromApi) {
            try {
                // 检查品种是否已存在
                BreedEntity existBreed = selectByBreedId(dto.getId());
                if (existBreed != null) {
                    // 更新现有品种
                    updateBreedFromDto(existBreed, dto);
                    breedMapper.updateById(existBreed);
                } else {
                    // 插入新品种
                    BreedEntity newBreed = convertToEntity(dto);
                    breedMapper.insert(newBreed);
                }
                successCount++;
            } catch (Exception e) {
                log.error("同步品种失败: {}", dto.getName(), e);
            }
        }

        // 清除缓存
        clearBreedCache();

        log.info("品种数据同步完成，成功: {}/{}", successCount, breedsFromApi.size());
        return successCount;
    }

    /**
     * 获取所有品种列表
     */
    public List<BreedEntity> getAllBreeds() {
        // 先尝试从缓存获取
        @SuppressWarnings("unchecked")
        List<BreedEntity> cachedList = (List<BreedEntity>) redisTemplate.opsForValue().get(BREED_LIST_CACHE_KEY);
        if (cachedList != null && !cachedList.isEmpty()) {
            log.debug("从缓存获取品种列表");
            return cachedList;
        }

        // 从数据库获取
        List<BreedEntity> breeds = breedMapper.selectList(new LambdaQueryWrapper<>());
        if (breeds != null && !breeds.isEmpty()) {
            // 存入缓存
            redisTemplate.opsForValue().set(BREED_LIST_CACHE_KEY, breeds, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        }
        return breeds != null ? breeds : new ArrayList<>();
    }

    /**
     * 根据品种ID获取详情
     */
    public BreedEntity getBreedById(String breedId) {
        String cacheKey = BREED_CACHE_KEY + breedId;

        // 先尝试从缓存获取
        BreedEntity cached = (BreedEntity) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            log.debug("从缓存获取品种详情: {}", breedId);
            return cached;
        }

        // 从数据库获取
        BreedEntity breed = selectByBreedId(breedId);
        if (breed != null) {
            // 存入缓存
            redisTemplate.opsForValue().set(cacheKey, breed, CACHE_EXPIRE_HOURS, TimeUnit.HOURS);
        }
        return breed;
    }

    /**
     * 更新品种图片 URL
     */
    public void updateImageUrl(String breedId, String imageUrl) {
        BreedEntity entity = selectByBreedId(breedId);
        if (entity != null) {
            entity.setImageUrl(imageUrl);
            breedMapper.updateById(entity);
            redisTemplate.delete(BREED_CACHE_KEY + breedId);
            redisTemplate.delete(BREED_LIST_CACHE_KEY);
        }
    }

    /**
     * 根据品种名称搜索
     */
    public List<BreedEntity> searchBreeds(String keyword) {
        return getAllBreeds().stream()
                .filter(breed -> breed.getName().toLowerCase().contains(keyword.toLowerCase()))
                .collect(Collectors.toList());
    }

    /**
     * 根据品种ID查询
     */
    private BreedEntity selectByBreedId(String breedId) {
        return breedMapper.selectOne(new LambdaQueryWrapper<BreedEntity>()
                .eq(BreedEntity::getBreedId, breedId));
    }

    /**
     * 将DTO转换为实体
     */
    private BreedEntity convertToEntity(CatBreedDTO dto) {
        BreedEntity entity = new BreedEntity();
        updateBreedFromDto(entity, dto);
        return entity;
    }

    /**
     * 从DTO更新实体
     */
    private void updateBreedFromDto(BreedEntity entity, CatBreedDTO dto) {
        entity.setBreedId(dto.getId());
        entity.setName(dto.getName());
        entity.setTemperament(dto.getTemperament());
        entity.setOrigin(dto.getOrigin());
        entity.setDescription(dto.getDescription());
        entity.setLifeSpan(dto.getLifeSpan());
        entity.setAdaptability(dto.getAdaptability());
        entity.setAffectionLevel(dto.getAffectionLevel());
        entity.setChildFriendly(dto.getChildFriendly());
        entity.setDogFriendly(dto.getDogFriendly());
        entity.setEnergyLevel(dto.getEnergyLevel());
        entity.setGrooming(dto.getGrooming());
        entity.setHealthIssues(dto.getHealthIssues());
        entity.setIntelligence(dto.getIntelligence());
        entity.setSheddingLevel(dto.getSheddingLevel());
        entity.setSocialNeeds(dto.getSocialNeeds());
        entity.setStrangerFriendly(dto.getStrangerFriendly());
        entity.setVocalisation(dto.getVocalisation());
        entity.setHypoallergenic(dto.getHypoallergenic());
        entity.setWikipediaUrl(dto.getWikipediaUrl());

        if (dto.getWeight() != null) {
            entity.setWeightImperial(dto.getWeight().getImperial());
            entity.setWeightMetric(dto.getWeight().getMetric());
        }

        // 获取图片源 URL
        String sourceUrl = null;
        if (dto.getImage() != null && dto.getImage().getUrl() != null) {
            sourceUrl = dto.getImage().getUrl();
        } else if (dto.getReferenceImageId() != null) {
            sourceUrl = catApiAdapter.getBreedImage(dto.getReferenceImageId());
        }

        if (sourceUrl != null) {
            String ext = extractExtension(sourceUrl, "jpg");
            String ossPath = "breed/" + dto.getId() + "." + ext;
            String ossUrl = ossService.uploadFromUrl(ossPath, sourceUrl);
            if (ossUrl != null) {
                entity.setImageUrl(ossUrl);
            } else {
                log.warn("品种图片上传 OSS 失败，使用原始 URL: breedId={}", dto.getId());
                entity.setImageUrl(sourceUrl);
            }
        }
    }

    /**
     * 清除品种缓存（公开给管理员用）
     */
    public void clearCache() {
        clearBreedCache();
    }

    /**
     * 清除品种缓存
     */
    private void clearBreedCache() {
        // 清除列表缓存
        redisTemplate.delete(BREED_LIST_CACHE_KEY);
        // 清除所有单个品种缓存
        List<BreedEntity> breeds = breedMapper.selectList(new LambdaQueryWrapper<>());
        if (breeds != null) {
            for (BreedEntity breed : breeds) {
                redisTemplate.delete(BREED_CACHE_KEY + breed.getBreedId());
            }
        }
    }

    /**
     * 从 URL 中提取文件扩展名
     */
    private String extractExtension(String url, String defaultExt) {
        if (url == null) {
            return defaultExt;
        }
        String path = url.split("\\?")[0];
        int lastDot = path.lastIndexOf('.');
        if (lastDot > 0 && lastDot > path.lastIndexOf('/')) {
            String ext = path.substring(lastDot + 1).toLowerCase();
            if (ext.equals("jpg") || ext.equals("jpeg") || ext.equals("png") || ext.equals("gif") || ext.equals("webp")) {
                return ext;
            }
        }
        return defaultExt;
    }
}
