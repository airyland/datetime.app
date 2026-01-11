# BeCool DateTime SEO & Features Todo List

## 1. 内容与关键词策略 (Content Strategy)

### A. Programmatic SEO (程序化 SEO)
- [x] **城市对时差页面 (City-to-City Comparisons)**
    - [x] 创建 `/time-difference/[city-a]-vs-[city-b]` 页面路由
    - [x] 实现展示两个城市的当前时间、时差逻辑
    - [x] 添加最佳会议时间计算功能
    - [x] 添加飞行时长估算功能
    - [x] 优化页面 Meta 信息（关键词: "Time difference London vs New York", "London to Tokyo meeting planner"）
- [x] **特定年份/日期的日历页**
    - [ ] 创建 `/calendar/2026` 和 `/calendar/2026/january` 等页面路由
    - [x] 实现月度法定节假日展示
    - [x] 实现农历展示（针对亚洲市场）
    - [ ] 实现周数统计功能
- [x] **倒计时页面**
    - [x] 为主要节日生成着陆页 (如 `/countdown/christmas`, `/countdown/new-year-2027`)

### B. 工具即内容 (Tools as Content)
- [x] 开发 **Unix 时间戳转换器** 页面
- [x] 开发 **工作日计算器** 页面 (排除周末和节假日)
- [x] 开发 **日期差计算器** 页面

### C. 博客内容方向
- [x] 撰写 **效率与时间管理** 类文章 ("番茄工作法指南", "如何高效跨时区远程办公")
- [ ] 撰写 **冷知识** 类文章 ("为什么有的国家有时差半小时？", "格林威治标准时间的历史")
- [x] 撰写 **节假日指南** 类文章 ("2026年各国公共假期汇总及拼假攻略")

## 2. 技术 SEO (Technical SEO)

### A. 结构化数据 (Schema Markup)
- [x] **FAQPage Schema**: 在 `age-calculator` 或 `holidays` 页面添加常见问题结构化数据
- [x] **WebApplication / SoftwareApplication Schema**: 标记主页和主要工具页
- [x] **BreadcrumbList Schema**: 优化所有页面的面包屑导航结构化数据

### B. 国际化 (i18n) 增强
- [x] **hreflang 标签**: 检查并确保 `layout.tsx` 或 `head` 中正确生成所有语言版本的 `hreflang` 链接
- [x] **本地化日期格式**: 审查各 locale 下的日期格式（DD/MM/YYYY vs MM/DD/YYYY）是否符合当地习惯

### C. 性能与体验 (Core Web Vitals)
- [x] **CLS 优化**: 检查时钟、倒计时组件，确保使用骨架屏或固定高度以防止页面跳动
- [ ] **LCP 优化**: 优化首屏大字号时间的加载策略，解决客户端渲染导致的“闪烁”问题

## 3. 新功能建议 (Feature Suggestions)

### A. 实用工具扩展
- [x] **会议调度器 (Meeting Planner)**
    - [x] 开发多城市添加功能
    - [x] 开发滑块可视化查看重叠"工作时间"功能
- [x] **番茄钟 (Pomodoro Timer)**
    - [x] 开发在线专注时钟
    - [x] 添加简单任务列表功能
    - [x] 添加通知音效
- [x] **日出日落与月相 (Sunrise/Sunset & Moon Phases)**
    - [x] 实现基于地理位置显示天文时间的功能
- [x] **闹钟/秒表 (Online Alarm/Stopwatch)**
    - [x] 开发基础闹钟和秒表工具

### B. 病毒式传播/社交功能
- [x] **"我的人生进度条" (Life Progress Bar)**
    - [x] 基于年龄计算器开发可视化展示页面
    - [x] 实现生成分享图片功能
- [x] **可嵌入的时钟小组件 (Embeddable Widgets)**
    - [x] 开发可嵌入的代码片段 (iframe) 功能
- [x] **个性化分享图**
    - [x] 在日历或倒计时页面实现一键生成带品牌 Logo 的图片功能

## 4. 现有代码优化点 (Quick Wins)
- [ ] **Meta 数据**: 检查 `generateMetadata` 函数，确保每个动态页面（如 `/cities/[city]`）都有独特的 Title 和 Description
- [x] **内链构建**: 优化博客文章模板，自动识别关键词并链接到相关的工具页
- [x] **404 页面**: 优化 custom 404 页面，增加热门工具的快捷入口
