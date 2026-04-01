# Task Plan: CatCat 猫猫社区网站开发

## Goal
开发一个猫猫爱好者社区网站，包含品种百科浏览、云领养虚拟猫、虚拟家园三大核心功能。

## Current Phase
Phase 7: 收尾与测试 🚧 (进行中)

## Phases

### Phase 0: 设计原型与审核
- [x] 0.1 首页原型设计（布局、配色、交互）
- [x] 0.2 品种列表页原型
- [x] 0.3 品种详情页原型
- [x] 0.4 领养页原型
- [x] 0.5 我的猫列表页原型
- [x] 0.6 虚拟房间原型（2D布置）
- [x] 0.7 原型评审与确认
- [x] **Status:** complete

### Phase 1: 项目初始化与基础架构搭建
- [x] 1.1 创建前端 Next.js 项目
- [x] 1.2 创建后端 Spring Boot 项目
- [x] 1.3 配置 MySQL 数据库连接
- [x] 1.4 配置 Redis 缓存
- [x] 1.5 集成 The Cat API 并创建品种同步接口
- [x] **Status:** complete

### Phase 2: 品种百科功能
- [x] 2.1 数据库表设计（breeds）
- [x] 2.2 品种数据同步服务
- [x] 2.3 品种列表 API（分页、筛选、搜索）
- [x] 2.4 品种详情 API
- [x] 2.5 品种列表前端页面
- [x] 2.6 品种详情前端页面
- [x] **Status:** complete

### Phase 3: 用户系统
- [x] 3.1 数据库表设计（users）
- [x] 3.2 用户注册 API
- [x] 3.3 用户登录 API（JWT）
- [x] 3.4 前端用户注册/登录页面
- [x] 3.5 前端用户状态管理
- [x] **Status:** complete

### Phase 4: 云领养虚拟猫功能
- [x] 4.1 数据库表设计（cats）
- [x] 4.2 虚拟猫 DNA 生成策略
- [x] 4.3 领养 API 开发
- [x] 4.4 我的猫列表 API
- [x] 4.5 设置当前猫 API
- [x] 4.6 领养前端页面
- [x] 4.7 我的猫列表前端页面
- [x] **Status:** complete

### Phase 5: 虚拟家园功能
- [x] 5.1 数据库表设计（rooms, furniture, room_furniture）
- [x] 5.2 房间 CRUD API
- [x] 5.3 家具列表 API
- [x] 5.4 房间家具管理 API
- [x] 5.5 房间前端页面（2D 布置）
- [x] 5.6 家具选择面板
- [x] **Status:** complete

### Phase 6: 首页与导航
- [x] 6.1 首页设计开发
- [x] 6.2 导航栏与路由整合
- [x] 6.3 个人中心页面
- [x] **Status:** complete

### Phase 7: 收尾与测试
- [ ] 7.1 前后端联调
- [ ] 7.2 功能测试验证
- [ ] 7.3 文档整理
- [ ] **Status:** in_progress

## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 14 + Spring Boot | 前后端分离架构，前端 SSR/SSG 友好，后端 Java 成熟稳定 |
| MySQL + Redis | MySQL 存业务数据，Redis 缓存品种数据减少 API 调用 |
| The Cat API 同步到本地 | 保证数据可控，支持离线访问，便于扩展 |
| JWT 用户认证 | 无状态认证，适合前后端分离架构 |
| 2D Canvas/CSS Grid 房间 | 简化实现，聚焦核心功能 |

## Technical Stack Summary

| Layer | Technology |
|-------|------------|
| Frontend | Next.js 14 (App Router), React, Tailwind CSS |
| Backend | Spring Boot 3.x (Java 17+) |
| Database | MySQL 8.x |
| Cache | Redis |
| External API | The Cat API (https://api.thecatapi.com/v1) |
| Auth | JWT (jjwt library) |

## Error Log
| Error | Attempt | Resolution |
|-------|---------|------------|
| - | - | - |

## Notes
- 设计文档已保存在 `docs/plans/2026-03-30-catcat-design.md`
- 原型页面保存在 `prototypes/` 目录
- 设计规则：严格遵守 `AGENTS.md`（反主流美学）
  - 配色：大地色系（#C8956C 焦糖橙 + #F7F3EF 暖白 + #2D2926 暖黑）
  - 背景：必须带噪点纹理
  - 字体：DM Sans (display) + Crimson Pro (body)
  - 图标：Iconify (Lucide Icons)
  - 动画：禁止 ease-in-out，使用 cubic-bezier 弹性曲线
  - 禁止：紫色/蓝紫渐变、Hero+三卡片、Emoji功能图标
