你是一个高级前端开发工程师。请在这个 Vite + React + Tailwind CSS 项目中，构建一个「历史时光轴」Web App。

## 项目背景
这是一个送给高中历史老师的小礼物，用于历史教学和历史探索。

## 技术栈
- React + Vite（已搭建好）
- Tailwind CSS v4（已配置好 vite.config.js 和 index.css，使用 @tailwindcss/vite 插件）
- framer-motion（已安装，用于动画）
- 数据内嵌在 JSON 文件中，不需要后端

## 核心功能

### 1. 历史数据 (src/data/)
创建 src/data/historyData.json，包含中国古代史核心事件（50-80条），按朝代分组：
- 先秦（夏商周、春秋战国）
- 秦汉
- 三国两晋南北朝
- 隋唐
- 五代十国宋元
- 明清

每条事件包含：id, title, year（年份，负数表示公元前）, dynasty, category（战争/文化/科技/政治/经济）, description（50-100字简介）, figures（相关人物数组）, significance（历史意义）

### 2. 时间轴主视图 (src/components/Timeline.jsx)
- 垂直时间轴，从上到下按时间顺序排列
- 左侧显示年份和朝代标签
- 右侧显示事件卡片
- 按朝代用不同颜色区分
- 滚动时朝代标签固定在顶部
- 点击事件卡片展开详情

### 3. 朝代导航 (src/components/DynastyNav.jsx)
- 顶部固定导航栏
- 显示各朝代按钮，点击跳转到对应位置
- 当前滚动到的朝代高亮

### 4. 搜索筛选 (src/components/SearchFilter.jsx)
- 关键词搜索事件标题、描述、人物
- 按类别筛选（战争/文化/科技/政治/经济）
- 搜索结果实时过滤时间轴

### 5. 历史上的今天 / 随机探索 (src/components/TodayInHistory.jsx)
- 侧边栏或弹窗
- 随机展示一个历史事件（因为古代事件没有月日，改为随机探索）
- 每次点击刷新一个新事件

### 6. 事件详情弹窗 (src/components/EventModal.jsx)
- 点击事件卡片弹出
- 显示完整信息：标题、年份、朝代、类别、详细描述、相关人物、历史意义
- 精美的卡片设计
- 关闭按钮

### 7. 主布局 (src/App.jsx)
- 顶部：标题「历史时光轴」+ 朝代导航 + 搜索栏
- 中间：时间轴主视图
- 侧边：随机探索按钮
- 响应式设计，适配手机和电脑

## 设计风格
- 整体风格：简约中国风，温暖的米色/浅黄色背景
- 朝代配色：每个朝代一个主色调（如先秦-青铜色、秦汉-朱红、唐-金色、宋-青色、明-蓝、清-黄）
- 字体：使用系统字体，标题大而醒目
- 卡片：圆角、阴影、hover 效果
- 动画：滚动时事件卡片渐入，弹窗平滑弹出

## 重要注意
1. Tailwind CSS v4 使用 @import "tailwindcss" 语法，不需要 @tailwind 指令
2. 不需要安装额外的 UI 库，用 Tailwind 原生类即可
3. index.html 中的 title 改为「历史时光轴」
4. 确保 npm run dev 能正常运行
5. 所有代码写完后，运行 npm run dev 确认没有编译错误

## 项目目录
D:\HistoryTimeline

请直接开始编写所有代码文件。完成后确认项目能正常启动。
