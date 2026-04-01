package com.catcat.boot.controller;

import com.catcat.boot.bo.ResultBO;
import com.catcat.boot.dto.AddFurnitureRequest;
import com.catcat.boot.dto.UpdateFurniturePositionRequest;
import com.catcat.boot.entity.FurnitureEntity;
import com.catcat.boot.service.RoomService;
import com.catcat.boot.util.JwtUtil;
import com.catcat.boot.vo.RoomFurnitureVO;
import com.catcat.boot.vo.RoomVO;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 房间 Controller
 */
@RestController
@RequestMapping("/api/room")
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;

    /**
     * 获取用户房间
     */
    @GetMapping
    public ResultBO<RoomVO> getUserRoom(HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        RoomVO room = roomService.getOrCreateUserRoom(userId);
        return ResultBO.success(room);
    }

    /**
     * 获取可用家具列表
     */
    @GetMapping("/furniture")
    public ResultBO<List<FurnitureEntity>> getAvailableFurniture() {
        return ResultBO.success(roomService.getAvailableFurniture());
    }

    /**
     * 初始化家具数据（仅管理员）
     */
    @PostMapping("/furniture/init")
    public ResultBO<Void> initFurniture() {
        roomService.initFurnitureData();
        return ResultBO.success(null);
    }

    /**
     * 添加家具到房间
     */
    @PostMapping("/furniture")
    public ResultBO<RoomFurnitureVO> addFurniture(
            @RequestBody AddFurnitureRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        // 先获取用户房间
        RoomVO room = roomService.getOrCreateUserRoom(userId);

        RoomFurnitureVO result = roomService.addFurnitureToRoom(userId, room.getId(), request);
        return ResultBO.success(result);
    }

    /**
     * 更新房间家具位置
     */
    @PutMapping("/furniture/{furnitureId}")
    public ResultBO<RoomFurnitureVO> updateFurniturePosition(
            @PathVariable Long furnitureId,
            @RequestBody UpdateFurniturePositionRequest request,
            HttpServletRequest httpRequest) {
        Long userId = getUserIdFromRequest(httpRequest);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        RoomFurnitureVO result = roomService.updateFurniturePosition(userId, furnitureId, request);
        return ResultBO.success(result);
    }

    /**
     * 从房间移除家具
     */
    @DeleteMapping("/furniture/{furnitureId}")
    public ResultBO<Void> removeFurniture(
            @PathVariable Long furnitureId,
            HttpServletRequest request) {
        Long userId = getUserIdFromRequest(request);
        if (userId == null) {
            return ResultBO.failure("用户未登录");
        }

        roomService.removeFurnitureFromRoom(userId, furnitureId);
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
