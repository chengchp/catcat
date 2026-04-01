# Findings & Decisions

## Requirements (from user)
- 猫猫社区网站，汇聚全世界猫猫品种
- 提供品种预览（品种百科）
- 云领养虚拟猫（随机生成外观）
- 建立家园体系（虚拟房间 + 家具布置）

## Research Findings

### The Cat API
- **Base URL**: `https://api.thecatapi.com/v1`
- **认证方式**: `X-API-KEY` 请求头
- **主要端点**:
  - `GET /breeds` - 品种列表（支持分页 page, limit）
  - `GET /breeds/{breed_id}` - 品种详情
  - `GET /breeds/search?q=` - 品种搜索
- **数据字段**: id, name, origin, description, temperament, life_span, weight, image_url, wikipedia_url
- **免费账号**: 基础端点可访问，高级功能需付费

### OpenAPI 规范
- 文档地址: `https://raw.githubusercontent.com/thatapicompany/apis/main/theCatAPI.com/thecatapi-oas.yaml`
- 版本: v1.6.3, OpenAPI 3.0.0

## Technical Decisions

| Decision | Rationale |
|----------|-----------|
| Next.js 14 (App Router) | 服务端渲染利于 SEO，App Router 是最新标准 |
| Spring Boot 3.x | Java 生态主流，用户熟悉 |
| MySQL 存品种数据 | 缓存外部 API 数据，保证可控性和稳定性 |
| Redis 缓存 | 减少外部 API 调用，提升性能 |
| JWT 认证 | 无状态，适合前后端分离 |
| 2D 房间视图 | MVP 阶段简化实现，聚焦核心功能 |

## Issues Encountered
| Issue | Resolution |
|-------|------------|
| The Cat API 文档页需要 JS 才能显示 | 使用 OpenAPI YAML 规范文档分析 API |

## Resources
- The Cat API OpenAPI: `https://raw.githubusercontent.com/thatapicompany/apis/main/theCatAPI.com/thecatapi-oas.yaml`
- 设计文档: `docs/plans/2026-03-30-catcat-design.md`
- Next.js 文档: https://nextjs.org/docs
- Spring Boot 文档: https://spring.io/projects/spring-boot

## Visual/Browser Findings
- WebFetch 无法获取需要 JavaScript 渲染的页面
- OpenAPI YAML 格式是机器可读的 API 规范，可直接解析端点和数据结构
