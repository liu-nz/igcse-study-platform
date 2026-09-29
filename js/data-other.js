const PAST_PAPERS = [
    { id:"pp001", subject:"数学", year:"2024", season:"s", seasonName:"May/June", paper:"Paper 2 (Extended)", variant:"12", code:"0580_s24_qp_12", questions:20, duration:"1h 30m" },
    { id:"pp002", subject:"数学", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 4 (Extended)", variant:"12", code:"0580_m24_qp_42", questions:12, duration:"2h 30m" },
    { id:"pp003", subject:"数学", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 2 (Core)", variant:"11", code:"0580_w23_qp_11", questions:20, duration:"1h 30m" },
    { id:"pp004", subject:"物理", year:"2023", season:"s", seasonName:"May/June", paper:"Paper 2 (MCQ)", variant:"12", code:"0625_s23_qp_12", questions:40, duration:"45m" },
    { id:"pp005", subject:"物理", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 4 (Theory)", variant:"12", code:"0625_w23_qp_42", questions:10, duration:"1h 15m" },
    { id:"pp006", subject:"物理", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 6 (Alternative to Practical)", variant:"12", code:"0625_m24_qp_62", questions:4, duration:"1h" },
    { id:"pp007", subject:"化学", year:"2023", season:"s", seasonName:"May/June", paper:"Paper 2 (MCQ)", variant:"12", code:"0620_s23_qp_12", questions:40, duration:"45m" },
    { id:"pp008", subject:"化学", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 4 (Theory)", variant:"12", code:"0620_m24_qp_42", questions:10, duration:"1h 15m" },
    { id:"pp009", subject:"化学", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 6 (Alternative to Practical)", variant:"11", code:"0620_w23_qp_61", questions:4, duration:"1h" },
    { id:"pp010", subject:"生物", year:"2023", season:"s", seasonName:"May/June", paper:"Paper 2 (MCQ)", variant:"12", code:"0610_s23_qp_12", questions:40, duration:"45m" },
    { id:"pp011", subject:"生物", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 4 (Theory)", variant:"12", code:"0610_m24_qp_42", questions:10, duration:"1h 15m" },
    { id:"pp012", subject:"经济", year:"2024", season:"s", seasonName:"May/June", paper:"Paper 1 (MCQ)", variant:"12", code:"0455_s24_qp_12", questions:30, duration:"45m" },
    { id:"pp013", subject:"经济", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 2 (Structured)", variant:"12", code:"0455_w23_qp_22", questions:6, duration:"1h 30m" },
    { id:"pp014", subject:"英语", year:"2024", season:"s", seasonName:"May/June", paper:"Paper 1 (Reading & Writing)", variant:"2", code:"0510_s24_qp_12", questions:8, duration:"2h" },
    { id:"pp015", subject:"英语", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 2 (Listening)", variant:"2", code:"0510_w23_qp_22", questions:30, duration:"50m" },
    { id:"pp016", subject:"英语", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 3 (Speaking)", variant:"2", code:"0510_m24_qp_32", questions:3, duration:"10-12m" },
    { id:"pp017", subject:"ICT", year:"2024", season:"s", seasonName:"May/June", paper:"Paper 1 (Theory)", variant:"2", code:"0417_s24_qp_12", questions:15, duration:"1h 30m" },
    { id:"pp018", subject:"ICT", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 2 (Practical)", variant:"2", code:"0417_w23_qp_22", questions:6, duration:"2h 30m" },
    { id:"pp019", subject:"ICT", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 3 (Practical)", variant:"2", code:"0417_m24_qp_32", questions:5, duration:"2h" },
    { id:"pp020", subject:"计算机科学", year:"2024", season:"s", seasonName:"May/June", paper:"Paper 1 (Theory)", variant:"2", code:"0478_s24_qp_12", questions:12, duration:"1h 30m" },
    { id:"pp021", subject:"计算机科学", year:"2023", season:"w", seasonName:"Oct/Nov", paper:"Paper 2 (Problem-solving)", variant:"2", code:"0478_w23_qp_22", questions:8, duration:"1h 45m" },
    { id:"pp022", subject:"计算机科学", year:"2024", season:"m", seasonName:"Feb/March", paper:"Paper 1 (Theory)", variant:"1", code:"0478_m24_qp_11", questions:12, duration:"1h 30m" },
];

const MATERIALS_DATA = [
    { id:"mat001", name:"IGCSE Maths 0580 Syllabus 2024-2026 考纲", type:"summary", subject:"数学", icon:"📋", size:"2.3 MB", date:"2024-09-01", tags:["考纲 Syllabus","官方 Official"] },
    { id:"mat002", name:"Physics 0625 力学章节讲义 Mechanics Notes", type:"notes", subject:"物理", icon:"📖", size:"5.1 MB", date:"2024-09-10", tags:["力学 Mechanics","重点 Key"] },
    { id:"mat003", name:"Chemistry 0620 Past Paper 2023 May/June", type:"pastpaper", subject:"化学", icon:"📄", size:"1.8 MB", date:"2023-06-15", tags:["真题 Past paper","2023"] },
    { id:"mat004", name:"Biology 0610 Mark Scheme 2023 评分标准", type:"markscheme", subject:"生物", icon:"✅", size:"0.9 MB", date:"2023-08-20", tags:["评分标准 Mark scheme"] },
    { id:"mat005", name:"Economics 0455 宏观经济学笔记 Macro Notes", type:"notes", subject:"经济", icon:"📖", size:"3.2 MB", date:"2024-09-15", tags:["宏观 Macro","重点 Key"] },
    { id:"mat006", name:"Maths 0580 Past Paper 2024 Feb/March", type:"pastpaper", subject:"数学", icon:"📄", size:"1.2 MB", date:"2024-03-10", tags:["真题 Past paper","2024"] },
    { id:"mat007", name:"Physics 公式速查表 Formula Sheet", type:"summary", subject:"物理", icon:"📋", size:"0.5 MB", date:"2024-09-20", tags:["公式 Formula","速查 Quick ref"] },
    { id:"mat008", name:"Chemistry 有机化学总结 Organic Summary", type:"summary", subject:"化学", icon:"📋", size:"1.6 MB", date:"2024-09-18", tags:["有机化学 Organic","总结 Summary"] },
    { id:"mat009", name:"English ESL 0510 Grammar Guide 语法指南", type:"notes", subject:"英语", icon:"📖", size:"2.8 MB", date:"2024-09-12", tags:["语法 Grammar","重点 Key"] },
    { id:"mat010", name:"ESL 0510 Writing Sample Essays 范文", type:"notes", subject:"英语", icon:"📖", size:"1.5 MB", date:"2024-09-14", tags:["写作 Writing","范文 Essays"] },
    { id:"mat011", name:"ICT 0417 Syllabus 2024-2026 考纲", type:"summary", subject:"ICT", icon:"📋", size:"1.9 MB", date:"2024-09-01", tags:["考纲 Syllabus","官方 Official"] },
    { id:"mat012", name:"ICT 0417 Networks & Security Notes 网络与安全", type:"notes", subject:"ICT", icon:"📖", size:"3.4 MB", date:"2024-09-16", tags:["网络 Network","安全 Security"] },
    { id:"mat013", name:"Computer Science 0478 Pseudocode Guide 伪代码", type:"notes", subject:"计算机科学", icon:"📖", size:"2.1 MB", date:"2024-09-17", tags:["算法 Algorithm","伪代码 Pseudocode"] },
    { id:"mat014", name:"CS 0478 Data Representation Summary 数据表示", type:"summary", subject:"计算机科学", icon:"📋", size:"0.8 MB", date:"2024-09-19", tags:["数据表示 Data","二进制 Binary"] },
    { id:"mat015", name:"ESL 0510 Vocabulary List 高频词汇表", type:"summary", subject:"英语", icon:"📋", size:"1.2 MB", date:"2024-09-21", tags:["词汇 Vocabulary","高频 High-freq"] },
    { id:"mat016", name:"ICT 0417 Database Concepts 数据库概念", type:"notes", subject:"ICT", icon:"📖", size:"2.6 MB", date:"2024-09-22", tags:["数据库 Database","重点 Key"] },
    { id:"mat017", name:"CS 0478 Logic Gates & Boolean Algebra 逻辑门", type:"notes", subject:"计算机科学", icon:"📖", size:"1.8 MB", date:"2024-09-23", tags:["逻辑门 Logic","布尔代数 Boolean"] },
    { id:"mat018", name:"Biology 0610 Human Systems Summary 人体系统", type:"summary", subject:"生物", icon:"📋", size:"2.0 MB", date:"2024-09-24", tags:["人体 Human","总结 Summary"] },
];

const MEMBERS_DATA = [
    { name:"我 (Demo)", role:"owner", roleName:"所有者 Owner", joinDate:"2024-09-01", lastActive:"刚刚", avatarColor:"#e74c3c" },
    { name:"小明", role:"collab", roleName:"协作者 Collaborator", joinDate:"2024-09-05", lastActive:"2小时前", avatarColor:"#2980b9" },
    { name:"小红", role:"collab", roleName:"协作者 Collaborator", joinDate:"2024-09-10", lastActive:"昨天", avatarColor:"#27ae60" },
    { name:"访客A", role:"guest", roleName:"只读访客 Guest", joinDate:"2024-09-15", lastActive:"3天前", avatarColor:"#7f8c8d" },
];

const AI_KNOWLEDGE = {
    "牛顿第二定律": {
        answer: "牛顿第二定律 Newton's Second Law：物体加速度与合外力成正比，与质量成反比，方向与合外力相同。\n\n公式 Formula：F = ma\n\n• F = 合外力 Resultant force (N)\n• m = 质量 Mass (kg)\n• a = 加速度 Acceleration (m/s²)\n\n关键点 Key points：\n1. F 是合外力，所有力的矢量和 Vector sum\n2. 力和加速度都是矢量 Vector，方向一致\n3. 1N = 1kg·m/s²\n\n例题 Example：5kg 物体受 20N 合力，a = F/m = 20/5 = 4 m/s²",
        source: "Physics 0625 力学 Mechanics" },
    "化学平衡": {
        answer: "化学平衡 Chemical Equilibrium：可逆反应中，正反应速率=逆反应速率时，反应物和生成物浓度不再变化的状态。\n\n特征 Features：\n• 动态平衡 Dynamic equilibrium（反应仍在进行）\n• 浓度恒定 Constant concentration\n• 条件改变平衡移动\n\n勒夏特列原理 Le Chatelier's Principle：平衡向减弱改变的方向移动。\n\n影响因素 Factors：\n1. 浓度 Concentration：增加反应物→正向移动\n2. 温度 Temperature：升温→向吸热方向 Endothermic\n3. 压强 Pressure：加压→向气体分子数减少方向\n\n注意：催化剂 Catalyst 不改变平衡位置，只加快达到平衡的速度。",
        source: "Chemistry 0620 反应速率与平衡" },
    "二次方程": {
        answer: "二次方程 Quadratic Equation 一般形式：ax² + bx + c = 0 (a≠0)\n\n解法一：因式分解 Factorise\n化为 (x-p)(x-q)=0，则 x=p 或 x=q\n\n解法二：求根公式 Quadratic formula\nx = (-b ± √(b²-4ac)) / 2a\n\n判别式 Discriminant Δ = b²-4ac：\n• Δ>0：两个不同实根 Two distinct real roots\n• Δ=0：一个重根 One repeated root\n• Δ<0：无实根 No real roots\n\n解法三：配方法 Completing the square\n化为 (x + b/2a)² = (b²-4ac)/4a²",
        source: "Maths 0580 代数 Algebra" },
    "需求价格弹性": {
        answer: "需求价格弹性 Price Elasticity of Demand (PED)：衡量需求量对价格变化的敏感程度。\n\n公式 Formula：PED = %ΔQd / %ΔP\n\n分类 Types：\n• PED>1：富有弹性 Elastic（奢侈品 Luxury，替代品多）\n• PED<1：缺乏弹性 Inelastic（必需品 Necessity）\n• PED=1：单位弹性 Unitary\n• PED=0：完全无弹性 Perfectly inelastic\n• PED=∞：完全弹性 Perfectly elastic\n\n影响因素 Factors：替代品数量、必需品vs奢侈品、占收入比例、时间长短。\n\n应用：企业根据 PED 决定涨价/降价来增加总收入 Revenue。",
        source: "Economics 0455 弹性 Elasticity" },
    "光合作用": {
        answer: "光合作用 Photosynthesis：绿色植物利用光能 Light energy，将 CO₂ 和 H₂O 转化为葡萄糖 Glucose 和 O₂。\n\n总反应式 Equation：6CO₂ + 6H₂O →(光/叶绿体 Chloroplast)→ C₆H₁₂O₆ + 6O₂\n\n场所：叶绿体 Chloroplast（含叶绿素 Chlorophyll）\n\n两阶段 Two stages：\n1. 光反应 Light-dependent：类囊体膜上，水光解产生 O₂、ATP、NADPH\n2. 暗反应 Light-independent (Calvin cycle)：基质中，CO₂还原为葡萄糖\n\n影响因素 Limiting factors：光照强度 Light intensity、CO₂浓度、温度 Temperature（影响酶）",
        source: "Biology 0610 光合作用 Photosynthesis" },
    "被动语态": {
        answer: "被动语态 Passive Voice：主语是动作的承受者 Recipient，而非执行者 Agent。\n\n基本结构 Structure：be + 过去分词 Past participle\n\n各时态 Tenses：\n• 一般现在：am/is/are + done\n• 一般过去：was/were + done\n• 现在进行：am/is/are being + done\n• 现在完成：have/has been + done\n• 一般将来：will be + done\n\n使用场景 When to use：\n1. 不知执行者 Unknown agent\n2. 执行者不重要或显而易见\n3. 强调承受者 Emphasise recipient\n4. 正式文体 Formal writing（科技/新闻）\n\n注意：by + 执行者 可省略。",
        source: "English ESL 0510 Grammar" },
    "条件句": {
        answer: "英语四种主要条件句 Conditionals：\n\n零条件句 Zero Conditional — 普遍真理 General truth\n结构：If + 一般现在时, 一般现在时\n例：If you heat water to 100°C, it boils.\n\n第一条件句 First Conditional — 真实将来 Real future\n结构：If + 一般现在时, will + V\n例：If it rains, we will stay home.\n\n第二条件句 Second Conditional — 与现在相反 Unreal present\n结构：If + 一般过去时, would + V（be用were）\n例：If I were rich, I would travel.\n\n第三条件句 Third Conditional — 与过去相反 Unreal past\n结构：If + 过去完成时 Past perfect, would have + p.p.\n例：If I had studied, I would have passed.",
        source: "English ESL 0510 Grammar" },
    "网络拓扑": {
        answer: "网络拓扑 Network Topology：网络设备的物理或逻辑布局。\n\n常见类型 Types：\n\n1. 星型 Star：所有设备连中心交换机。优点：故障隔离容易。缺点：中心故障全网瘫痪。\n\n2. 总线 Bus：共享主干电缆。优点：简单低成本。缺点：主干故障全网瘫痪。\n\n3. 环型 Ring：设备连成环，数据单向传输。优点：无冲突。缺点：一个设备故障影响全网。\n\n4. 网状 Mesh：多路径连接。优点：高可靠性冗余。缺点：成本高布线复杂。\n\n5. 树型 Tree/Hierarchical：星型扩展，多层级。企业最常用。\n\n现代局域网常用星型，互联网是网状实例。",
        source: "ICT 0417 Networks" },
    "二进制": {
        answer: "二进制 Binary：只用 0 和 1 的数制，计算机内部数据表示基础。\n\n二进制转十进制 Binary to decimal：从右到左每位×2的幂（1,2,4,8,16...）相加。\n例：1011₂ = 1×8+0×4+1×2+1×1 = 11₁₀\n\n十进制转二进制 Decimal to binary：不断除以2记录余数，从下往上读。\n例：25 → 11001₂\n\n单位 Units：\n• 1 bit 位 = 一个0或1\n• 1 byte 字节 = 8 bits\n• 1 nibble = 4 bits\n• 1 KB = 1024 bytes\n\n十六进制 Hex：4位二进制=1位十六进制，0-9, A-F。如 FF=255。",
        source: "Computer Science 0478 Data Representation" },
    "排序算法": {
        answer: "IGCSE CS 要求掌握的排序算法 Sorting Algorithms：\n\n1. 冒泡排序 Bubble Sort\n• 原理：比较相邻元素交换，每轮最大元素到末尾\n• 时间复杂度 Time complexity：O(n²)\n• 优点：简单。缺点：效率低\n\n2. 插入排序 Insertion Sort\n• 原理：将元素插入已排序部分的正确位置\n• 时间复杂度：O(n²)\n• 对近乎有序的数据效率高\n\n3. 快速排序 Quick Sort\n• 原理：选基准 Pivot，分区 Partition 后递归\n• 平均 O(n log n)，最坏 O(n²)\n• 实际最快通用排序之一\n\n4. 归并排序 Merge Sort\n• 原理：分治法 Divide and conquer，分割后合并\n• 时间复杂度：O(n log n)\n• 稳定但需额外内存\n\n搜索 Search：线性搜索 Linear O(n)（无需有序），二分搜索 Binary O(log n)（必须有序）",
        source: "Computer Science 0478 Algorithms" },
    "CPU": {
        answer: "CPU 中央处理器 Central Processing Unit：计算机的'大脑'，执行指令和处理数据。\n\n组成 Components：\n• ALU 算术逻辑单元 Arithmetic Logic Unit：执行算术（加减乘除）和逻辑运算（AND/OR/NOT）\n• CU 控制单元 Control Unit：协调和控制计算机各部件，从内存取指令并解码执行\n• 寄存器 Registers：高速临时存储，如 PC 程序计数器、ACC 累加器、MAR/MDR\n\n指令周期 Instruction Cycle：\n1. 取指 Fetch：从内存取指令到 MDR\n2. 解码 Decode：CU 解释指令\n3. 执行 Execute：ALU 执行运算\n\n缓存 Cache：CPU 内置高速临时存储，减少 RAM 访问等待。L1最快最小，L3最慢最大。",
        source: "ICT 0417 / CS 0478 Hardware" },
    "加密": {
        answer: "加密 Encryption：将明文 Plaintext 通过算法和密钥 Key 转换为密文 Ciphertext，防止未授权访问。\n\n对称加密 Symmetric encryption：\n• 加密和解密用同一密钥 Same key\n• 速度快，适合大量数据\n• 缺点：密钥分发安全问题\n• 例：AES, DES\n\n非对称加密 Asymmetric encryption：\n• 公钥 Public key 加密，私钥 Private key 解密\n• 密钥对 Key pair，解决分发问题\n• 速度较慢\n• 例：RSA, ECC\n\n数字签名 Digital signature：用私钥签名，公钥验证，确保身份和完整性。\n\n哈希 Hash：单向函数，将数据转为固定长度摘要，用于验证完整性（如密码存储）。",
        source: "ICT 0417 / CS 0478 Security" },
};
