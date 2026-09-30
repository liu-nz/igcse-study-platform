/* Original practice and revision guidance. Not Cambridge exam questions.
   Syllabus references are linked in FOCUS_SOURCES; reviewed 2026-09-30. */
const FOCUS_SUBJECTS = ['ICT', '计算机科学', '英语', '数学'];
const FOCUS_LABELS = {ICT:'ICT · 0417', '计算机科学':'CS · 0478', '英语':'ESL · 0510', '数学':'Math Extended · 0580'};
const FOCUS_SOURCES = [
 {subject:'ICT',years:'2026–2028',url:'https://www.cambridgeinternational.org/Images/697139-2026-2028-syllabus.pdf'},
 {subject:'计算机科学',years:'2026–2028',url:'https://www.cambridgeinternational.org/Images/697167-2026-2028-syllabus.pdf'},
 {subject:'英语',years:'2027–2029',url:'https://www.cambridgeinternational.org/Images/721337-2027-2029-syllabus.pdf'},
 {subject:'英语',years:'2024–2026',url:'https://www.cambridgeinternational.org/Images/637160-2024-2026-syllabus.pdf'},
 {subject:'数学',years:'2025–2027 · Extended',url:'https://www.cambridgeinternational.org/Images/662466-2025-2027-syllabus.pdf'}
];
// Each row: topic, question, correct answer, three distractors, explanation.
const FOCUS_QUESTION_ROWS = {
 ICT: [
 ['数据与安全','输入年龄时拒绝 250，这属于哪种校验？','Range check','Presence check','Proofreading','Encryption','范围校验限制数值上下界；它不能保证允许范围内的数据一定真实。'],
 ['数据与安全','两次输入邮箱并比较是否一致，主要用于什么？','Verification','Validation','Compression','Simulation','重复输入属于验证录入一致性的 verification；validation 检查格式或合理性。'],
 ['电子表格','将 C2 中的 =B2*$F$1 向下复制到 C3，公式是什么？','=B3*$F$1','=B2*$F$2','=B3*F2','=C3*$F$1','相对引用 B2 变为 B3；绝对引用 $F$1 保持不变。'],
 ['电子表格','统计 A2:A20 中大于等于 50 的单元格数量，应使用哪条公式？','=COUNTIF(A2:A20,">=50")','=SUM(A2:A20)','=COUNT(A2:A20,50)','=AVERAGE(A2:A20)','COUNTIF 对范围应用条件并计数；SUM 和 AVERAGE 分别求和与平均值。'],
 ['电子表格','=IF(B2>=50,"Pass","Retry") 在 B2=50 时返回什么？','Pass','Retry','50','TRUE','>= 包括等于，因此条件为真，返回第一个结果。'],
 ['电子表格','学生编号与分数是一一对应表，查找指定编号时为何选择精确匹配？','避免返回相近但不同编号的成绩','让编号自动排序','删除所有重复数据','把数字转换为图表','编号是标识符，近似匹配可能返回另一名学生的记录。'],
 ['数据库与文档','数据库主键的必要特征是什么？','每条记录的值唯一且不为空','必须是姓名','允许每条记录相同','必须是小数','主键唯一标识记录；姓名可能重复，不适合作为可靠主键。'],
 ['数据库与文档','筛选 Age>=16 AND Club="Chess" 会得到哪些人？','年龄至少16岁且加入棋社的人','至少满足其中一个条件的人','所有16岁以下的人','所有社团为空的人','AND 要求两个条件同时成立；OR 才是至少一个条件成立。'],
 ['数据库与文档','批量生成带不同收件人姓名的信件，应采用什么功能？','Mail merge','Page break','Slide transition','Screen capture','邮件合并使用主文档与数据源，逐条插入收件人字段。'],
 ['数据库与文档','长报告中要统一修改全部一级标题，最合适的方法是什么？','修改对应的标题样式','逐个改变字符颜色','把文档转成图片','为每页另建文件','样式能一致地管理一类标题的字体、间距等格式。'],
 ['网页制作','网页中描述图片内容、供屏幕阅读器使用的属性是？','alt','href','width','border','alt 为图片提供文本替代；应描述信息性图片的内容或作用。'],
 ['网页制作','同一网站的多个页面要共享样式，优先使用什么？','External stylesheet','每个元素写不同内联样式','把 CSS 放入图片','用数据库替代样式','外部样式表让多个页面共享设计，修改一处即可一致更新。'],
 ['网页制作','链接到同一文件夹内的 about.html，应使用哪个地址？','about.html','C:\\Users\\me\\about.html','https://localhost-only.invalid','mailto:about.html','相对路径可随站点一起移动；个人电脑路径对访问者无效。'],
 ['系统与网络','网络交换机主要如何转发局域网帧？','根据目标 MAC 地址','根据文件扩展名','根据屏幕大小','根据用户年龄','交换机学习 MAC 地址对应端口，将帧发往相应设备。'],
 ['系统与网络','与硬盘相比，SSD 的哪项特征有助于抗震？','没有机械运动部件','必须连接光驱','只存临时数据','不能随机访问','SSD 使用闪存，无旋转盘片和机械磁头。'],
 ['系统与网络','在温室自动控制中，温度传感器的作用是什么？','测量温度并提供输入','给植物浇水的执行动作','显示数据库主键','加密网络流量','传感器采集输入，处理器作判断，执行器进行实际动作。'],
 ['数据与安全','收到要求立即输入银行密码的陌生链接，应如何处理？','通过官方应用或已知地址独立核实','点击链接后再判断','把密码发给发件人','关闭杀毒软件','钓鱼利用假冒身份诱导泄露信息，应从可信渠道核实。'],
 ['系统与网络','并行实施新系统的主要代价是什么？','同时运行两套系统需要更多资源','完全没有旧系统可回退','不允许核对输出','必须立即删除旧数据','并行实施可以比较结果并保留旧系统，但增加人力和运行成本。'],
 ['数据与安全','为什么需要离线或隔离的备份？','降低勒索软件同时破坏原文件与备份的风险','确保永远无需恢复测试','消除全部人为错误','使所有密码公开','隔离副本可降低同一攻击波及备份的风险，仍需测试恢复。'],
 ['数据库与文档','要比较五个不同社团的人数，通常选择哪种图表？','Bar chart','折线图表示连续时间变化','散点图只画相关性','不标坐标的曲线','条形图适合比较离散类别；坐标和单位应清晰。']
 ],
 '计算机科学': [
 ['数据表示','二进制 101101 表示哪个十进制数？','45','41','43','53','32+8+4+1=45，未置位的位不计入。'],
 ['数据表示','十六进制 3A 的十进制值是多少？','58','310','48','60','3×16+10=58；A 代表十进制10。'],
 ['数据表示','8 位无符号整数的最大值是多少？','255','256','127','128','最大值为 2^8−1=255；共有256个可表示的值，包括0。'],
 ['数据表示','一幅 100×80 像素、每像素24位的未压缩图像，不含元数据，大小是多少字节？','24000','192000','8000','3000','位数=100×80×24，除以8得到24000字节。'],
 ['数据表示','无损压缩的关键特征是什么？','解压后能够完全恢复原数据','必定比有损压缩更小','必须删除高频信息','只适用于视频','无损压缩保留全部信息，适用于文本和程序等。'],
 ['系统与安全','取指阶段 PC 的作用是什么？','保存下一条待取指令的地址','保存当前数据总和','执行所有逻辑运算','控制显示器亮度','Program Counter 保存下一条将取出的指令地址。'],
 ['系统与安全','RAM 与 ROM 的一个典型区别是什么？','RAM 通常易失，ROM 非易失','ROM 断电必丢失内容','RAM 只能读取','ROM 必须比 RAM 容量大','易失性表示断电后内容丢失；容量并非两者定义上的区别。'],
 ['系统与安全','奇偶校验的局限是什么？','某些偶数个位翻转无法被检测','能自动修复所有错误','能发现所有偶数位错误','只检查十进制数字','偶数次翻转可能保持原奇偶性，因此不是完整纠错机制。'],
 ['系统与安全','HTTPS 相比 HTTP 增加的主要保护是什么？','用 TLS 保护传输中的数据','保证网站内容永远真实','禁止所有恶意软件','使服务器不需要地址','TLS 提供加密等传输保护；加密连接不意味着网站绝对可信。'],
 ['系统与安全','公钥加密中，给接收者发送保密信息应使用哪把密钥加密？','接收者的公钥','接收者公开的密码','发送者的用户名','任意人的私钥','只有匹配的接收者私钥可以解密该公钥加密的消息。'],
 ['算法与编程','初始 total=0，依次将 2、4、6 加入 total，最后结果是什么？','12','6','8','24','累加器保留之前的总和：0+2+4+6=12。'],
 ['算法与编程','FOR i ← 1 TO 4 循环每次输出 i*2，会输出什么？','2, 4, 6, 8','0, 2, 4, 6','1, 2, 3, 4','2, 4, 6','上界4包含在内，共执行4次。'],
 ['算法与编程','二分查找之前，数据必须满足什么条件？','按搜索键有序','完全随机排列','全部值相同','只有两个元素','二分查找根据大小排除一半范围，依赖排序。'],
 ['算法与编程','输入整数范围1到10，哪组是边界及相邻非法测试数据？','0, 1, 10, 11','4, 5, 6, 7','2, 3, 8, 9','100, 200, 300, 400','1和10是合法边界，0和11紧邻边界之外。'],
 ['算法与编程','若输入 -1 表示结束，程序求平均数时应该怎样处理 -1？','不把结束标记计入总和或数量','将其当作正常数值','只计入数量','先除以 -1','哨兵值用于控制结束，不属于有效数据；还应检查数量是否为0。'],
 ['算法与编程','在长度为 n 的数组中线性查找不存在的值，最坏需要比较多少个元素？','n','1','0','n²','未找到时必须检查全部 n 个元素。'],
 ['数据库与逻辑','A=1，B=0，(A AND B) OR NOT B 的结果是多少？','1','0','2','无法确定','A AND B=0，NOT B=1，0 OR 1=1。'],
 ['数据库与逻辑','一个逻辑表达式有3个独立二进制输入，真值表有多少种输入组合？','8','3','6','9','每个输入有2种状态，共 2³=8 种组合。'],
 ['数据库与逻辑','SQL 中只查询 Score>=80 的记录，应使用哪个子句？','WHERE Score >= 80','ORDER BY Score >= 80','SELECT ALL 80','GROUP >= 80','WHERE 用于过滤记录；ORDER BY 用于排序。'],
 ['数据库与逻辑','关系数据库的外键主要用于什么？','引用另一张表的键以建立关系','加密整张表','保证每个字段都唯一','删除所有重复列','外键建立表之间的关联，并可用于维护参照完整性。']
 ],
 '英语': [
 ['阅读理解','Notice: “The library closes at 4 today, an hour earlier than usual.” What is the usual closing time?','5 pm','3 pm','4 pm','6 pm','Today closes at 4, which is one hour earlier; usual time is 5。注意 earlier 的比较方向。'],
 ['阅读理解','“Although the journey was long, Maya felt it was worthwhile.” How did Maya view the journey?','It was worth the time spent.','It was too short.','It was a complete waste.','It was cancelled.','Although 表让步；worthwhile 表示值得付出时间或努力。'],
 ['阅读理解','“Booking is essential; payment can be made on arrival.” What must visitors do before arrival?','Reserve a place','Pay in full','Collect a certificate','Buy equipment','Essential 修饰 booking，付款可在到达时完成。'],
 ['阅读理解','“Unlike the previous model, this device works without an internet connection.” What is new?','It can operate offline.','It needs faster internet.','It has no power supply.','It cannot work indoors.','Without an internet connection 对应 offline；不要添加原文没有的信息。'],
 ['阅读理解','“Lina initially disliked cycling, but now she rides daily.” What changed?','Her attitude to cycling','Her home address','The price of bicycles','Her school timetable','Initially 与 now 对比，说明态度和习惯改变。'],
 ['阅读理解','Which sentence is an opinion?','The museum is the most exciting place in town.','The museum opened in 1998.','It has three floors.','It closes on Mondays.','Most exciting 是主观评价，其余是可核实的事实陈述。'],
 ['词汇与搭配','Choose the best phrase: “We need to ___ a decision by Friday.”','make','do','take up','give out','常用搭配为 make a decision，表示作决定。'],
 ['词汇与搭配','“The service is reliable.” What does reliable mean?','Able to be trusted','Very expensive','Recently invented','Difficult to find','Reliable 表可靠、可依赖，并不必然表示昂贵或新颖。'],
 ['词汇与搭配','Choose: “Public transport can help ___ traffic congestion.”','reduce','rise','grow','expand','Reduce 是及物动词，表示减少拥堵。'],
 ['词汇与搭配','Which word best completes: “The course gave me an ___ to improve my English.”','opportunity','equipment','advice','information','An opportunity 表一个机会；其余列出的词通常不可数。'],
 ['语法与衔接','Choose: “If I had more time, I ___ join the club.”','would','will','am','have','第二条件句：If + 过去式，主句 would + 动词原形。'],
 ['语法与衔接','Choose: “She has lived here ___ 2022.”','since','for','during','by','Since 接起点；for 接时间长度。'],
 ['语法与衔接','Choose: “The tickets ___ online yesterday.”','were sold','are selling','have sell','was sold','Tickets 是复数，yesterday 指过去；被动形式为 were sold。'],
 ['语法与衔接','Choose: “Despite ___ tired, he finished the report.”','being','he was','be','was','Despite 后接名词或动名词；完整从句通常用 although。'],
 ['语法与衔接','“The activity was enjoyable. ___, it was too expensive.” Choose a contrast linker.','However','Therefore','For example','Similarly','However 表转折；therefore 表结果。'],
 ['写作表达','Which opening best suits a formal email requesting course information?','I am writing to enquire about your course.','Hey! Tell me stuff!','You must reply now!','What a boring course!','询问信息应礼貌、明确并保持合适语域。'],
 ['写作表达','A school report should primarily offer which combination?','Clear findings and practical recommendations','Only jokes and slang','Unrelated personal stories','A list without any explanation','Report 需要围绕任务描述发现并提出可行建议。'],
 ['写作表达','Which review sentence supports its evaluation with evidence?','The guide was helpful because she explained each exhibit clearly.','Everything was nice.','It was good, good, good.','You should go because I said so.','Because 后的具体证据使评价有说服力。'],
 ['写作表达','Which sentence gives a balanced argument?','Online lessons are convenient, but they require self-discipline.','Online lessons are always perfect.','Nobody can learn online.','There are no disadvantages.','平衡论述可以同时承认优势与限制，避免绝对化。'],
 ['写作表达','You are asked to suggest one improvement to a school event. Which response directly fulfils the task?','Add more signs so visitors can find the rooms easily.','The event happened last week.','My friend likes sport.','I have a blue bag.','提出明确改进并解释作用，比无关细节更切合题目。']
 ],
 '数学': [
 ['数与代数','Simplify √72. 化简根式。','6√2','8√2','36√2','6√12','72=36×2，所以 √72=6√2。'],
 ['数与代数','Evaluate 27^(2/3).','9','18','6','81','先取立方根得3，再平方得9。'],
 ['数与代数','Solve x²−5x+6=0.','x=2 or 3','x=−2 or −3','x=1 or 6','x=−1 or −6','(x−2)(x−3)=0，两因式分别为0。'],
 ['数与代数','Solve 3−2x>11.','x<−4','x>−4','x<4','x>4','−2x>8，除以负数需反转不等号。'],
 ['数与代数','A value rises by 20% then falls by 20%. What is the overall change?','4% decrease','No change','4% increase','40% decrease','倍率 1.2×0.8=0.96，因此减少4%。'],
 ['函数与图像','f(x)=3x−7. Find f⁻¹(x).','(x+7)/3','3x+7','(x−7)/3','1/(3x−7)','令 y=3x−7，解出 x=(y+7)/3，再互换变量。'],
 ['函数与图像','f(x)=2x+1, g(x)=x². Find f(g(3)).','19','49','13','37','先求 g(3)=9，再求 f(9)=19。'],
 ['函数与图像','Find the gradient of the line through (2,3) and (6,11).','2','1/2','4','8','斜率=(11−3)/(6−2)=8/4=2。'],
 ['函数与图像','Differentiate y=3x³−2x²+5.','9x²−4x','3x²−2x','9x³−4x²','9x²−4x+5','幂函数求导：nx^(n−1)；常数项导数为0。'],
 ['函数与图像','Find the nth term of 5, 9, 13, 17, ...','4n+1','5n','4n−1','n+4','公差4，首项5，所以5+4(n−1)=4n+1。'],
 ['几何与三角','Two similar solids have length ratio 2:3. What is their volume ratio?','8:27','4:9','2:3','6:9','相似立体体积比是长度比的三次方。'],
 ['几何与三角','Two sides are 5 and 7 with included angle 60°. Find the opposite side.','√39','√109','√24','12','余弦定理：c²=25+49−2×5×7×cos60°=39。'],
 ['几何与三角','Find the area of a triangle with sides 8 and 10 and included angle 30°.','20','40','80','10','面积=1/2×8×10×sin30°=20。'],
 ['几何与三角','An angle at the centre of a circle is 124°. Find the angle at the circumference on the same arc.','62°','124°','248°','56°','同弧对应圆心角是圆周角的2倍。'],
 ['几何与三角','Vectors a=(3,−1), b=(−2,4). Find 2a+b.','(4,2)','(1,3)','(8,−6)','(4,6)','2a=(6,−2)，相加 b 得(4,2)。'],
 ['概率与统计','A bag has 3 red and 2 blue counters. Two are drawn without replacement. P(both red)=?','3/10','9/25','6/25','1/5','概率=3/5×2/4=3/10，第二次剩下4个。'],
 ['概率与统计','Independent events have P(A)=0.4 and P(B)=0.3. Find P(A and B).','0.12','0.7','0.1','0.58','独立事件交集概率相乘：0.4×0.3=0.12。'],
 ['概率与统计','A histogram class has frequency 18 and width 6. Find its frequency density.','3','108','12','24','频率密度=频数÷组距=18/6=3。'],
 ['概率与统计','For values 2, 4, 6 with frequencies 1, 2, 3, find the mean.','14/3','4','7','28','加权总和=2+8+18=28，总频数6，平均数=28/6。'],
 ['数与代数','A length is 8.4 cm rounded to the nearest 0.1 cm. Which interval contains its actual value x?','8.35 ≤ x < 8.45','8.3 ≤ x ≤ 8.5','8.4 ≤ x < 8.5','8.35 < x ≤ 8.45','半个精度单位为0.05；通常下界包含、上界不包含。']
 ]
};
const FOCUS_QUESTIONS = Object.entries(FOCUS_QUESTION_ROWS).flatMap(([subject, rows]) => rows.map((r,i) => {
 const options = r.slice(2,6); const shift=i%4;
 return {id:`focus-${subject}-${i+1}`,subject,subjectCode:FOCUS_LABELS[subject].split(' · ')[1],topic:r[0],difficulty:i%5===4?'hard':'medium',type:'single',question:r[1],options:[...options.slice(shift),...options.slice(0,shift)],answer:(4-shift)%4,explanation:r[6],keywords:[r[0]],isHot:true,source:'原创专项练习 · 非真题',focus:true};
}));
// Revision priorities are study advice, not predictions or fixed topic weightings.
const FOCUS_UNIT_ROWS = {
 ICT:[
 ['系统与网络','计算机、设备与系统实施',['输入/输出设备','存储介质','LAN / WAN','系统生命周期'],['用场景解释选择设备的原因：成本、速度、可靠性与便携性。','对比直接、并行、分阶段和试点实施，说明风险和资源成本。','练习区分传感器输入、处理器决策与执行器输出。'],'画出温室控制流程，并解释如果传感器失效会发生什么。'],
 ['数据与安全','验证、网络威胁与安全',['Validation / verification','备份与恢复','Phishing','访问控制'],['为数据设计范围、类型、长度或存在性检查，并说明限制。','区分加密、认证、访问权限和备份各自解决的问题。','安全题用“威胁 → 对应措施 → 为什么有效”组织答案。'],'为学校报名表设计3种检查，并给出每种检查仍可能接受的错误数据。'],
 ['数据库与文档','文档、数据库与演示实操',['样式与版式','邮件合并','查询与报表','演示文稿'],['先明确字段类型和主键，再建立查询条件。','使用统一样式；核对页眉页脚、分页、排序与最终输出。','证据截图要清晰展示设置和结果；遵循题目命名与保存要求。'],'建立学生表，筛出满足两个条件的记录并输出含总数的报表。'],
 ['电子表格','公式、函数与模型',['相对/绝对引用','IF / COUNTIF / SUMIF','查找函数','图表'],['先判断复制方向，再固定行或列；用两个不同输入检查公式。','区分计数、求和与平均；查找标识符时核对是否精确匹配。','选择合适图表，检查坐标、单位、图例和显示精度。'],'制作成绩表：判定通过、统计人数、计算平均并绘制分组图。'],
 ['网页制作','网页结构与样式',['HTML','CSS','相对链接','可访问性'],['结构与表现分开，多个页面复用外部样式表。','链接和图片使用可随网站发布的路径。','在浏览器测试链接、替代文本、尺寸和不同屏幕宽度。'],'制作两页互相链接的网站，使用共享 CSS 和有意义的图片替代文本。']
 ],
 '计算机科学':[
 ['数据表示','二进制、编码与存储',['进制转换','溢出','图像与声音大小','压缩'],['把二进制每个位值写出来；十六进制每位对应4个二进制位。','文件大小先算位，再换算字节；按题目指定单位换算。','解释有损和无损压缩对内容、大小、适用场景的影响。'],'计算一张图像的原始大小，再解释减半色深对大小和质量的影响。'],
 ['系统与安全','硬件、通信与互联网',['CPU 与寄存器','存储','错误检测','网络安全'],['按顺序追踪取指—译码—执行，并区分地址和指令内容。','解释奇偶校验、校验和或回传检查可以发现什么及其局限。','安全措施必须对应威胁；HTTPS 不保证网页内容可信。'],'用一条指令说明 PC、MAR、MDR 和 CIR 在取指中的作用。'],
 ['算法与编程','算法、追踪与编程情境题',['顺序/分支/循环','数组','测试数据','查找与排序'],['追踪表逐次更新，不跳过循环结束条件。','区分累加器、计数器和哨兵值；平均值计算前检查除数。','先写输入、处理、输出，再分解模块，检查边界和异常输入。'],'编写读取成绩直到 -1 的程序，输出平均数和最高分，处理没有成绩的情况。'],
 ['数据库与逻辑','数据库、SQL 与逻辑',['主键/外键','SELECT / WHERE','逻辑门','真值表'],['SQL 先确定字段，再写筛选条件和排序方向。','n个二进制输入有2^n种组合；不要漏行。','复合逻辑先按括号逐层求值，并用全部输入验证。'],'写查询筛选高分学生，再为 (A AND B) OR NOT C 建立真值表。']
 ],
 '英语':[
 ['阅读理解','定位、推断与笔记',['同义改写','事实与观点','细节定位','信息筛选'],['先辨认问题需要人物、原因、时间还是观点，再回原文定位。','比较选项与原文含义；相同单词不代表相同意思。','笔记使用简明信息；不把个人常识替代文本证据。'],'读一篇短文，写出5组同义改写，再为每个答案划出证据。'],
 ['词汇与搭配','主题词汇与搭配',['环境','教育','科技','旅行与健康'],['按语境记住搭配与词性，而不是只背中文意思。','用主动回忆检查拼写，隔天重新默写错词。','区分近义词的搭配范围，并为每个词写一句自己的例句。'],'完成20个词的默写，把错词各写成一句与生活有关的句子。'],
 ['语法与衔接','准确性与段落连接',['时态','条件句','被动语态','连接词'],['根据时间线选时态；检查主谓一致和冠词。','连接词应表达真实逻辑，不能仅为“高级”而添加。','修改长句时先找主语和谓语，再检查从句或非谓语结构。'],'改写一段80词文字，检查时态一致，并加入恰当的转折和结果关系。'],
 ['写作表达','邮件、文章、报告与评论',['受众与目的','语域','组织结构','例证与建议'],['先勾出任务中的每个要求，再列简短提纲。','评价要有具体理由；建议要解释如何带来改善。','按当前试卷要求控制篇幅，并留时间检查拼写、标点和段落。'],'写一段活动评论，包含一个具体优点、一个不足和一条可行建议。'],
 ['听力与口语','听辨细节与展开表达',['预测关键词','干扰信息','语音辨认','观点与例子'],['听前判断需要的信息类型，留意说话人改口和否定。','口语回答使用观点、原因、例子，再适当扩展。','用官方听力与文本核对错误；合成语音只作为词汇辅助。'],'用60秒介绍一次学习经历，录音后检查是否解释了原因和感受。']
 ],
 '数学':[
 ['数与代数','数、根式、方程与不等式',['上下界','指数/根式','二次方程','百分比'],['保留精确值到最后；反向百分比用原价倍率还原。','解不等式乘除负数时反转符号。','根式先提取平方因子；方程答案代回检查。'],'不使用计算器解二次方程，并给出一个测量值的上下界。'],
 ['函数与图像','函数、图像与变化率',['复合/反函数','梯度','数列','微分'],['复合函数从里向外计算；反函数通过交换变量再解方程。','区分点的坐标、割线斜率与某点切线梯度。','数列先检查差分；求导后代入横坐标得到梯度。'],'给定 f(x)=2x−3 与 g(x)=x²，求两个顺序的复合函数并比较。'],
 ['几何与三角','几何、向量、三角与测量',['圆定理','相似','正弦/余弦定理','面积与体积'],['几何论证写出所用定理，而不仅写数值。','相似图形长度、面积、体积倍率分别为 k、k²、k³。','标记已知边角再选公式；计算器角度模式应与题目一致。'],'画非直角三角形，说明何时用正弦定理、何时用余弦定理。'],
 ['概率与统计','概率、统计与数据解释',['树状图','条件与独立','直方图','累计频率'],['不放回抽样时第二次分母与数量会改变。','直方图面积代表频数，密度=频数÷组距。','从累计频率估算中位数和四分位数，并结合情境解释。'],'绘制两次不放回抽取的树状图，并算出同色与异色概率。']
 ]
};
const FOCUS_UNITS = Object.entries(FOCUS_UNIT_ROWS).flatMap(([subject,rows])=>rows.map((r,i)=>({id:`unit-focus-${subject}-${i}`,subject,subjectCode:FOCUS_LABELS[subject].split(' · ')[1],unit:r[1],topic:r[0],topics:r[2],keyPoints:r[3],task:r[4],focus:true,importance:'专项复习',weight:'以当年考纲为准'})));
KEY_UNITS.unshift(...FOCUS_UNITS);
// Hide unverified weight estimates in older cards for the four focus subjects.
KEY_UNITS.filter(u=>FOCUS_SUBJECTS.includes(u.subject)&&!u.focus).forEach(u=>{u.weight='复习概览 · 非固定分值占比';u.importance='基础回顾';});
const VOCAB_ROWS = {
 ICT:[
 ['validation','数据校验：检查输入是否满足规则'],['verification','录入验证：检查是否与原始数据一致'],['spreadsheet','电子表格'],['absolute reference','绝对引用'],['relative reference','相对引用'],['worksheet','工作表'],['primary key','主键'],['query','数据库查询'],['record','数据库中的一条记录'],['field','数据库字段'],['mail merge','邮件合并'],['stylesheet','样式表'],['accessibility','可访问性；无障碍使用'],['backup','备份'],['encryption','加密'],['phishing','钓鱼诈骗'],['authentication','身份验证'],['firewall','防火墙'],['sensor','传感器'],['actuator','执行器'],['bandwidth','带宽'],['router','路由器'],['simulation','模拟'],['implementation','实施'],['evaluation','评价；评估']
 ],
 '计算机科学':[
 ['algorithm','算法'],['pseudocode','伪代码'],['variable','变量'],['constant','常量'],['iteration','迭代；重复执行'],['selection','选择结构'],['sequence','顺序结构'],['array','数组'],['parameter','参数'],['procedure','过程；无返回值子程序'],['function','函数'],['accumulator','累加器'],['counter','计数器'],['sentinel','哨兵值；结束标记'],['binary','二进制'],['hexadecimal','十六进制'],['overflow','溢出'],['register','寄存器'],['cache','高速缓存'],['interrupt','中断'],['compiler','编译器'],['interpreter','解释器'],['parity','奇偶性；奇偶校验中的性质'],['compression','压缩'],['foreign key','外键']
 ],
 '英语':[
 ['environment','环境'],['sustainable','可持续的'],['pollution','污染'],['conservation','保护；资源保存'],['renewable','可再生的'],['opportunity','机会'],['achievement','成就'],['experience','经历；经验'],['recommendation','建议；推荐'],['reliable','可靠的'],['convenient','方便的'],['accommodation','住宿'],['destination','目的地'],['itinerary','旅行行程'],['volunteer','志愿者；自愿做'],['community','社区'],['participate','参与'],['beneficial','有益的'],['disadvantage','缺点；不利条件'],['however','然而'],['therefore','因此'],['although','虽然'],['evidence','证据'],['independent','独立的'],['responsibility','责任']
 ],
 '数学':[
 ['coefficient','系数'],['factorise','因式分解',['factorize']],['quadratic','二次的'],['inequality','不等式'],['denominator','分母'],['numerator','分子'],['reciprocal','倒数'],['gradient','斜率'],['intercept','截距'],['simultaneous equations','联立方程'],['inverse function','反函数'],['composite function','复合函数'],['derivative','导数'],['tangent','切线'],['perpendicular','垂直的'],['circumference','圆周长'],['hypotenuse','直角三角形的斜边'],['similarity','相似性'],['vector','向量'],['magnitude','大小；向量的模'],['probability','概率'],['frequency density','频率密度'],['cumulative frequency','累计频率'],['interquartile range','四分位距'],['upper bound','上界']
 ]
};
const VOCAB_BANK = Object.entries(VOCAB_ROWS).flatMap(([subject,rows])=>rows.map((r,i)=>({id:`vocab-${subject}-${i+1}`,subject,word:r[0],meaning:r[1],alternatives:r[2]||[]})));
