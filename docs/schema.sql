-- CatCat 项目数据库表结构
-- 创建日期: 2026-03-30

-- 创建数据库
CREATE DATABASE IF NOT EXISTS catcat DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE catcat;

-- ============================================
-- 用户表 users
-- ============================================
DROP TABLE IF EXISTS users;
CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID',
    username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
    password VARCHAR(255) NOT NULL COMMENT '密码(加密存储)',
    nickname VARCHAR(100) DEFAULT NULL COMMENT '昵称',
    email VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
    avatar_url VARCHAR(500) DEFAULT NULL COMMENT '头像URL',
    current_cat_id BIGINT DEFAULT NULL COMMENT '当前猫咪ID',
    current_room_id BIGINT DEFAULT NULL COMMENT '当前房间ID',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_username (username),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='用户表';

-- ============================================
-- 品种表 breeds
-- ============================================
DROP TABLE IF EXISTS breeds;
CREATE TABLE breeds (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    breed_id VARCHAR(50) NOT NULL UNIQUE COMMENT '品种ID(The Cat API)',
    name VARCHAR(100) NOT NULL COMMENT '品种名称',
    temperament VARCHAR(500) DEFAULT NULL COMMENT '性格描述',
    origin VARCHAR(100) DEFAULT NULL COMMENT '原产地',
    description TEXT DEFAULT NULL COMMENT '描述',
    life_span VARCHAR(50) DEFAULT NULL COMMENT '寿命',
    adaptability INT DEFAULT NULL COMMENT '适应度(1-5)',
    affection_level INT DEFAULT NULL COMMENT '亲人程度(1-5)',
    child_friendly INT DEFAULT NULL COMMENT '儿童友好度(1-5)',
    dog_friendly INT DEFAULT NULL COMMENT '狗友好度(1-5)',
    energy_level INT DEFAULT NULL COMMENT '能量等级(1-5)',
    grooming INT DEFAULT NULL COMMENT '美容需求(1-5)',
    health_issues INT DEFAULT NULL COMMENT '健康问题(1-5)',
    intelligence INT DEFAULT NULL COMMENT '智力(1-5)',
    shedding_level INT DEFAULT NULL COMMENT '掉毛程度(1-5)',
    social_needs INT DEFAULT NULL COMMENT '社交需求(1-5)',
    stranger_friendly INT DEFAULT NULL COMMENT '陌生人友好度(1-5)',
    vocalisation INT DEFAULT NULL COMMENT '发声程度(1-5)',
    hypoallergenic INT DEFAULT NULL COMMENT '低过敏性(0/1)',
    image_url VARCHAR(500) DEFAULT NULL COMMENT '图片URL',
    wikipedia_url VARCHAR(500) DEFAULT NULL COMMENT 'Wikipedia链接',
    weight_imperial VARCHAR(50) DEFAULT NULL COMMENT '体重(英制)',
    weight_metric VARCHAR(50) DEFAULT NULL COMMENT '体重(公制)',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_breed_id (breed_id),
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='品种表';

-- ============================================
-- 猫咪表 cats
-- ============================================
DROP TABLE IF EXISTS cats;
CREATE TABLE cats (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '猫咪ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    breed_id VARCHAR(50) NOT NULL COMMENT '品种ID',
    name VARCHAR(100) NOT NULL COMMENT '猫咪名字',
    dna JSON DEFAULT NULL COMMENT 'DNA(毛色/花纹/眼睛/毛长/尾巴)',
    is_current TINYINT(1) DEFAULT 0 COMMENT '是否当前猫咪',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_user_id (user_id),
    INDEX idx_breed_id (breed_id),
    INDEX idx_is_current (is_current),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='猫咪表';

-- ============================================
-- 房间表 rooms
-- ============================================
DROP TABLE IF EXISTS rooms;
CREATE TABLE rooms (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '房间ID',
    user_id BIGINT NOT NULL COMMENT '用户ID',
    name VARCHAR(100) DEFAULT '我的小窝' COMMENT '房间名称',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_user_id (user_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间表';

-- ============================================
-- 家具表 furniture
-- ============================================
DROP TABLE IF EXISTS furniture;
CREATE TABLE furniture (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '家具ID',
    name VARCHAR(100) NOT NULL COMMENT '家具名称',
    category VARCHAR(50) NOT NULL COMMENT '分类(床/玩具/食盆/装饰/猫砂盆)',
    image_url VARCHAR(500) DEFAULT NULL COMMENT '家具图片URL',
    emoji VARCHAR(10) DEFAULT NULL COMMENT 'Emoji图标',
    is_unlocked TINYINT(1) DEFAULT 1 COMMENT '是否解锁',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_category (category),
    INDEX idx_is_unlocked (is_unlocked)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='家具表';

-- ============================================
-- 房间家具关联表 room_furniture
-- ============================================
DROP TABLE IF EXISTS room_furniture;
CREATE TABLE room_furniture (
    id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '主键ID',
    room_id BIGINT NOT NULL COMMENT '房间ID',
    furniture_id BIGINT NOT NULL COMMENT '家具ID',
    position_x INT DEFAULT 0 COMMENT 'X坐标',
    position_y INT DEFAULT 0 COMMENT 'Y坐标',
    rotation INT DEFAULT 0 COMMENT '旋转角度',
    create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
    update_time DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
    is_deleted TINYINT(1) DEFAULT 0 COMMENT '逻辑删除标记',
    INDEX idx_room_id (room_id),
    INDEX idx_furniture_id (furniture_id),
    FOREIGN KEY (room_id) REFERENCES rooms(id) ON DELETE CASCADE,
    FOREIGN KEY (furniture_id) REFERENCES furniture(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci COMMENT='房间家具关联表';

-- ============================================
-- 初始化家具数据
-- ============================================
INSERT INTO furniture (name, category, emoji, is_unlocked) VALUES
-- 床
('猫窝', '床', '🛏️', 1),
('毛绒垫', '床', '🧸', 1),
('纸箱床', '床', '📦', 1),
-- 玩具
('逗猫棒', '玩具', '🎮', 1),
('毛线球', '玩具', '🧶', 1),
('激光笔', '玩具', '🔴', 1),
-- 食盆
('猫食盆', '食盆', '🍽️', 1),
('猫水盆', '食盆', '💧', 1),
('自动喂食器', '食盆', '🤖', 1),
-- 装饰
('猫爬架', '装饰', '🏠', 1),
('绿植', '装饰', '🌿', 1),
('地毯', '装饰', '🟫', 1),
-- 猫砂盆
('猫砂盆', '猫砂盆', '🚽', 1),
('猫砂铲', '猫砂盆', '🔧', 1);

-- ============================================
-- 初始化测试用户 (密码: 123456, MD5加密: catcat123456salt)
-- ============================================
INSERT INTO users (username, password, nickname, email) VALUES
('test', '92e808b5e88d370c9f208d74553a3100', '测试用户', 'test@example.com');
