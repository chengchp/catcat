package com.catcat.boot.controller;

import com.catcat.boot.bo.ResultBO;
import com.catcat.boot.dto.AdoptRequest;
import com.catcat.boot.service.CatService;
import com.catcat.boot.util.JwtUtil;
import com.catcat.boot.vo.CatVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 虚拟猫 Controller
 */
@RestController
@RequestMapping("/api/cats")
@RequiredArgsConstructor
public class CatController {

    private final CatService catService;

    /**
     * 领养新猫
     */
    @PostMapping("/adopt")
    public ResultBO<CatVO> adoptCat(@RequestBody AdoptRequest request, HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        CatVO cat = catService.adoptCat(userId, request);
        return ResultBO.success(cat);
    }

    /**
     * 获取用户的所有猫
     */
    @GetMapping
    public ResultBO<List<CatVO>> getUserCats(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        List<CatVO> cats = catService.getUserCats(userId);
        return ResultBO.success(cats);
    }

    /**
     * 设置当前猫
     */
    @PutMapping("/{catId}/current")
    public ResultBO<CatVO> setCurrentCat(@PathVariable Long catId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        CatVO cat = catService.setCurrentCat(userId, catId);
        return ResultBO.success(cat);
    }

    /**
     * 删除猫
     */
    @DeleteMapping("/{catId}")
    public ResultBO<Void> deleteCat(@PathVariable Long catId, HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        catService.deleteCat(userId, catId);
        return ResultBO.success(null);
    }

    /**
     * 从请求中获取用户ID
     */
    private Long getUserIdFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            return null;
        }

        String token = authHeader.substring(7);
        return JwtUtil.getUserIdFromToken(token);
    }
}
