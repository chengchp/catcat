package com.catcat.boot.controller;

import com.catcat.boot.bo.ResultBO;
import com.catcat.boot.entity.BreedEntity;
import com.catcat.boot.service.BreedService;
import com.catcat.boot.service.OssService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

/**
 * 品种 Controller
 */
@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    private final BreedService breedService;
    private final OssService ossService;

    /**
     * 同步品种数据（已禁用 - 危险操作会覆盖数据库）
     */
    @PostMapping("/sync")
    @Deprecated
    public ResultBO<Integer> syncBreeds() {
        return ResultBO.failure("sync 接口已禁用，请直接执行 SQL 脚本更新数据");
    }

    /**
     * 获取所有品种列表
     */
    @GetMapping
    public ResultBO<List<BreedEntity>> getAllBreeds() {
        return ResultBO.success(breedService.getAllBreeds());
    }

    /**
     * 根据品种ID获取详情
     */
    @GetMapping("/{breedId}")
    public ResultBO<BreedEntity> getBreedById(@PathVariable String breedId) {
        BreedEntity breed = breedService.getBreedById(breedId);
        if (breed == null) {
            return ResultBO.failure("品种不存在");
        }
        return ResultBO.success(breed);
    }

    /**
     * 搜索品种
     */
    @GetMapping("/search")
    public ResultBO<List<BreedEntity>> searchBreeds(@RequestParam String keyword) {
        return ResultBO.success(breedService.searchBreeds(keyword));
    }

    /**
     * 清除品种缓存（管理员用）
     */
    @DeleteMapping("/cache")
    public ResultBO<String> clearCache() {
        breedService.clearCache();
        return ResultBO.success("缓存已清除");
    }

    /**
     * 通过 URL 更新品种图片
     */
    @PostMapping("/{breedId}/image-url")
    public ResultBO<String> updateBreedImageFromUrl(@PathVariable String breedId, @RequestParam String imageUrl) {
        String ossUrl = ossService.uploadFromUrl("breed/" + breedId + ".jpg", imageUrl);
        if (ossUrl != null) {
            breedService.updateImageUrl(breedId, ossUrl);
            return ResultBO.success(ossUrl);
        }
        return ResultBO.failure("图片上传失败");
    }

    /**
     * 通过文件上传品种图片
     */
    @PostMapping("/{breedId}/image-file")
    public ResultBO<String> updateBreedImageFromFile(@PathVariable String breedId, @RequestParam("file") MultipartFile file) {
        try {
            String ossUrl = ossService.uploadBytes("breed/" + breedId + ".jpg", file.getBytes(), file.getContentType());
            if (ossUrl != null) {
                breedService.updateImageUrl(breedId, ossUrl);
                return ResultBO.success(ossUrl);
            }
            return ResultBO.failure("图片上传失败");
        } catch (Exception e) {
            return ResultBO.failure("图片上传失败: " + e.getMessage());
        }
    }
}
