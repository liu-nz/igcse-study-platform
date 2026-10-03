# IGCSE 智能备考平台 · IGCSE Smart Revision Platform

专门帮助中文母语者理解 IGCSE 英文考点、术语与答题要求的免费双语备考网站。
A free bilingual IGCSE revision site for native Chinese speakers, connecting Chinese explanations with English exam terminology.

所有核心学习功能均在浏览器本地运行，无付费 AI 或云服务依赖。学习助手匹配内置关键词知识库，不是大型 AI 模型，也不能读取上传文件。账号和成员记录仅存在当前浏览器，不代表真实云端登录或协作。
Core study features run locally. The Study Assistant uses a built-in keyword knowledge base, without an AI model or file reading. Accounts and member records are browser-local, without cloud authentication or collaboration.

## 复习闭环

错题答对后保留历史，学生可手动标记已解决；再次答错自动重新加入复习。支持概念、粗心、计算、审题、术语和其他六类错因。首页与错题重练只推荐待巩固题目。

薄弱专题按科目 + 专题分别统计实际作答，至少 5 次且正确率低于 60% 才推荐专项训练。此阈值减少小样本误判，不代表官方考试预测。

## 考试指令词与英文答题表达

新增「考试指令词」页：14 个指令词的中文说明、英文表达示例、常见误区与官方来源链接，附 8 道原创答法辨析练习。错过的词加入待巩固，连续两次辨析正确后移出，历史保留；这不等于真实考试答题已经掌握。当前身份的指令词进度可随 v2 备份迁移，导入同词仍保留本机状态。

四个重点科目各 9 道（合计 36 道）代表性题目新增中文思路、英文术语、原创表达示例与失分提醒，答题解析和错题本均可查看。其余题目继续使用已有解析，不声称已完成全部题库的答题指导。所有示例为本站原创教学内容，不是官方评分标准；答题长度与要点应结合具体题目、分值、科目考纲。

来源：[Cambridge 指令词说明](https://www.cambridgeinternational.org/exam-administration/what-to-expect-on-exams-day/command-words/)；[Math 0580 2025–2027 考纲](https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf)。compare 应按题目比较相同点和／或不同点，不能强行套用“每次必须两者都写”的规则。

## 中断后继续刷题

刷题页显示当前本机身份的未完成练习，可继续原题目顺序、答案、未提交选择和计时。暂停、离开页面、切换到后台及刷新时会保存；离开期间不计时。已提交答案在恢复时不重复计入统计、错题或 SRS。完成练习后草稿清除，整次记录只保存一次。

每个本机身份保留一份草稿，新练习会先询问是否替换；草稿不进入跨设备备份。题库题目或选项更新后，旧草稿会提示不可恢复，已提交学习记录仍保留。建议同一身份只在一个标签页答题；突然终止浏览器时可能损失最后约 10 秒的计时，存储失败会显示现有警告。

## 零成本备份与换设备

在「设置 → 数据管理」导出 JSON，再在另一台设备选择文件、查看预览、点击「合并导入」。兼容旧版 v1 导出与新版 v2（最大 5 MB）。备份包含练习、错题、SRS、闪卡、资料索引及当前用户的默写词进度，不包含账号、成员、API 凭据或资料文件本体；默写中的输入会话不迁移。

重复导入不会叠加同一练习；已有同题错题、SRS、默写状态及账号、设置以本机为准。闪卡合并不重复的卡片，资料按 ID 合并。每日统计和时长采用快照最大值与已去重历史的较大值，避免重复叠加；跨设备尚未完成的独立答题统计可能无法完整相加，这属于手动迁移而非实时同步。

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
- **成员与身份 Members & roles**：登录/注册/访客进入时自动登记成员，记录身份（所有者 / 协作者 / 只读访客）、加入时间、最后访问与访问次数。邮箱等详细信息仅所有者可见。
  Every sign-in registers the member with their role, join date, last visit and visit count. Contact details are owner-only.
- **成员学习档案 Member study stats**：每位成员的总学习时长、总题量、正确率与今日数据记录在成员列表中（仅统计题库练习）。
  Each member's total study time, questions, accuracy and today's activity are shown in the member list.
- **权限控制 Access control**：成员管理仅所有者与协作者可访问；访客账户看不到该入口，强行跳转会被拦截并提示。
  Members is restricted to owners and collaborators — guests cannot see or open it.
- 8 大科目题库（数学/物理/化学/生物/经济/英语 ESL/ICT/计算机科学），217 道练习题，120 张闪卡（10 个卡组），40 份资料，14 套真题，10 个 内置知识点。
- 纯前端实现，零依赖，打开即用。响应式设计适配手机和电脑端。
  Pure front end, no dependencies, responsive on phone and desktop.

## 演示账号 Demo accounts
- 邮箱 Email：demo@igcse.com
- 密码 Password：123456
- 访客密码 Guest code：guest123

## 技术栈 Tech stack
HTML5 + CSS3 + 原生 JavaScript + localStorage + Canvas

## License
MIT


资料中心支持按名称／文件名搜索、科目／类型／标签筛选、管理用户标签、重命名和删除。新上传的 PDF、Office、文本和图片附件以 IndexedDB 存在当前浏览器（单个文件上限 50 MB），PDF 可直接打开，其余可下载。浏览器清理数据或换设备前请自行保留原文件；导出备份只含索引，不含附件；早期版本只保存索引的旧记录不会自动恢复文件本体。

真题页按来源标记 Cambridge 官方历年真题、官方样卷和第三方目录，并分开显示考季、卷号、评分标准及适用说明。旧卷开始练习前请核对当年考纲。链接可用性于 2026-10-03 批量检查。
