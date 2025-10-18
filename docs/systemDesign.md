# 系统设计文档

## 1. 技术栈说明

### 前端

- **Preact + DaisyUI 5 + Tailwind CSS 4**：轻量高效，采用岛屿架构，所有 UI
  组件和表单均使用 DaisyUI 5 组件和 Tailwind 工具类，响应式设计。
- **Fresh SSR**：Deno 官方推荐的服务端渲染框架，支持“岛屿架构”。
- **Vite**：现代前端构建工具，支持热更新和高效开发。

### 后端

- **Deno + Fresh**：现代 TypeScript 运行环境，服务端渲染与 REST
  API，强类型、易维护。
- **SQLite**：单文件关系型数据库，适合小型/中型实验室场景，支持多表关联。
- **TypeScript**：全栈类型安全。
- **Docker**：容器化部署，便于环境一致性和迁移。

### 开发工具与环境

- ESLint & Prettier：代码规范
- Jest：单元测试
- Nginx：反向代理服务器
- GitHub Actions / GitLab CI：自动化测试与部署

---

## 2. 架构设计

### 前端模块划分

- 认证模块（登录/注册/权限）
- 预约管理模块（表单、状态、日历）
- 样本管理模块（列表、详情、批量导入）
- 实验管理模块（板级实验、孔级结果）
- 数据统计模块（可视化、导出）

### 后端模块划分

- API网关层（验证、路由、响应）
- 业务服务层（用户、预约、样本、实验、统计）
- 数据访问层（实体映射、数据库操作）
- 公共服务层（日志、文件、通知）

### 部署方案

- 本地开发：Docker Compose运行SQLite，Deno本地开发服务器，Vite开发服务器
- 测试环境：CI/CD自动化测试，容器化部署
- 生产环境：云服务器（如 AWS EC2）、数据库（SQLite 或
  PostgreSQL）、对象存储（S3/OSS）、CDN（CloudFront/阿里云CDN）
- 安全措施：HTTPS加密、WAF防火墙、数据库加密、定期备份
- 监控告警：服务器监控、应用性能监控、日志收集、告警通知

---

## 3. 数据库表结构

### 用户表 (users)

- id, username, password, email, department, phone, role, created_at, updated_at

### 预约表 (appointments)

- id, user_id, status, appointment_date, time_slot, sample_count, notes,
  created_at, updated_at

### 样本表 (samples)

- id, appointment_id, name, type, resistance, vector, length, concentration,
  description, status, location, created_at

### 引物表 (primers)

- id, sample_id, type, name, sequence

### 实验表 (experiments) -- 每块板一次实验

- id, plate_code, operator_id, status, start_time, end_time, instrument,
  created_at

### 反应表 (reactions) -- 每个孔一个反应

- id, experiment_id, well, sample_id, primer_id, result, quality_score, status,
  created_at

### 引物库表 (primer_library)

- id, name, sequence

---

## 4. 数据处理流程（核心业务流）

1. 用户注册/登录，分配角色
2. 用户创建预约，录入样品
3. 用户为样品添加引物
4. 技术员创建实验（板），分配样品和引物到孔，生成反应记录
5. 技术员上传测序结果
6. 用户/管理员查询进度与结果
