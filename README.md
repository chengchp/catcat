# CatCat 🐱

[English](#english) | [中文](#中文)

---

<a id="english"></a>

## CatCat — A Cat Lover's Community

CatCat is a warm and playful cat community platform featuring a breed encyclopedia, virtual cat adoption, and a virtual home system. Designed with earth tones and an elastic, lively aesthetic.

### Features

- **Breed Encyclopedia** — Browse 60+ cat breeds with search, filters (origin / size / coat length), and detailed profiles covering personality, care tips, and more.
- **Virtual Adoption** — A 3-step adoption flow (random cat → name it → take it home) with a DNA generation system that creates unique coat colors, patterns, eye colors, fur lengths, and tail types.
- **Virtual Home** — A top-down 2D room where you place furniture (beds, toys, food bowls, decorations, litter boxes…) on a grid. 15 items are pre-unlocked.
- **User System** — JWT-based authentication, profile management, and quick access to adoption and room features.

### Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), TypeScript, Tailwind CSS |
| Backend | Spring Boot 3.1.6, Java 17, MyBatis Plus |
| Database | MySQL 8.0 |
| Cache | Redis |
| Auth | JWT (JJWT) |
| External API | The Cat API (breed data sync) |

### Project Structure

```
catcat/
├── catcat-frontend/       # Next.js frontend
│   └── src/
│       ├── app/           # Pages (App Router)
│       ├── components/    # Reusable UI components
│       ├── lib/           # API utilities
│       └── styles/        # Global styles
├── catcat-service/        # Service layer (entities, mappers, services, DTOs)
├── catcat-boot/           # Application entry point (controllers, config)
├── docs/                  # Schema SQL, design docs
└── pom.xml                # Parent POM (multi-module Maven)
```

### Getting Started

#### Prerequisites

- Node.js 18+
- Java 17+
- MySQL 8.0+
- Redis
- Maven 3.8+

#### Backend

```bash
# 1. Create MySQL database and run schema
mysql -u root -p < docs/schema.sql

# 2. Update database config in application.yml

# 3. Build and run
mvn clean install
cd catcat-boot
mvn spring-boot:run
```

#### Frontend

```bash
cd catcat-frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`, backend at `http://localhost:8080`.

### Design Philosophy

- **Earth tones**: caramel orange `#C8956C` + warm white `#F7F3EF` + warm black `#2D2926`
- **Elastic animations**: cubic-bezier curves everywhere — no linear transitions
- **Textured backgrounds**: noise or gradient — no flat colors
- **Conversational copy**: short, specific, lightly humorous

---

<a id="中文"></a>

## CatCat — 猫猫社区

CatCat 是一个温暖有趣的猫咪社区平台，提供品种百科、云领养和虚拟家园功能。采用大地色系和弹性动效设计，拒绝千篇一律的模板风格。

### 功能特性

- **品种百科** — 收录 60+ 猫咪品种，支持搜索和按产地 / 体型 / 毛长筛选，详情页包含性格、饲养建议等丰富信息。
- **云领养** — 三步领养流程（随机选猫 → 取名字 → 带回家），内置 DNA 生成系统，随机产出独特的毛色、花纹、瞳色、毛长和尾巴类型。
- **虚拟家园** — 2D 俯视角房间，支持网格化家具摆放（猫窝、玩具、食盆、装饰品、猫砂盆等），15 件家具预解锁。
- **用户系统** — JWT 登录注册、个人资料管理、快捷入口直达领养和家园。

### 技术栈

| 层级 | 技术 |
|------|------|
| 前端 | Next.js 14 (App Router)、TypeScript、Tailwind CSS |
| 后端 | Spring Boot 3.1.6、Java 17、MyBatis Plus |
| 数据库 | MySQL 8.0 |
| 缓存 | Redis |
| 认证 | JWT (JJWT) |
| 外部接口 | The Cat API（品种数据同步） |

### 项目结构

```
catcat/
├── catcat-frontend/       # Next.js 前端
│   └── src/
│       ├── app/           # 页面 (App Router)
│       ├── components/    # 可复用 UI 组件
│       ├── lib/           # API 工具函数
│       └── styles/        # 全局样式
├── catcat-service/        # 服务层（实体、Mapper、Service、DTO）
├── catcat-boot/           # 启动模块（Controller、配置）
├── docs/                  # 数据库 Schema、设计文档
└── pom.xml                # 父 POM（多模块 Maven）
```

### 快速开始

#### 环境要求

- Node.js 18+
- Java 17+
- MySQL 8.0+
- Redis
- Maven 3.8+

#### 后端

```bash
# 1. 创建 MySQL 数据库并导入 Schema
mysql -u root -p < docs/schema.sql

# 2. 修改 application.yml 中的数据库配置

# 3. 构建并运行
mvn clean install
cd catcat-boot
mvn spring-boot:run
```

#### 前端

```bash
cd catcat-frontend
npm install
npm run dev
```

前端运行在 `http://localhost:3000`，后端运行在 `http://localhost:8080`。

### 设计理念

- **大地色系**：焦糖橙 `#C8956C` + 暖白 `#F7F3EF` + 暖黑 `#2D2926`
- **弹性动效**：全局使用 cubic-bezier 曲线，禁止线性动画
- **质感背景**：噪点纹理或渐变，禁止纯平色块
- **对话式文案**：简短、具体、带点幽默

---

## License

MIT
