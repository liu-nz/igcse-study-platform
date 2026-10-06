# IGCSE 智能备考平台 · IGCSE Smart Revision Platform

专门帮助中文母语者理解 IGCSE 英文考点、术语与答题要求的免费双语备考网站。
A free bilingual IGCSE revision site for native Chinese speakers, connecting Chinese explanations with English exam terminology.

所有核心学习功能均在浏览器本地运行，无付费 AI 或云服务依赖。学习助手默认匹配内置关键词知识库；用户可选连接兼容 API，密钥只保存在当前页面内存且不会进入备份。登录、注册和学习档案仅保存在当前浏览器，不提供云端账号、安全隔离、邮箱验证或密码找回。访客可免密码使用；换设备前请导出备份。
Core study features run locally, without paid AI or cloud dependencies. The Study Assistant defaults to its built-in keyword knowledge base; users may optionally connect a compatible API, with its key held only in page memory and excluded from backups. Accounts and study profiles stay in this browser. There is no cloud authentication, secure isolation, email verification or password recovery. Guests can enter without a password; export a backup before changing devices.

## 复习闭环

错题答对后保留历史，学生可手动标记已解决；再次答错自动重新加入复习。支持概念、粗心、计算、审题、术语和其他六类错因。首页与错题重练只推荐待巩固题目。

薄弱专题按科目 + 专题分别统计实际作答，至少 5 次且正确率低于 60% 才推荐专项训练。此阈值减少小样本误判，不代表官方考试预测。

## 考试指令词与英文答题表达

新增「考试指令词」页：14 个指令词的中文说明、英文表达示例、常见误区与官方来源链接，附 8 道原创答法辨析练习。错过的词加入待巩固，连续两次辨析正确后移出，历史保留；这不等于真实考试答题已经掌握。当前本地档案的指令词进度可随 v2 备份迁移，导入同词仍保留本机状态。

目前题库共 337 道题：四科重点专项 160 道，其余科目 177 道。新增题目覆盖数学、ICT、计算机科学、ESL、物理、化学、生物与经济，含中英题干、英文关键词和双语解析；均为原创练习，不复制官方真题。答题长度与要点应结合具体题目、分值及当年考纲。

资料中心新增 8 份原创双语指南，分别覆盖 0580 多步计算、0417 表格与数据库实操、0478 程序追踪与测试、0510 阅读写作、0625 实验与图像、0620 定性分析、0610 实验数据和 0455 解释与评价。账号切换时会将新发布的内置资料补入当前档案，同时保留用户自己的资料索引。

来源：[Cambridge 指令词说明](https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/)；[Math 0580 2025–2027 考纲](https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf)。compare 应按题目比较相同点和／或不同点，不能强行套用“每次必须两者都写”的规则。

## 中断后继续刷题

刷题页显示当前本机身份的未完成练习，可继续原题目顺序、答案、未提交选择和计时。暂停、离开页面、切换到后台及刷新时会保存；离开期间不计时。已提交答案在恢复时不重复计入统计、错题或 SRS。完成练习后草稿清除，整次记录只保存一次。

每个本地档案保留一份草稿，新练习会先询问是否替换；草稿不进入跨设备备份。题库题目或选项更新后，旧草稿会提示不可恢复，已提交学习记录仍保留。建议同一本地档案只在一个标签页答题；突然终止浏览器时可能损失最后约 10 秒的计时，存储失败会显示现有警告。

## 零成本备份与换设备

在「设置 → 数据管理」可导出两种备份：JSON 学习数据（兼容旧版 v1 与新版 v2，最大 5 MB），或完整 ZIP（最大 100 MB，其中附件合计最多 90 MB）。完整 ZIP 会携带本机 IndexedDB 中的资料附件，可在另一台设备预览后恢复；旧的 metadata-only 资料仍需重新上传。两种备份均包含当前本地档案的练习、错题、SRS、闪卡、资料索引及默写词进度，不包含账号密码或 API 凭据；默写中的输入会话不迁移。换设备后先创建或进入本地档案，再导入备份。

重复导入不会叠加同一练习；已有同题错题、SRS、默写状态、资料及账号、设置以本机为准；ZIP 中同 ID 的本地文件不会覆盖。闪卡合并不重复的卡片，资料按 ID 合并。每日统计和时长采用快照最大值与已去重历史的较大值，避免重复叠加；跨设备尚未完成的独立答题统计可能无法完整相加，这属于手动迁移而非实时同步。

新版练习保存独立会话 ID；旧版无 ID 的完全相同练习会被视为重复。题目快照按本站当前题库恢复，已移除的题目会跳过并在预览中提示。请只导入自己的本站备份，保管好文件（个人学习内容可能包含隐私）。

SRS 显示今日与逾期、明天和未来 7 天（含明天、不含今天）的题量。记忆状态按复习间隔估计，不是考试等级预测。浏览器无法保存时会显示持续提醒，可立即导出当前页面的进度。

## 功能特性 Features

- **中英双语 Bilingual**：界面文案、必考点、重点单元、闪卡、资料、题目解析全部提供中英文对照。
  All UI text, must-know points, key units, flashcards, materials and explanations are shown in Chinese with an English version.
- **考点关键词悬浮释义 Keyword tooltips**：454 条 IGCSE 高频考点词（含考试指令词 command words）自动加橙色虚线下划线标记，鼠标悬浮（手机端点击）即显示中文释义、英文原词与所属科目。可在「设置」中一键开关。
  454 exam keywords are auto-marked; hover (or tap) to see the meaning, English term and subject. Toggle in Settings.
- **默写词库 Recall & Type**：848 个词条，覆盖 ICT 0417、CS 0478、ESL 0510、Maths 0580、Physics 0625、Chemistry 0620、Biology 0610、Economics 0455，支持看释义默写与听音默写。
- **选项与答案双语 Bilingual options & answers**：题库刷题中，除英语 ESL 外的所有科目（ICT / CS / 数学 / 物理 / 化学 / 生物 / 经济）的选项与正确答案均显示「中文 + 英文」两行对照；纯数字、公式、化学式与代码类选项保持原样。
  In quiz practice, every option and correct answer for all subjects except ESL is shown in Chinese with its English equivalent; number, formula, chemical-equation and code options stay as they are.
- **本地账号 Local profiles**：可在当前浏览器注册多个独立学习档案，也可免密码进入访客档案。账号不是云端登录，学习数据不会自动同步。
  Create separate study profiles in this browser, or enter a guest profile without a password. These are not cloud accounts and do not sync automatically.
- 8 大科目题库（数学/物理/化学/生物/经济/英语 ESL/ICT/计算机科学），337 道原创练习题，120 张闪卡（10 个卡组），48 份资料，14 套真题，10 个内置知识点。
- **完整本地备份 Full local backup**：ZIP 包含学习数据与资料附件；兼容旧 JSON 备份，导入前预览，失败时回滚已写入附件。
- **可选 BYO API**：兼容 Chat Completions endpoint；默认关闭，本地知识助手照常可用，密钥不写入持久存储或备份。
- 纯前端实现，无第三方运行时依赖；响应式设计适配手机和电脑端。
  Pure front end with no third-party runtime dependency, responsive on phone and desktop.

## 技术栈 Tech stack
HTML5 + CSS3 + 原生 JavaScript + localStorage + Canvas

## License
MIT


资料中心支持按名称／文件名搜索、科目／类型／标签筛选、管理用户标签、重命名和删除。新上传的 PDF、Office、文本和图片附件以 IndexedDB 存在当前浏览器（单个文件上限 50 MB），PDF 可直接打开，其余可下载。浏览器清理数据或换设备前请自行保留原文件；导出备份只含索引，不含附件；早期版本只保存索引的旧记录不会自动恢复文件本体。

真题页按来源标记 Cambridge 官方历年真题、官方样卷和第三方目录，并分开显示考季、卷号、评分标准及适用说明。旧卷开始练习前请核对当年考纲。链接可用性于 2026-10-03 批量检查。
