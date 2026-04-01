package com.catcat.boot.controller;

import com.catcat.boot.bo.ResultBO;
import com.catcat.boot.entity.BreedEntity;
import com.catcat.boot.service.BreedService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 品种 Controller
 */
@RestController
@RequestMapping("/api/breeds")
@RequiredArgsConstructor
public class BreedController {

    private final BreedService breedService;

    /**
     * 同步品种数据
     */
    @PostMapping("/sync")
    public ResultBO<Integer> syncBreeds() {
        int count = breedService.syncBreedsFromApi();
        return ResultBO.success(count);
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
}
