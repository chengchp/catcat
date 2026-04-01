# CatCat 猫猫社区网站设计

## 1. 项目概述

CatCat 是一个猫猫爱好者社区网站，汇聚全世界猫猫品种，提供品种预览、云领养虚拟猫、虚拟家园等功能。

## 2. 技术架构

### 2.1 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router) + React |
| 后端 | Spring Boot (Java) |
| 数据库 | MySQL |
| 缓存 | Redis |
| 外部API | The Cat API (https://api.thecatapi.com/v1) |

### 2.2 系统架构图

```
┌─────────────────────────────────────────────────────┐
│                      用户浏览器                      │
└─────────────────────┬───────────────────────────────┘
                      │ HTTP/REST
         ┌────────────┴────────────┐
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│   Next.js 前端   │       │  Spring Boot 后端 │
│   (品种展示)     │       │   (业务逻辑)      │
│   (用户界面)     │       │   (数据存储)      │
└─────────────────┘       └────────┬────────┘
                                   │
                    ┌──────────────┼──────────────┐
                    ▼              ▼              ▼
            ┌───────────┐  ┌───────────┐  ┌───────────┐
            │  MySQL    │  │ Redis     │  │ The Cat   │
            │ (用户/猫) │  │ (缓存)    │  │ API       │
            └───────────┘  └───────────┘  └───────────┘
```

## 3. 数据模型

### 3.1 品种表 (breeds)

品种数据从 The Cat API 同步到本地数据库。

| 字段 | 类型 | 说明 |
|------|------|------|
| id | VARCHAR(36) | 主键 |
| name | VARCHAR(100) | 品种名称 |
| origin | VARCHAR(100) | 产地 |
| description | TEXT | 描述 |
| temperament | VARCHAR(255) | 性格特征 |
| life_span | VARCHAR(20) | 寿命范围 |
| weight | VARCHAR(20) | 体重范围 |
| image_url | VARCHAR(500) | 主图URL |
| wikipedia_url | VARCHAR(500) | 维基链接 |
| created_at | TIMESTAMP | 创建时间 |
| updated_at | TIMESTAMP | 更新时间 |

### 3.2 用户表 (users)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| username | VARCHAR(50) | 用户名 |
| email | VARCHAR(100) | 邮箱 |
| password | VARCHAR(255) | 密码（加密） |
| avatar_url | VARCHAR(500) | 头像URL |
| created_at | TIMESTAMP | 创建时间 |

### 3.3 虚拟猫表 (cats)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| user_id | BIGINT | 所属用户 |
| breed_id | VARCHAR(36) | 关联品种 |
| name | VARCHAR(50) | 猫的名字 |
| dna | JSON | 外观DNA（毛色、花纹、眼睛等） |
| is_current | BOOLEAN | 是否当前选中 |
| created_at | TIMESTAMP | 创建时间 |

**DNA 结构示例：**
```json
{
  "color": "orange",
  "pattern": "tabby",
  "eyeColor": "green",
  "furLength": "short",
  "tail": "normal"
}
```

### 3.4 房间表 (rooms)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| user_id | BIGINT | 所属用户 |
| name | VARCHAR(100) | 房间名称 |
| created_at | TIMESTAMP | 创建时间 |

### 3.5 家具表 (furniture)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| name | VARCHAR(50) | 家具名称 |
| category | VARCHAR(50) | 分类（床、玩具、食盆、装饰） |
| image_url | VARCHAR(500) | 家具图片URL |
| is_unlocked | BOOLEAN | 是否解锁 |

### 3.6 房间家具关联表 (room_furniture)

| 字段 | 类型 | 说明 |
|------|------|------|
| id | BIGINT | 主键 |
| room_id | BIGINT | 房间ID |
| furniture_id | BIGINT | 家具ID |
| position_x | INT | X坐标 |
| position_y | INT | Y坐标 |
| rotation | INT | 旋转角度 |

## 4. 功能模块

### 4.1 品种百科

**页面结构：**

- 品种列表页 (`/breeds`)
  - 筛选器（按产地、体型、毛长筛选）
  - 搜索框（调用 `/breeds/search`）
  - 品种卡片网格

- 品种详情页 (`/breeds/:id`)
  - 品种图片
  - 基本信息（产地、体型、毛长、寿命、体重）
  - 性格描述
  - 饲养知识

**数据流程：**
1. 后端启动时/定时任务同步 The Cat API 品种数据到 MySQL
2. 前端调用后端 API 获取品种列表
3. 品种详情从本地数据库读取

### 4.2 云领养

**领养流程：**
1. 用户点击"领养"
2. 系统随机选择一个品种
3. 根据品种DNA生成随机外观
4. 创建 Cat 记录并关联用户
5. 同时创建用户的默认房间

**虚拟猫外观生成规则：**

| 基因 | 选项 |
|------|------|
| 毛色 | 白色、黑色、橘色、灰色、奶油色、玳瑁色 |
| 花纹 | 纯色、双色、三花、虎斑、条纹、斑点 |
| 眼睛颜色 | 蓝色、绿色、黄色、铜色、琥珀色、异瞳 |
| 毛长 | 短毛、长毛、中长毛、无毛 |
| 尾巴 | 正常、长尾、短尾 |

### 4.3 虚拟家园

**房间页面：**
- 2D俯视图展示房间布局
- 猫猫显示在房间中央
- 家具以图标形式展示在房间中

**家具布置：**
- 点击"添加家具"打开家具选择面板
- 选择家具后自动添加到房间
- 家具位置可通过界面调整

**简化说明：**
- 家具无需购买，全部直接解锁
- 仅支持2D平面布置

## 5. 前端页面

| 页面 | 路由 | 说明 |
|------|------|------|
| 首页 | `/` | 展示精选品种，快速入口 |
| 品种列表 | `/breeds` | 筛选+搜索品种 |
| 品种详情 | `/breeds/:id` | 单品种完整信息 |
| 领养页面 | `/adopt` | 领养新猫入口 |
| 我的猫 | `/my-cats` | 用户所有猫列表 |
| 房间主页 | `/room` | 虚拟房间+家具布置 |
| 个人中心 | `/profile` | 用户信息、设置 |

## 6. API 设计

### 6.1 后端 REST API

**品种相关：**
- `GET /api/breeds` - 获取品种列表
- `GET /api/breeds/:id` - 获取品种详情
- `GET /api/breeds/search?q=` - 搜索品种

**用户相关：**
- `POST /api/auth/register` - 用户注册
- `POST /api/auth/login` - 用户登录

**猫相关：**
- `GET /api/cats` - 获取用户的所有猫
- `POST /api/cats/adopt` - 领养新猫
- `PUT /api/cats/:id/current` - 设置当前猫
- `DELETE /api/cats/:id` - 删除猫

**房间相关：**
- `GET /api/room` - 获取用户房间信息
- `GET /api/room/furniture` - 获取可用家具列表
- `POST /api/room/furniture` - 添加家具到房间
- `PUT /api/room/furniture/:id` - 更新家具位置
- `DELETE /api/room/furniture/:id` - 从房间移除家具

## 7. 开发计划

### Phase 1 - MVP
1. 项目初始化（前端+后端）
2. 品种数据同步与展示
3. 用户注册登录
4. 基础领养功能

### Phase 2 - 家园
1. 虚拟房间创建
2. 家具系统
3. 房间布置功能

### Phase 3 - 增强
1. 更多品种数据
2. 家具装饰丰富
3. 社交功能（串门）

---

*设计文档创建日期: 2026-03-30*
