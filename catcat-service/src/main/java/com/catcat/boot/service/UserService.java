package com.catcat.boot.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.catcat.boot.dto.LoginRequest;
import com.catcat.boot.dto.RegisterRequest;
import com.catcat.boot.entity.UserEntity;
import com.catcat.boot.exception.BusinessException;
import com.catcat.boot.mapper.UserMapper;
import com.catcat.boot.util.JwtUtil;
import com.catcat.boot.vo.UserVO;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.util.DigestUtils;
import org.springframework.util.StringUtils;

import java.util.concurrent.TimeUnit;

/**
 * 用户服务
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final RedisTemplate<String, Object> redisTemplate;

    private static final String USER_CACHE_KEY = "user:";
    private static final String TOKEN_BLACKLIST_KEY = "token:blacklist:";
    private static final long CACHE_EXPIRE_DAYS = 7;

    /**
     * 用户注册（邮箱注册）
     */
    public UserVO register(RegisterRequest request) {
        // 参数校验
        if (!StringUtils.hasText(request.getEmail())) {
            throw new BusinessException("邮箱不能为空");
        }
        if (!StringUtils.hasText(request.getNickname())) {
            throw new BusinessException("昵称不能为空");
        }

        // 检查邮箱是否已注册
        if (isEmailExists(request.getEmail())) {
            throw new BusinessException("该邮箱已被注册");
        }

        // 从邮箱自动生成用户名（取 @ 前的部分）
        String username = request.getEmail().split("@")[0];
        // 如果用户名已存在，追加数字后缀
        if (isUsernameExists(username)) {
            int suffix = 1;
            while (isUsernameExists(username + suffix)) {
                suffix++;
            }
            username = username + suffix;
        }

        // 创建用户
        UserEntity user = new UserEntity();
        user.setUsername(username);
        user.setPassword(encryptPassword(request.getPassword()));
        user.setNickname(request.getNickname());
        user.setEmail(request.getEmail());

        userMapper.insert(user);
        log.info("用户注册成功: email={}, username={}", request.getEmail(), username);

        return convertToVO(user);
    }

    /**
     * 用户登录（支持邮箱或用户名）
     */
    public String login(LoginRequest request) {
        String account = request.getAccount();

        // 先尝试邮箱查找，再尝试用户名查找
        UserEntity user = findByEmail(account);
        if (user == null) {
            user = findByUsername(account);
        }

        if (user == null) {
            throw new BusinessException("账号或密码错误");
        }

        // 验证密码
        if (!user.getPassword().equals(encryptPassword(request.getPassword()))) {
            throw new BusinessException("账号或密码错误");
        }

        // 生成Token
        String token = JwtUtil.generateToken(user.getId(), user.getUsername());
        log.info("用户登录成功: {}", user.getUsername());

        // 将Token存入Redis
        redisTemplate.opsForValue().set("token:" + user.getId(), token, CACHE_EXPIRE_DAYS, TimeUnit.DAYS);

        return token;
    }

    /**
     * 退出登录
     */
    public void logout(Long userId) {
        // 将Token加入黑名单
        redisTemplate.opsForValue().set(TOKEN_BLACKLIST_KEY + userId, "1", CACHE_EXPIRE_DAYS, TimeUnit.DAYS);
        // 删除用户缓存
        redisTemplate.delete(USER_CACHE_KEY + userId);
        log.info("用户退出登录: userId={}", userId);
    }

    /**
     * 获取当前用户信息
     */
    public UserVO getCurrentUser(Long userId) {
        String cacheKey = USER_CACHE_KEY + userId;

        // 先尝试从缓存获取
        UserVO cached = (UserVO) redisTemplate.opsForValue().get(cacheKey);
        if (cached != null) {
            return cached;
        }

        // 从数据库获取
        UserEntity user = userMapper.selectById(userId);
        if (user == null) {
            return null;
        }

        UserVO vo = convertToVO(user);

        // 存入缓存
        redisTemplate.opsForValue().set(cacheKey, vo, CACHE_EXPIRE_DAYS, TimeUnit.DAYS);

        return vo;
    }

    /**
     * 验证Token是否有效
     */
    public boolean validateToken(String token, Long userId) {
        // 检查Token是否在黑名单
        Boolean isBlacklisted = redisTemplate.hasKey(TOKEN_BLACKLIST_KEY + userId);
        if (Boolean.TRUE.equals(isBlacklisted)) {
            return false;
        }

        return JwtUtil.validateToken(token);
    }

    /**
     * 根据用户名查询用户
     */
    public UserEntity findByUsername(String username) {
        return userMapper.selectOne(new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, username));
    }

    /**
     * 根据邮箱查询用户
     */
    public UserEntity findByEmail(String email) {
        return userMapper.selectOne(new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getEmail, email));
    }

    /**
     * 检查用户名是否存在
     */
    public boolean isUsernameExists(String username) {
        return userMapper.selectCount(new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getUsername, username)) > 0;
    }

    /**
     * 检查邮箱是否存在
     */
    public boolean isEmailExists(String email) {
        return userMapper.selectCount(new LambdaQueryWrapper<UserEntity>()
                .eq(UserEntity::getEmail, email)) > 0;
    }

    /**
     * 密码加密（MD5简单加密，生产环境应使用BCrypt）
     */
    private String encryptPassword(String password) {
        return DigestUtils.md5DigestAsHex(("catcat" + password + "salt").getBytes());
    }

    /**
     * 转换为VO
     */
    private UserVO convertToVO(UserEntity user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setUsername(user.getUsername());
        vo.setNickname(user.getNickname());
        vo.setEmail(user.getEmail());
        vo.setAvatarUrl(user.getAvatarUrl());
        vo.setCurrentCatId(user.getCurrentCatId());
        vo.setCurrentRoomId(user.getCurrentRoomId());
        return vo;
    }
}
