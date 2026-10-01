/* ============================================
   IGCSE 考点关键词词库 · Bilingual Keyword Glossary
   --------------------------------------------
   词条格式：[English, 中文, 释义(中文详解), 科目, 额外别名(可选)]
   页面上出现的关键词会自动加上下划虚线标记，
   鼠标悬浮（或触屏点击）即显示具体含义。
   ============================================ */

const GLOSSARY_ENTRIES = [
  /* ---------- 通用考试指令词 Command Words ---------- */
  ["define","定义","给出术语的准确含义；是否需要例子或进一步说明应以具体题目为准。","考试指令词",["definition"]],
  ["state","写出","简短直接地给出事实、数值或名称，不需要解释或推理过程。","考试指令词"],
  ["list","列举","依次写出若干要点，通常不需要描述或解释。","考试指令词"],
  ["describe","描述","详细说明某事物的特征、外观或过程步骤，写到能让没见过的人理解。","考试指令词",["description"]],
  ["explain","解释","说明「为什么」或「如何发生」，需要写出原因或机制，不能只写现象。","考试指令词",["explanation"]],
  ["calculate","计算","写出公式、代入数据并给出答案和单位；过程分同样给分。","考试指令词",["calculation"]],
  ["compare","比较","按题目要求比较相同点和／或不同点；同一维度联系两者作答。","考试指令词"],
  ["contrast","对比","重点说明两者之间的差异；compare 则可要求相同点和／或不同点。","考试指令词"],
  ["evaluate","评价","权衡利弊后给出有依据的判断，必须给出结论并说明依据。","考试指令词",["evaluation"]],
  ["discuss","讨论","呈现不同观点或正反两面，再形成平衡的结论。","考试指令词"],
  ["justify","论证","用数据或理由支撑你的结论，说明为什么这个结论成立。","考试指令词"],
  ["suggest","推测","根据情境给出合理的可能原因或建议，答案不唯一但需符合已知信息。","考试指令词"],
  ["predict","预测","根据规律、趋势或数据推断接下来会发生什么。","考试指令词",["prediction"]],
  ["outline","概述","给出要点式的简要说明，比 describe 简短，只抓主干。","考试指令词"],
  ["identify","识别","从图表、数据或文本中准确找出并命名对应对象。","考试指令词"],
  ["analyse","分析","把整体拆解成部分并研究其关系或影响，常需要引用数据。","考试指令词"],
  ["comment","评述","对给出的结果或数据发表看法，说明其意义或异常之处。","考试指令词"],
  ["deduce","推断","从已知信息或数据中得出结论，不能直接看出，需要推理。","考试指令词"],
  ["determine","求出","通过计算或推理得到确定的数值或结论。","考试指令词"],
  ["sketch","草图","画出大致形状和主要特征，不需要精确尺寸，但关键标注要有。","考试指令词"],
  ["significant figures","有效数字","从第一个非零数字起算的数字个数；答案通常要求保留 3 位有效数字。","考试指令词",["significant figure"]],
  ["standard form","标准形式","把数写成 a×10ⁿ（1≤a<10，n 为整数），用于表示极大或极小的数。","考试指令词"],
  ["upper bound","上界","四舍五入后的真实值可能达到的最大值（不含该边界本身）。","考试指令词"],
  ["lower bound","下界","四舍五入后的真实值可能取到的最小值（含该边界本身）。","考试指令词"],

  /* ---------- 数学 Maths 0580 ---------- */
  ["quadratic equation","二次方程","最高次项为二次的方程，一般式 ax²+bx+c=0；可用因式分解、配方法或求根公式求解。","数学",["quadratic"]],
  ["quadratic formula","求根公式","x = (−b ± √(b²−4ac)) / 2a，适用于任意二次方程，是必背公式。","数学"],
  ["discriminant","判别式","Δ = b² − 4ac，用于判断实根个数：Δ>0 两个不同实根，Δ=0 重根，Δ<0 无实根。","数学"],
  ["factorise","因式分解","把多项式写成若干因式相乘的形式，如 x²−9 = (x−3)(x+3)。","数学",["factorize","factorisation","factorization"]],
  ["completing the square","配方法","把 ax²+bx+c 写成 a(x+p)²+q 的形式，可求顶点坐标。","数学"],
  ["simultaneous equations","联立方程","多个未知数组成的方程组，常用代入法 substitution 或消元法 elimination 求解。","数学",["simultaneous equation"]],
  ["inequality","不等式","用 >、<、≥、≤ 连接的式子；两边同乘或同除以负数时不等号必须反向。","数学",["inequalities"]],
  ["denominator","分母","分数中位于分数线下方的数，表示整体被分成的份数。","数学"],
  ["numerator","分子","分数中位于分数线上方的数，表示取了多少份。","数学"],
  ["reciprocal","倒数","1 除以该数所得的结果，如 2/3 的倒数是 3/2；乘积为 1 的两个数互为倒数。","数学"],
  ["gradient","斜率","直线倾斜程度，m = (y₂−y₁)/(x₂−x₁)；平行线斜率相等，垂直线斜率乘积为 −1。","数学"],
  ["intercept","截距","直线与坐标轴交点的坐标值，y 轴截距即 x=0 时的 y 值。","数学"],
  ["composite function","复合函数","把一个函数的输出作为另一个函数的输入，记作 fg(x)，从内向外计算。","数学"],
  ["inverse function","反函数","把原函数的输入输出互换得到的函数，记作 f⁻¹(x)，图像关于 y=x 对称。","数学"],
  ["derivative","导数","函数在某点的变化率，即曲线在该点切线的梯度；由微分 differentiation 得到。","数学",["differentiation"]],
  ["tangent","切线","与曲线只在一点接触且在该点梯度相同的直线。","数学"],
  ["perpendicular","垂直","两条直线相交成 90°；斜率乘积为 −1（两条非竖直线）。","数学"],
  ["circumference","圆周","圆的边界长度，C = 2πr = πd。","数学"],
  ["hypotenuse","斜边","直角三角形中与直角相对的最长边，勾股定理中记作 c。","数学"],
  ["similarity","相似","形状相同、大小不同的图形关系；长度比为 k，面积比 k²，体积比 k³。","数学",["similar"]],
  ["congruence","全等","形状与大小完全相同的图形关系，判定条件 SSS、SAS、ASA、RHS。","数学",["congruent"]],
  ["vector","向量","同时具有大小 magnitude 与方向的量，如位移、速度、力。","数学"],
  ["magnitude","模","向量或数量的大小（长度），不计方向。","数学"],
  ["Pythagoras","勾股定理","直角三角形满足 a² + b² = c²，c 为斜边 hypotenuse。","数学",["Pythagoras' theorem","pythagoras theorem"]],
  ["trigonometry","三角函数","研究直角三角形边角关系的分支；核心为 SOHCAHTOA、正弦定理与余弦定理。","数学"],
  ["sine rule","正弦定理","a/sinA = b/sinB = c/sinC，用于已知两角一边或两边及一对角。","数学"],
  ["cosine rule","余弦定理","c² = a² + b² − 2ab·cosC，用于已知两边夹角或三边。","数学"],
  ["probability","概率","某事件发生的可能性，P(E) = 有利结果数 ÷ 全部等可能结果数，取值 0~1。","数学"],
  ["mutually exclusive","互斥事件","两个事件不可能同时发生，P(A 或 B) = P(A) + P(B)。","数学"],
  ["independent events","独立事件","一个事件的发生不影响另一个事件的概率，P(A 且 B) = P(A)×P(B)。","数学",["independent event"]],
  ["conditional probability","条件概率","在事件 B 已发生的条件下事件 A 发生的概率，记作 P(A|B)。","数学"],
  ["tree diagram","树状图","按分支列出各步结果及其概率的图形，常用于不放回抽样。","数学"],
  ["venn diagram","维恩图","用圆表示集合及其交并关系的图形，用于计算集合概率。","数学"],
  ["histogram","直方图","用矩形面积表示频数的统计图，纵轴为频率密度 frequency density。","数学"],
  ["frequency density","频率密度","频率密度 = 频数 ÷ 组距；直方图中矩形的高。","数学"],
  ["cumulative frequency","累积频率","到某一组为止的频数累加值，用于估计中位数和四分位数。","数学"],
  ["interquartile range","四分位距","上四分位数减下四分位数，IQR = Q₃ − Q₁，衡量数据中间 50% 的离散程度。","数学"],
  ["compound interest","复利","利息计入本金继续生息，A = P(1 + r)ⁿ，r 为每期利率。","数学"],
  ["depreciation","折旧","资产价值按固定比例逐年减少，A = P(1 − r)ⁿ。","数学"],
  ["reverse percentage","反向百分比","已知变化后的结果求原始值，用原值 = 现值 ÷ 相应倍率。","数学"],
  ["percentage change","百分比变化","百分比变化 = (新值 − 原值) ÷ 原值 × 100%。","数学"],
  ["mensuration","测量几何","关于长度、面积与体积计算的分支，需熟记各种立体图形公式。","数学"],
  ["sequence","数列","按一定规律排列的一列数，如等差数列 arithmetic、等比数列 geometric。","数学",["sequences"]],
  ["arithmetic sequence","等差数列","相邻两项差为常数 d 的数列，第 n 项 aₙ = a₁ + (n−1)d。","数学"],
  ["geometric sequence","等比数列","相邻两项比为常数 r 的数列，第 n 项 aₙ = a₁·rⁿ⁻¹。","数学"],
  ["standard deviation","标准差","衡量数据相对于平均值的离散程度的统计量。","数学"],
  ["correlation","相关性","两个变量共同变化的趋势，分正相关、负相关与无相关。","数学"],
  ["transformation","变换","改变图形位置或大小的操作：平移 translation、旋转 rotation、反射 reflection、放大 enlargement。","数学"],
  ["enlargement","放大","按一定比例因子 scale factor 从中心点放大或缩小图形。","数学"],
  ["bearing","方位角","从正北方向顺时针量到目标方向的角度，总是写成三位数字。","数学"],
  ["surd","根式","保留根号形式的无理数表达，如 √2、2√3，结果要求精确值时使用。","数学"],
  ["rationalise","有理化","把分母中的根号化去，如 1/√2 = √2/2。","数学",["rationalize"]],

  /* ---------- 物理 Physics 0625 ---------- */
  ["velocity","速度","单位时间内的位移，是矢量 vector，单位 m/s；与只论快慢的速率 speed 不同。","物理"],
  ["acceleration","加速度","速度的变化率，a = (v − u)/t，单位 m/s²。","物理"],
  ["inertia","惯性","物体保持原有运动状态不变的性质，质量越大惯性越大。","物理"],
  ["momentum","动量","p = mv，单位 kg·m/s；系统不受外力时总动量守恒。","物理"],
  ["conservation of momentum","动量守恒","碰撞前后系统总动量保持不变，是解碰撞题的核心依据。","物理"],
  ["impulse","冲量","力与时间的乘积，F·t = Δp，等于动量的变化量。","物理"],
  ["Newton's laws","牛顿定律","三条定律分别描述惯性、F = ma 与作用力反作用力，是力学的基础。","物理",["Newton's law"]],
  ["resultant force","合力","作用在物体上所有力的矢量和；合力为零则物体静止或匀速直线运动。","物理"],
  ["terminal velocity","终极速度","下落物体所受空气阻力与重力相等时的恒定速度，加速度为零。","物理"],
  ["work done","做功","W = F·d，力与沿力方向位移的乘积，单位 J（焦耳）。","物理"],
  ["power","功率","单位时间做的功或消耗的能量，P = W/t = E/t，单位 W（瓦特）。","物理"],
  ["kinetic energy","动能","物体因运动而具有的能量，KE = ½mv²。","物理"],
  ["potential energy","势能","物体因位置或状态而储存的能量，重力势能 GPE = mgh。","物理"],
  ["conservation of energy","能量守恒","能量只能转化或转移，总量保持不变，不会凭空产生或消失。","物理"],
  ["efficiency","效率","效率 = 有用输出能量 ÷ 总输入能量 × 100%，总小于 100%。","物理"],
  ["pressure","压强","单位面积上的压力，P = F/A，单位 Pa；液体压强 P = ρgh。","物理"],
  ["density","密度","单位体积的质量，ρ = m/V，单位 kg/m³ 或 g/cm³。","物理"],
  ["ohm's law","欧姆定律","V = IR，导体两端电压与电流成正比（温度不变时）。","物理",["ohm's law"]],
  ["current","电流","电荷定向移动的速率，I = Q/t，单位 A（安培）；串联处处相等。","物理"],
  ["voltage","电压","单位电荷获得的能量，即电势差 potential difference，单位 V；并联各支路相等。","物理",["potential difference"]],
  ["resistance","电阻","导体阻碍电流的程度，R = V/I，单位 Ω（欧姆）。","物理"],
  ["series circuit","串联电路","元件逐个连接的电路，电流处处相等，总电阻为各电阻之和。","物理"],
  ["parallel circuit","并联电路","元件并列连接的电路，各支路电压相等，总电流为各支路之和。","物理"],
  ["electromotive force","电动势","电源把其他形式能量转化为电能的能力，单位 V，记作 e.m.f.。","物理",["e.m.f."]],
  ["electromagnetic induction","电磁感应","导体切割磁感线或磁场变化时产生感应电流的现象，是发电机原理。","物理"],
  ["transformer","变压器","利用电磁感应改变交流电压的装置，理想变压器 Vp/Vs = Np/Ns。","物理"],
  ["wave","波","传递能量而不传递物质的扰动，v = fλ。","物理",["waves"]],
  ["wavelength","波长","相邻两个波峰之间的距离，符号 λ，单位 m。","物理"],
  ["frequency","频率","单位时间内振动的次数，f = 1/T，单位 Hz（赫兹）。","物理"],
  ["amplitude","振幅","振动偏离平衡位置的最大距离，决定波的响度或亮度。","物理"],
  ["transverse wave","横波","振动方向与传播方向垂直的波，如光波、水波。","物理"],
  ["longitudinal wave","纵波","振动方向与传播方向平行的波，如声波，含疏部与密部。","物理"],
  ["refraction","折射","波从一种介质进入另一种介质时速度和方向发生改变的现象。","物理"],
  ["reflection","反射","波遇到界面返回原介质的现象，入射角等于反射角。","物理"],
  ["diffraction","衍射","波绕过障碍物边缘或通过狭缝后扩散的现象。","物理"],
  ["total internal reflection","全反射","光从光密介质射向光疏介质且入射角大于临界角时全部反射的现象。","物理"],
  ["refractive index","折射率","n = sin i / sin r，也等于光在真空与介质中的速度比。","物理"],
  ["electromagnetic spectrum","电磁波谱","按波长排列的电磁波家族：无线电波→微波→红外→可见光→紫外→X 射线→伽马射线。","物理"],
  ["specific heat capacity","比热容","单位质量物质升高 1°C 所需的热量 c，Q = mcΔT。","物理"],
  ["latent heat","潜热","物态变化时吸收或放出而温度不变的热量，Q = mL。","物理"],
  ["conduction","传导","热量通过物质内部粒子振动传递，主要发生在固体中。","物理"],
  ["convection","对流","热量通过流体（液体或气体）的循环流动传递。","物理"],
  ["radiation","辐射","热量以红外线形式传递，不需要介质，真空中也能进行。","物理"],
  ["thermal expansion","热膨胀","物体受热时体积增大的现象，双金属片与温度计都利用它。","物理"],
  ["radioactivity","放射性","不稳定原子核自发放出射线并转变为其他核素的现象。","物理"],
  ["half-life","半衰期","放射性样本中一半原子核发生衰变所需的时间，与外界条件无关。","物理"],
  ["scalar","标量","只有大小没有方向的物理量，如质量、时间、速率。","物理"],
  ["vector quantity","矢量","既有大小又有方向的物理量，如力、速度、加速度。","物理"],
  ["moment","力矩","力使物体绕支点转动的效应，M = F × d（d 为力臂 perpendicular distance）。","物理"],
  ["centre of gravity","重心","物体各部分所受重力的等效作用点。","物理"],
  ["Hooke's law","胡克定律","弹簧的伸长量与所受拉力成正比（在弹性限度内），F = kx。","物理"],

  /* ---------- 化学 Chemistry 0620 ---------- */
  ["atom","原子","化学变化中的最小粒子，由原子核与核外电子构成。","化学"],
  ["proton","质子","原子核中带 +1 电荷的粒子，相对质量 1；质子数决定元素种类。","化学"],
  ["neutron","中子","原子核中不带电的粒子，相对质量 1；影响同位素与稳定性。","化学"],
  ["electron","电子","核外带 −1 电荷的粒子，质量约为质子的 1/1836，决定化学性质。","化学"],
  ["atomic number","原子序数","原子核中的质子数，也等于中性原子的电子数。","化学"],
  ["mass number","质量数","质子数与中子数之和，决定原子的相对质量。","化学"],
  ["isotope","同位素","质子数相同而中子数不同的同种元素原子，化学性质相同但物理性质略有差异。","化学",["isotopes"]],
  ["electron arrangement","电子排布","电子在各电子层上的分布，如钠为 2,8,1；最外层电子数决定化学性质。","化学"],
  ["periodic table","周期表","按原子序数排列的元素表；周期 period 为电子层数，族 group 为最外层电子数。","化学"],
  ["group","族","周期表中的纵列，同族元素最外层电子数相同、化学性质相似。","化学"],
  ["period","周期","周期表中的横行，同周期元素电子层数相同。","化学"],
  ["ionic bond","离子键","金属与非金属之间通过电子转移形成正负离子，靠静电吸引结合。","化学",["ionic bonding"]],
  ["covalent bond","共价键","非金属原子间通过共用电子对形成的化学键。","化学",["covalent bonding"]],
  ["metallic bond","金属键","金属阳离子与自由电子之间的吸引，解释金属的导电性与延展性。","化学",["metallic bonding"]],
  ["giant ionic lattice","巨型离子晶格","离子按规则排列形成的巨大三维结构，熔点高，熔融或溶于水才导电。","化学"],
  ["simple molecular","简单分子","由少量原子组成的小分子物质，分子间作用力弱，熔点沸点低。","化学"],
  ["giant covalent","巨型共价结构","大量原子以共价键连成网状，如金刚石、石墨、二氧化硅，熔点极高。","化学"],
  ["alloy","合金","两种或以上金属（或金属与非金属）熔合而成，因原子大小不同破坏层状结构而更硬。","化学"],
  ["acid","酸","水溶液中产生 H⁺ 的物质，pH < 7，能使蓝色石蕊变红。","化学"],
  ["base","碱","能与酸反应生成盐和水的物质，pH > 7；可溶的碱称为 alkali。","化学",["alkali"]],
  ["neutralisation","中和反应","酸与碱反应生成盐和水，H⁺ + OH⁻ → H₂O。","化学",["neutralization"]],
  ["pH","pH 值","衡量溶液酸碱性的数值，pH<7 酸性，pH=7 中性，pH>7 碱性。","化学"],
  ["indicator","指示剂","随 pH 改变颜色的物质，如石蕊 litmus、酚酞 phenolphthalein、甲基橙 methyl orange。","化学"],
  ["salt","盐","酸中的氢被金属或铵根取代形成的化合物，可由酸与金属、碱或碳酸盐制得。","化学"],
  ["titration","滴定","用已知浓度溶液测定未知浓度溶液的方法，需要指示剂判断终点。","化学"],
  ["oxidation","氧化","失去电子（或化合价升高）的过程；OILRIG 中的 OIL。","化学"],
  ["reduction","还原","得到电子（或化合价降低）的过程；OILRIG 中的 RIG。","化学"],
  ["oxidising agent","氧化剂","使别人被氧化、自身被还原的物质。","化学",["oxidizing agent"]],
  ["reducing agent","还原剂","使别人被还原、自身被氧化的物质。","化学"],
  ["redox","氧化还原","氧化与还原同时发生的反应，可用电子转移或化合价变化判断。","化学"],
  ["electrolysis","电解","用电流使熔融或水溶液中的化合物分解的过程；阳极产生非金属，阴极产生金属或氢气。","化学"],
  ["anode","阳极","电解池中与电源正极相连的电极，阴离子在此失电子被氧化。","化学"],
  ["cathode","阴极","电解池中与电源负极相连的电极，阳离子在此得电子被还原。","化学"],
  ["electrolyte","电解质","熔融或溶于水时能导电的化合物，因含有可自由移动的离子。","化学"],
  ["mole","摩尔","物质的量的单位，1 mol 含 6.02×10²³ 个粒子（阿伏伽德罗常数）。","化学",["moles"]],
  ["molar mass","摩尔质量","1 摩尔物质的质量，数值等于相对分子质量 Mr，单位 g/mol。","化学"],
  ["empirical formula","最简式","表示化合物中各原子最简整数比的式子，如 CH₂。","化学"],
  ["molecular formula","分子式","表示一个分子中各原子实际数目的式子，如 C₂H₄。","化学"],
  ["concentration","浓度","单位体积溶液中所含溶质的量，常用 mol/dm³ 或 g/dm³。","化学"],
  ["rate of reaction","反应速率","单位时间内反应物减少或生成物增加的量，受温度、浓度、表面积、催化剂影响。","化学"],
  ["catalyst","催化剂","改变反应速率而自身在反应前后质量和化学性质不变的物质，通过降低活化能起作用。","化学"],
  ["activation energy","活化能","反应发生所需的最低能量；催化剂通过降低它来加快反应。","化学"],
  ["dynamic equilibrium","动态平衡","正逆反应速率相等、各物质浓度不再改变的状态，体系仍在进行反应。","化学"],
  ["Le Chatelier's principle","勒夏特列原理","改变条件时，平衡会向减弱这种改变的方向移动。","化学"],
  ["exothermic","放热反应","反应过程中向环境放出热量，体系温度升高，ΔH 为负。","化学"],
  ["endothermic","吸热反应","反应过程中从环境吸收热量，体系温度降低，ΔH 为正。","化学"],
  ["alkane","烷烃","通式 CₙH₂ₙ₊₂ 的饱和烃，只含单键，主要发生燃烧与光照取代反应。","化学",["alkanes"]],
  ["alkene","烯烃","通式 CₙH₂ₙ 的不饱和烃，含 C=C 双键，能发生加成反应并使溴水褪色。","化学",["alkenes"]],
  ["functional group","官能团","决定有机物化学性质的原子或原子团，如 −OH、−COOH、C=C。","化学"],
  ["addition reaction","加成反应","不饱和分子打开双键与其他原子结合，只生成一种产物。","化学"],
  ["substitution reaction","取代反应","分子中的原子被其他原子替换的反应，烷烃与卤素在紫外光下发生。","化学"],
  ["esterification","酯化反应","羧酸与醇在浓硫酸催化、加热条件下生成酯和水。","化学"],
  ["polymerisation","聚合反应","大量小分子单体 monomer 连接成长链聚合物 polymer 的过程。","化学",["polymerization","polymer"]],
  ["fermentation","发酵","微生物在无氧条件下分解葡萄糖产生乙醇和二氧化碳的过程。","化学"],
  ["fractional distillation","分馏","利用沸点差异分离液态混合物的方法，用于石油炼制。","化学"],
  ["cracking","裂化","把长链烃分子在高温或催化下断裂成较短链分子的过程。","化学"],
  ["homologous series","同系物","结构相似、分子组成相差若干个 CH₂ 的一系列有机物，化学性质相似。","化学"],
  ["precipitate","沉淀","两种溶液混合生成的不溶性固体产物。","化学"],
  ["filtration","过滤","利用颗粒大小差异分离不溶性固体与液体的方法。","化学"],
  ["crystallisation","结晶","通过蒸发溶剂或降温使溶质析出晶体以提纯固体。","化学",["crystallization"]],
  ["chromatography","色谱法","利用物质在固定相与流动相中分配差异分离混合物的方法。","化学"],
  ["reversible reaction","可逆反应","在同一条件下既能正向又能逆向进行的反应，用 ⇌ 表示。","化学"],

  /* ---------- 生物 Biology 0610 ---------- */
  ["cell membrane","细胞膜","包在细胞外的选择性透过膜，控制物质进出细胞。","生物"],
  ["cytoplasm","细胞质","细胞膜内、细胞核外的胶状物质，是多数化学反应的场所。","生物"],
  ["nucleus","细胞核","含 DNA 的细胞结构，控制细胞的生命活动与遗传。","生物"],
  ["mitochondria","线粒体","进行有氧呼吸释放能量的细胞器，被称为细胞的动力工厂。","生物",["mitochondrion"]],
  ["ribosome","核糖体","进行蛋白质合成 protein synthesis 的细胞器。","生物",["ribosomes"]],
  ["cell wall","细胞壁","植物细胞外由纤维素构成的坚硬结构，起支持与保护作用。","生物"],
  ["chloroplast","叶绿体","含叶绿素 chlorophyll 的细胞器，是光合作用进行的场所。","生物",["chloroplasts"]],
  ["vacuole","液泡","植物细胞中含细胞液的大型囊状结构，维持细胞膨压。","生物"],
  ["diffusion","扩散","粒子由高浓度向低浓度的净移动，被动过程，不需要能量。","生物"],
  ["osmosis","渗透","水分子通过半透膜由高水势向低水势（溶质低浓度向高浓度）的移动。","生物"],
  ["active transport","主动运输","物质逆浓度梯度的运输，需要载体蛋白并消耗 ATP 能量。","生物"],
  ["enzyme","酶","由生物体产生的蛋白质催化剂，具有专一性，受温度与 pH 影响，高温会变性。","生物",["enzymes"]],
  ["denaturation","变性","高温或极端 pH 破坏酶的空间结构，使活性位点改变、失去催化能力。","生物",["denatured"]],
  ["substrate","底物","被酶催化发生反应的物质，与酶的活性位点 active site 结合。","生物"],
  ["photosynthesis","光合作用","绿色植物利用光能把二氧化碳和水合成葡萄糖并释放氧气的过程，发生在叶绿体中。","生物"],
  ["respiration","呼吸作用","分解有机物释放能量的过程；有氧呼吸产生二氧化碳和水，无氧呼吸产生乳酸或酒精。","生物"],
  ["aerobic respiration","有氧呼吸","在氧气参与下彻底分解葡萄糖，释放大量能量并生成 CO₂ 和 H₂O。","生物"],
  ["anaerobic respiration","无氧呼吸","无氧条件下不彻底分解葡萄糖，人体产生乳酸，酵母产生酒精和 CO₂。","生物"],
  ["fermentation (biology)","发酵","微生物无氧呼吸的过程，如酵母把葡萄糖转化为乙醇和二氧化碳。","生物"],
  ["transpiration","蒸腾作用","水分以水蒸气形式从叶片散失的过程，拉动木质部中的水分运输。","生物"],
  ["xylem","木质部","运输水分和无机盐的死细胞管道，方向由根向叶。","生物"],
  ["phloem","韧皮部","运输蔗糖等有机物的活细胞管道，可双向运输。","生物"],
  ["stomata","气孔","叶片下表皮由保卫细胞控制开闭的小孔，是气体交换与水分散失的通道。","生物",["stoma"]],
  ["guard cell","保卫细胞","成对控制气孔开闭的细胞，吸水时气孔张开。","生物"],
  ["translocation","有机物运输","蔗糖等有机物通过韧皮部在植物体内运输的过程。","生物"],
  ["limiting factor","限制因子","在最低水平上限制反应速率的环境因素，如光强、CO₂ 浓度或温度。","生物"],
  ["alveoli","肺泡","肺内进行气体交换的薄壁小囊，表面积大、毛细血管丰富。","生物",["alveolus"]],
  ["villi","绒毛","小肠内壁的微细突起，大幅增加吸收表面积。","生物",["villus"]],
  ["peristalsis","蠕动","消化道管壁肌肉的波浪式收缩，推动食物前进。","生物"],
  ["digestion","消化","把大分子食物分解成可吸收小分子的过程，分机械消化与化学消化。","生物"],
  ["double circulation","双循环","血液两次经过心脏的循环方式：肺循环与体循环。","生物"],
  ["haemoglobin","血红蛋白","红细胞中含铁的蛋白质，与氧结合运输氧气。","生物",["hemoglobin"]],
  ["pathogen","病原体","引起疾病的微生物，如细菌、病毒、真菌。","生物"],
  ["antibody","抗体","淋巴细胞受抗原刺激后产生的特异性蛋白质，能识别并结合抗原。","生物",["antibodies"]],
  ["antigen","抗原","能引发免疫反应的外来物质，通常为病原体表面的蛋白质。","生物"],
  ["vaccination","接种疫苗","引入灭活或减毒病原体刺激机体产生记忆细胞，获得免疫能力。","生物"],
  ["nephron","肾单位","肾脏的功能单位，通过超滤与选择性重吸收形成尿液。","生物"],
  ["ultrafiltration","超滤","血液在肾小球中受高压过滤，小分子进入肾囊的过程。","生物"],
  ["selective reabsorption","选择性重吸收","肾小管把葡萄糖、部分水和盐重新吸收回血液的过程。","生物"],
  ["homeostasis","稳态","机体维持内环境相对稳定的状态，如体温与血糖调节。","生物"],
  ["mitosis","有丝分裂","产生两个与母细胞染色体数目相同的子细胞，用于生长与修复。","生物"],
  ["meiosis","减数分裂","产生染色体数目减半的生殖细胞，增加遗传变异。","生物"],
  ["gene","基因","DNA 上控制某一性状的片段，是遗传的基本单位。","生物",["genes"]],
  ["allele","等位基因","同一基因的不同形式，分显性 dominant 与隐性 recessive。","生物",["alleles"]],
  ["genotype","基因型","个体的基因组成，如 Aa、AA。","生物"],
  ["phenotype","表现型","基因与环境共同作用下表现出的可观察性状。","生物"],
  ["homozygous","纯合","一对等位基因相同，如 AA 或 aa。","生物"],
  ["heterozygous","杂合","一对等位基因不同，如 Aa。","生物"],
  ["dominant","显性","杂合状态下就能表现出来的等位基因，用大写字母表示。","生物"],
  ["recessive","隐性","只有在纯合状态才表现出来的等位基因，用小写字母表示。","生物"],
  ["Punnett square","庞尼特方格","预测杂交后代基因型与表现型概率的方格图。","生物"],
  ["natural selection","自然选择","有利变异的个体更易生存繁殖并传递性状，是进化的主要机制。","生物"],
  ["food chain","食物链","表示生物之间吃与被吃关系的链条，能量沿链单向流动。","生物"],
  ["food web","食物网","多条食物链交错形成的网状结构，更真实反映生态系统关系。","生物"],
  ["producer","生产者","能进行光合作用制造有机物的绿色植物，是食物链的基础。","生物"],
  ["decomposer","分解者","分解动植物残体的微生物，把有机物还原为无机物。","生物"],
  ["ecosystem","生态系统","生物群落与其非生物环境相互作用形成的统一整体。","生物"],
  ["biodiversity","生物多样性","一定区域内物种、基因与生态系统的丰富程度。","生物"],
  ["carbon cycle","碳循环","碳在大气、生物与地壳之间循环的过程，光合作用吸收 CO₂，呼吸与燃烧释放 CO₂。","生物"],
  ["nitrogen cycle","氮循环","氮在大气、土壤与生物之间转换的过程，依赖固氮菌与硝化细菌。","生物"],
  ["eutrophication","富营养化","水体中营养盐过多导致藻类爆发、缺氧、生物死亡的过程。","生物"],
  ["deforestation","毁林","大规模砍伐森林，导致 CO₂ 增加、土壤侵蚀与生物多样性下降。","生物"],
  ["selective breeding","选择性育种","人为挑选具有优良性状的个体繁殖，以获得理想后代。","生物"],
  ["genetic modification","基因改造","把外源基因导入生物体以获得新性状的技术。","生物"],

  /* ---------- 经济 Economics 0455 ---------- */
  ["demand","需求","消费者在一定价格下愿意且能够购买的数量；价格上升，需求量下降。","经济"],
  ["supply","供给","生产者在一定价格下愿意且能够提供的数量；价格上升，供给量上升。","经济"],
  ["equilibrium price","均衡价格","需求量等于供给量时的价格，市场上没有短缺或过剩。","经济"],
  ["shortage","短缺","在某一价格下需求量大于供给量的状态，价格有上升压力。","经济"],
  ["surplus","过剩","在某一价格下供给量大于需求量的状态，价格有下降压力。","经济"],
  ["price elasticity of demand","需求价格弹性","PED = %Δ需求量 ÷ %Δ价格；|PED|>1 富有弹性，<1 缺乏弹性。","经济",["PED"]],
  ["elastic","富有弹性","需求量对价格变化很敏感，|PED| > 1，多为奢侈品或有替代品的商品。","经济"],
  ["inelastic","缺乏弹性","需求量对价格变化不敏感，|PED| < 1，多为必需品。","经济"],
  ["necessity","必需品","生活不可缺少的商品，需求缺乏弹性，如食盐、大米。","经济"],
  ["luxury","奢侈品","非生活必需的高档商品，需求富有弹性，收入增加时需求大幅上升。","经济"],
  ["substitute","替代品","可以互相替代满足同一需要的商品，一种涨价会使另一种需求上升。","经济",["substitutes"]],
  ["complement","互补品","需要搭配使用的商品，一种涨价会使另一种需求下降。","经济",["complements"]],
  ["opportunity cost","机会成本","做出某一选择时所放弃的次优选择的价值，是经济学的核心概念。","经济"],
  ["scarcity","稀缺性","资源有限而欲望无限，因此必须做出选择。","经济"],
  ["division of labour","劳动分工","把生产过程分解为若干专门工序，提高熟练度与效率。","经济"],
  ["specialisation","专业化","个人或地区集中生产其效率最高的产品，通过贸易获得其他产品。","经济"],
  ["GDP","国内生产总值","一国境内一定时期内生产的最终产品和服务的总价值，衡量经济规模。","经济",["gross domestic product"]],
  ["inflation","通货膨胀","一般物价水平持续上升、货币购买力下降的现象，常用 CPI 衡量。","经济"],
  ["deflation","通货紧缩","一般物价水平持续下降的现象，可能抑制消费与投资。","经济"],
  ["unemployment","失业","有劳动能力且愿意工作的人找不到工作的状态。","经济"],
  ["fiscal policy","财政政策","政府通过税收 taxation 与政府支出 government spending 调节经济的手段。","经济"],
  ["monetary policy","货币政策","中央银行通过利率 interest rate 与货币供应量调节经济的手段。","经济"],
  ["exchange rate","汇率","一种货币用另一种货币表示的价格；本币升值使出口变贵、进口变便宜。","经济"],
  ["balance of payments","国际收支","记录一国与国外全部经济交易的账户，含经常账户与资本账户。","经济"],
  ["externality","外部性","生产或消费对第三方产生的未经市场定价的影响，分正负外部性。","经济",["externalities"]],
  ["public good","公共物品","具有非竞争性 non-rivalry 与非排他性 non-excludability 的物品，如国防、路灯。","经济",["public goods"]],
  ["free rider","搭便车者","不付费却享受公共物品收益的人，导致私人企业不愿提供公共物品。","经济"],
  ["market failure","市场失灵","自由市场配置资源无效率的情形，常由外部性、公共物品或垄断引起。","经济"],
  ["monopoly","垄断","只有一个卖家的市场结构，能控制价格与产量，通常效率较低。","经济"],
  ["perfect competition","完全竞争","大量买卖双方、产品同质、自由进出、信息完全的市场结构。","经济"],
  ["price ceiling","价格上限","政府规定的最高价格，低于均衡价会造成短缺。","经济"],
  ["price floor","价格下限","政府规定的最低价格，高于均衡价会造成过剩。","经济"],
  ["subsidy","补贴","政府向生产者提供的资金扶持，降低成本、增加供给。","经济"],
  ["indirect tax","间接税","对商品和服务征收的税，由生产者缴纳但常转嫁给消费者。","经济"],
  ["aggregate demand","总需求","经济中所有部门在一定价格水平下的总支出，C + I + G + (X − M)。","经济"],
  ["business cycle","经济周期","经济活动经历的扩张、顶峰、衰退、谷底的循环波动。","经济"],
  ["comparative advantage","比较优势","以更低机会成本生产某商品的能力，是国际贸易的基础。","经济"],
  ["tariff","关税","对进口商品征收的税，提高进口价格以保护本国产业。","经济"],
  ["quota","配额","对进口数量的限制，直接限制进口规模。","经济"],

  /* ---------- 英语 ESL 0510 ---------- */
  ["simple present","一般现在时","表示习惯、事实或常态，第三人称单数动词加 -s。","英语"],
  ["present continuous","现在进行时","am/is/are + V-ing，表示此时此刻正在进行的动作。","英语"],
  ["present perfect","现在完成时","have/has + 过去分词，表示过去发生但对现在有影响的动作。","英语"],
  ["past perfect","过去完成时","had + 过去分词，表示在过去某时间点之前已完成的动作。","英语"],
  ["future perfect","将来完成时","will have + 过去分词，表示在将来某时间之前将完成的动作。","英语"],
  ["passive voice","被动语态","be + 过去分词，强调动作承受者；执行者未知或不重要时使用。","英语"],
  ["conditional","条件句","由 if 引导的句子；第一条件表真实将来，第二条件与现在相反，第三条件与过去相反。","英语",["conditionals"]],
  ["relative clause","定语从句","修饰名词的从句，用 who、which、that、whose、where 等关系词引导。","英语",["relative clauses"]],
  ["relative pronoun","关系代词","引导定语从句的词：who/whom 指人，which 指物，that 可指人或物，whose 表所属。","英语"],
  ["noun clause","名词性从句","在句中充当名词的从句，由 that、whether、if 或 wh- 词引导。","英语"],
  ["adverbial clause","状语从句","在句中充当状语的从句，表时间、条件、让步、原因、目的等。","英语"],
  ["modal verb","情态动词","can、could、may、might、must、should 等，表示能力、可能、义务等语气。","英语",["modal verbs"]],
  ["reported speech","间接引语","转述他人话语时调整时态、人称与时间状语的句式。","英语"],
  ["phrasal verb","短语动词","动词加副词或介词构成、含义常无法直推的组合，如 give up、look after。","英语"],
  ["collocation","搭配","经常一起出现、约定俗成的词组，如 make a decision、heavy rain。","英语"],
  ["prefix","前缀","加在词首改变词义的词缀，如 un-、re-、dis-。","英语"],
  ["suffix","后缀","加在词尾常改变词性的词缀，如 -ment、-tion、-ful。","英语"],
  ["synonym","同义词","意义相同或相近的词，阅读与写作中常用于同义替换。","英语"],
  ["antonym","反义词","意义相反的词。","英语"],
  ["inference","推断","根据文本线索推出未明说信息的能力，是阅读高分题的关键。","英语"],
  ["skimming","略读","快速通读抓主旨 main idea 的阅读方法。","英语"],
  ["scanning","扫读","带着问题快速查找特定细节的阅读方法。","英语"],
  ["paraphrase","同义改写","用不同词句表达相同意思，摘要题与写作都大量使用。","英语"],
  ["register","语域","根据场合与对象选择的语言正式程度，如正式 formal 与非正式 informal。","英语"],
  ["cohesion","衔接","句子与段落之间靠连接词、指代等手段形成的连贯关系。","英语"],
  ["linking word","连接词","表递进、转折、因果、举例、总结等逻辑关系的词，如 however、therefore。","英语",["linking words"]],
  ["main idea","主旨","段落或文章的核心观点，通常在首句或末句。","英语"],
  ["topic sentence","主题句","概括段落中心思想的句子，多为段落首句。","英语"],
  ["summary","摘要","不改变原意、压缩篇幅的简短复述，须严格控制字数。","英语"],
  ["tone","语气","作者表达的态度或情绪，如客观、讽刺、担忧、赞赏。","英语"],
  ["idiom","习语","整体含义不等于单词字面之和的固定表达，如 break the ice。","英语"],
  ["punctuation","标点","逗号、分号、冒号、破折号等符号的用法，直接影响写作得分。","英语"],
  ["countable noun","可数名词","可以用数目计量、有单复数形式的名词，可与 a/an、many 搭配。","英语"],
  ["uncountable noun","不可数名词","不能用数目直接计量的名词，无复数，常与 much、a lot of 搭配。","英语"],
  ["gerund","动名词","动词加 -ing 起名词作用的成分，常作主语或某些动词的宾语。","英语"],
  ["infinitive","不定式","to + 动词原形，可作主语、宾语或目的状语。","英语"],

  /* ---------- ICT 0417 ---------- */
  ["hardware","硬件","计算机的物理组成部分，如 CPU、内存、键盘、显示器。","ICT"],
  ["software","软件","运行在硬件上的程序与数据，分系统软件 system software 与应用软件 application software。","ICT"],
  ["CPU","中央处理器","执行指令的核心部件，包含算术逻辑单元 ALU、控制单元 CU 与寄存器。","ICT",["central processing unit"]],
  ["ALU","算术逻辑单元","CPU 中负责算术运算与逻辑判断的部件。","ICT"],
  ["control unit","控制单元","CPU 中负责取指、译码并协调各部件工作的部件。","ICT"],
  ["register","寄存器","CPU 内部的高速小容量存储单元，如程序计数器 PC、MAR、MDR、累加器。","ICT",["registers"]],
  ["RAM","随机存取存储器","易失性内存，断电后数据丢失，用于临时存放正在运行的程序与数据。","ICT"],
  ["ROM","只读存储器","非易失性内存，断电数据不丢失，存放启动程序 BIOS。","ICT"],
  ["cache","高速缓存","位于 CPU 与主存之间的高速临时存储，常用数据放入其中可减少访问延迟。","ICT"],
  ["SSD","固态硬盘","基于闪存、无机械运动部件的存储设备，速度快、抗震但单位成本较高。","ICT"],
  ["HDD","机械硬盘","利用旋转盘片与磁头读写数据的存储设备，容量大、成本低但抗震性弱。","ICT"],
  ["input device","输入设备","向计算机送入数据的设备，如键盘、鼠标、扫描仪、传感器。","ICT"],
  ["output device","输出设备","把计算机处理结果呈现出来的设备，如显示器、打印机、扬声器。","ICT"],
  ["sensor","传感器","把物理量（温度、光线等）转换为电信号输入计算机的设备。","ICT"],
  ["actuator","执行器","接收计算机指令并产生实际动作的装置，如电机、阀门。","ICT"],
  ["operating system","操作系统","管理硬件资源并为应用程序提供服务的系统软件，如 Windows、macOS、Linux。","ICT"],
  ["utility software","实用软件","用于维护与优化系统的软件，如杀毒、压缩、磁盘清理工具。","ICT"],
  ["application software","应用软件","为完成具体任务而设计的软件，如文字处理、电子表格、演示软件。","ICT"],
  ["spreadsheet","电子表格","以行列单元格组织数据、支持公式与图表的软件，如 Excel。","ICT"],
  ["worksheet","工作表","电子表格文件中的单个页面，由行和列组成的单元格网格构成。","ICT"],
  ["cell reference","单元格引用","单元格的地址表示方式，如 B2；绝对引用用 $ 固定行或列。","ICT"],
  ["absolute reference","绝对引用","复制公式时保持不变的引用，写作 $F$1，用美元符号固定行与列。","ICT"],
  ["relative reference","相对引用","复制公式时随位置自动调整的引用，如 B2 向下复制变为 B3。","ICT"],
  ["formula","公式","由运算符、单元格引用与函数组成的计算表达式，以等号开头。","ICT"],
  ["function","函数","预定义的计算过程，如 SUM、AVERAGE、IF、COUNTIF、VLOOKUP。","ICT"],
  ["validation","数据校验","检查输入数据是否合理、符合规则的自动检查，如范围检查、长度检查。","ICT"],
  ["verification","录入验证","检查输入数据是否与原始资料一致，如二次输入比对、目视核对。","ICT"],
  ["range check","范围检查","验证数值是否落在允许上下界之间的校验方式。","ICT"],
  ["presence check","存在性检查","验证必填字段是否为空的校验方式。","ICT"],
  ["mail merge","邮件合并","把主文档与数据源结合，批量生成带不同收件人信息的文档。","ICT"],
  ["database","数据库","有组织地存储与管理大量结构化数据的系统。","ICT"],
  ["table","表","数据库中按行和列组织数据的对象。","ICT"],
  ["record","记录","表中的一行，描述一个实体的完整信息。","ICT"],
  ["field","字段","表中的一列，描述实体的某一属性及其数据类型。","ICT"],
  ["primary key","主键","唯一标识表中每条记录的字段，不可重复且不能为空。","ICT"],
  ["foreign key","外键","指向另一张表主键的字段，用于建立表之间的联系。","ICT"],
  ["query","查询","按条件从数据库中检索、筛选或统计数据。","ICT"],
  ["network","网络","把多台设备连接起来以共享资源与信息的系统。","ICT"],
  ["LAN","局域网","覆盖范围较小的网络，如家庭、学校或办公楼内的网络。","ICT"],
  ["WAN","广域网","覆盖范围很大的网络，互联网是最大的广域网。","ICT"],
  ["topology","拓扑","网络中设备连接的结构形式，如星型 star、总线型 bus、环型 ring、网状 mesh。","ICT"],
  ["router","路由器","根据 IP 地址在不同网络之间转发数据包的设备。","ICT"],
  ["switch","交换机","根据 MAC 地址在局域网内转发数据帧的设备。","ICT"],
  ["bandwidth","带宽","通信线路在单位时间内能传输的最大数据量，影响传输速度。","ICT"],
  ["protocol","协议","设备通信必须共同遵守的规则集合，如 TCP/IP、HTTP、FTP。","ICT"],
  ["IP address","IP 地址","网络中设备的逻辑地址，用于在网络层定位设备。","ICT"],
  ["MAC address","MAC 地址","网卡的物理地址，全球唯一，用于局域网内识别设备。","ICT"],
  ["URL","统一资源定位符","网页地址，由协议 protocol、域名 domain 与路径 path 组成。","ICT"],
  ["DNS","域名系统","把人类可读的域名解析为 IP 地址的服务。","ICT",["domain name system"]],
  ["cloud computing","云计算","通过互联网按需获取计算、存储与应用资源的服务模式。","ICT"],
  ["backup","备份","为防数据丢失而复制保存的数据副本，常用 3-2-1 原则。","ICT"],
  ["encryption","加密","把明文转换为密文使未经授权者无法读取的技术，需密钥才能解密。","ICT"],
  ["firewall","防火墙","按规则监控并过滤进出网络流量的安全屏障。","ICT"],
  ["authentication","身份验证","确认用户身份的过程，常用密码、指纹或双因素认证。","ICT"],
  ["phishing","网络钓鱼","伪装成可信机构骗取账号密码等敏感信息的攻击方式。","ICT"],
  ["malware","恶意软件","以破坏、窃取或控制为目的的软件的统称，含病毒、木马、勒索软件。","ICT"],
  ["virus","病毒","能自我复制并感染其他文件或程序的恶意代码。","ICT"],
  ["antivirus","杀毒软件","检测、隔离并清除恶意软件的防护软件。","ICT"],
  ["spyware","间谍软件","在用户不知情时收集使用习惯或敏感信息的软件。","ICT"],
  ["hacking","黑客入侵","未经授权访问或破坏计算机系统的行为。","ICT"],
  ["data protection","数据保护","按法律与规范保护个人数据免遭泄露、滥用或丢失的要求。","ICT"],
  ["bitmap","位图","由像素点阵构成的图像，放大后会失真模糊，适合照片。","ICT"],
  ["vector graphic","矢量图","用数学公式描述形状的图像，放大不失真，适合标志与插图。","ICT",["vector"]],
  ["compression","压缩","用更少的数据量表示文件的技术，分无损 lossless 与有损 lossy。","ICT"],
  ["accessibility","可访问性","使残障人士也能使用产品或服务的设计考量，如屏幕阅读器与替代文本。","ICT"],
  ["alt text","替代文本","图片的 alt 属性文字，供屏幕阅读器与图片加载失败时显示。","ICT"],
  ["stylesheet","样式表","定义网页外观规则的文件，多个页面可共享同一个外部样式表。","ICT"],
  ["implementation","系统实施","新系统投入使用的过程，分直接、并行、分阶段与试点四种方式。","ICT"],
  ["parallel implementation","并行实施","新旧系统同时运行一段时间的实施方式，可比对结果但成本更高。","ICT"],
  ["digital divide","数字鸿沟","不同地区或人群在信息技术获取与使用上的差距。","ICT"],

  /* ---------- 计算机科学 CS 0478 ---------- */
  ["binary","二进制","只使用 0 和 1 的进位计数制，是计算机内部表示数据的基础。","计算机科学"],
  ["denary","十进制","日常使用的以 10 为基数的计数制，也称 decimal。","计算机科学"],
  ["hexadecimal","十六进制","以 16 为基数的计数制，用 0-9 与 A-F 表示，一位对应四个二进制位。","计算机科学"],
  ["bit","位","一个二进制位，是数据的最小单位，取值 0 或 1。","计算机科学"],
  ["byte","字节","8 个二进制位构成的数据单位，通常表示一个字符。","计算机科学"],
  ["overflow","溢出","运算结果超出可用位数所能表示范围的错误。","计算机科学"],
  ["ASCII","ASCII 编码","用 7 位或 8 位二进制表示英文字符的标准编码。","计算机科学"],
  ["unicode","Unicode","覆盖世界上绝大多数文字字符的统一编码方案。","计算机科学"],
  ["two's complement","二进制补码","在计算机中表示有符号整数的编码方式，最高位为符号位。","计算机科学"],
  ["logic gate","逻辑门","实现基本逻辑运算的电路，有 AND、OR、NOT、XOR、NAND、NOR。","计算机科学",["logic gates"]],
  ["truth table","真值表","列出逻辑电路全部输入组合及对应输出的表格；n 个输入有 2ⁿ 行。","计算机科学"],
  ["boolean","布尔","只有真 true 与假 false 两种取值的逻辑量。","计算机科学",["boolean expression"]],
  ["De Morgan's law","德摩根定律","NOT(A AND B) = (NOT A) OR (NOT B)，用于逻辑表达式化简。","计算机科学"],
  ["algorithm","算法","解决某问题的有限步骤的精确描述，具有输入、输出、确定性与有穷性。","计算机科学"],
  ["pseudocode","伪代码","用接近自然语言与程序结构的记号描述算法的方式。","计算机科学"],
  ["flowchart","流程图","用标准图形符号表示算法步骤与流向的图示。","计算机科学"],
  ["linear search","线性搜索","从头到尾逐个比较查找目标，O(n)，不要求数据有序。","计算机科学"],
  ["binary search","二分搜索","每次排除一半区间的查找算法，O(log n)，要求数据已排序。","计算机科学"],
  ["bubble sort","冒泡排序","反复比较交换相邻元素，每轮把最大元素移到末尾，O(n²)。","计算机科学"],
  ["insertion sort","插入排序","把每个元素插入到前面已排好序部分的合适位置，O(n²)。","计算机科学"],
  ["merge sort","归并排序","把序列分半递归排序后再合并的分治算法，O(n log n)。","计算机科学"],
  ["quick sort","快速排序","选取基准值分区递归排序的算法，平均 O(n log n)。","计算机科学"],
  ["big O notation","大O表示法","描述算法运行时间或空间随数据规模增长的量级。","计算机科学"],
  ["variable","变量","程序中命名的存储单元，用于保存可以改变的数据。","计算机科学"],
  ["constant","常量","程序中值在运行时不能被改变的量。","计算机科学"],
  ["data type","数据类型","规定变量可存放的数据种类，如整数、实数、字符、布尔、字符串。","计算机科学"],
  ["selection","选择结构","根据条件决定执行哪个分支的结构，如 IF-THEN-ELSE、CASE。","计算机科学"],
  ["iteration","迭代","重复执行一段代码的结构，如 FOR、WHILE、REPEAT-UNTIL。","计算机科学",["loop"]],
  ["array","数组","相同类型元素的连续集合，用下标 index 访问。","计算机科学"],
  ["procedure","过程","执行一组语句但不返回值的子程序。","计算机科学"],
  ["parameter","参数","在调用子程序时传入的数据，分形参 formal 与实参 actual。","计算机科学"],
  ["recursion","递归","子程序调用自身的编程技巧，必须有基准情形 base case 终止。","计算机科学"],
  ["accumulator","累加器","用于把若干数值累加求和的变量，循环前须初始化。","计算机科学"],
  ["counter","计数器","用于记录事件发生次数的变量，通常每次加一。","计算机科学"],
  ["sentinel value","哨兵值","作为输入结束标志的特殊值，如用 -1 表示输入结束。","计算机科学"],
  ["trace table","追踪表","手工逐行记录变量值变化以验证算法的工具。","计算机科学"],
  ["test data","测试数据","用于检验程序的输入，应包含正常、边界与错误三类数据。","计算机科学"],
  ["compiler","编译器","把整个源程序一次性翻译成机器码的工具，运行速度快。","计算机科学"],
  ["interpreter","解释器","逐行翻译并立即执行源程序的工具，便于调试但速度较慢。","计算机科学"],
  ["assembler","汇编器","把汇编语言翻译成机器码的程序。","计算机科学"],
  ["Von Neumann architecture","冯·诺依曼架构","指令与数据存放在同一存储器中、按顺序取指译码执行的计算机结构。","计算机科学"],
  ["fetch-decode-execute","取指译码执行","CPU 执行一条指令的三个阶段，合称指令周期。","计算机科学"],
  ["interrupt","中断","暂停当前任务转而处理更紧急事件的机制。","计算机科学"],
  ["parity check","奇偶校验","通过使 1 的个数为奇数或偶数来检测单比特错误的方法。","计算机科学"],
  ["checksum","校验和","把数据按规则求和后随数据一起发送，用于检测传输错误。","计算机科学"],
  ["packet switching","分组交换","把数据切成分组分别路由传输、到达后重组的技术。","计算机科学"],
  ["SQL","SQL","用于查询与操作数据库的结构化查询语言，如 SELECT ... FROM ... WHERE。","计算机科学"],
  ["object-oriented programming","面向对象编程","以对象与类组织代码的编程范式，支持封装、继承与多态。","计算机科学"],
  ["procedural programming","过程式编程","以过程或函数为基本单位、按步骤组织代码的编程范式。","计算机科学"],
  ["HTTP","超文本传输协议","用于在浏览器与服务器之间传输网页的协议，HTTPS 为其加密版本。","计算机科学"],
  ["SSL","安全套接层","为网络通信提供加密与身份认证的协议，HTTPS 即 HTTP over SSL/TLS。","计算机科学"],
  ["digital signature","数字签名","用于验证消息来源与完整性的加密技术。","计算机科学"],
  ["SQL injection","SQL 注入","通过输入恶意 SQL 片段攻击数据库的手段，可用参数化查询防范。","计算机科学"],
  ["DDoS","分布式拒绝服务","用大量请求耗尽服务器资源使其无法提供服务的攻击。","计算机科学"],
  ["botnet","僵尸网络","被恶意控制的大量设备组成的网络，常用于发起攻击。","计算机科学"],
  ["penetration testing","渗透测试","模拟攻击以发现系统漏洞的授权安全测试。","计算机科学"],
];

/* ---------- 构建索引 ---------- */
const GLOSSARY_TERMS = GLOSSARY_ENTRIES.map(([en, zh, def, subj, extra]) => {
  const aliases = [...new Set([en, zh, ...(extra || [])])].filter(Boolean);
  const ascii = /^[\x00-\x7F]+$/.test(en);
  const csList = aliases.filter(a => /[A-Z]/.test(a) && a === a.toUpperCase() && a.length <= 5);
  return { en, zh, def, subj: subj || '', aliases: [...aliases].sort((x, y) => y.length - x.length), csList };
});

const KW_MAP = new Map();
const KW_ALIAS_LIST = [];
GLOSSARY_TERMS.forEach(entry => {
  entry.aliases.forEach(a => {
    const key = a.toLowerCase();
    if (!KW_MAP.has(key)) KW_MAP.set(key, entry);
    KW_ALIAS_LIST.push(a);
  });
});

// 长词优先，避免短词抢占匹配
KW_ALIAS_LIST.sort((a, b) => b.length - a.length);

const KW_ESCAPE_RE = /[.*+?^${}()|[\]\\]/g;
const KW_RE = new RegExp(
  KW_ALIAS_LIST.map(a => a.replace(KW_ESCAPE_RE, '\\$&') + (/^[\x00-\x7F]+$/.test(a) ? '(?![A-Za-z0-9_])' : '')).join('|'),
  'gi'
);

const KW_SKIP_TAGS = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEXTAREA', 'INPUT', 'SELECT', 'OPTION', 'BUTTON']);

function kwEscape(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

function kwIsAscii(text) { return /^[\x00-\x7F]+$/.test(text); }
function kwIsWordChar(ch) { return ch ? /[A-Za-z0-9_]/.test(ch) : false; }

function kwMakeSpan(entry, text) {
  const span = document.createElement('span');
  span.className = 'kw-term';
  span.setAttribute('data-kw-en', entry.en);
  span.setAttribute('data-kw-zh', entry.zh);
  span.setAttribute('data-kw-def', entry.def);
  span.setAttribute('data-kw-subj', entry.subj);
  span.textContent = text;
  return span;
}

function kwEnhanceTextNode(node, seen) {
  const text = node.nodeValue;
  if (!text) return;
  KW_RE.lastIndex = 0;
  const frag = document.createDocumentFragment();
  let last = 0, match, matched = 0;
  while ((match = KW_RE.exec(text)) !== null) {
    if (match[0] === '') { KW_RE.lastIndex++; continue; }
    const idx = match.index;
    if (idx < last) continue;
    const word = match[0];
    const entry = KW_MAP.get(word.toLowerCase());
    if (!entry) continue;
    // 同一个区块内同一个词只标记一次，避免整篇密密麻麻
    if (seen) {
      const key = entry.zh + '|' + entry.en;
      if (seen.has(key)) continue;
      seen.add(key);
    }
    if (kwIsAscii(word)) {
      if (kwIsWordChar(text[idx - 1])) continue;
      if (entry.csList.length && !entry.csList.includes(word)) continue;
    }
    frag.appendChild(document.createTextNode(text.slice(last, idx)));
    frag.appendChild(kwMakeSpan(entry, word));
    last = idx + word.length;
    matched++;
    if (KW_RE.lastIndex <= idx) KW_RE.lastIndex = last;
  }
  if (!matched) return;
  if (last < text.length) frag.appendChild(document.createTextNode(text.slice(last)));
  if (node.parentNode) node.parentNode.replaceChild(frag, node);
}

function enhanceKeywords(root) {
  root = root || document.body;
  if (!root || !document.createTreeWalker) return;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
      let p = node.parentElement;
      while (p && p !== document.body) {
        if (KW_SKIP_TAGS.has(p.tagName)) return NodeFilter.FILTER_REJECT;
        if (p.classList && p.classList.contains('kw-term')) return NodeFilter.FILTER_REJECT;
        if (p.hasAttribute && p.hasAttribute('data-nokw')) return NodeFilter.FILTER_REJECT;
        p = p.parentElement;
      }
      return NodeFilter.FILTER_ACCEPT;
    }
  });
  const nodes = [];
  while (walker.nextNode()) nodes.push(walker.currentNode);
  const seenByBlock = new Map();
  nodes.forEach(node => {
    // 以 root 的直接子元素作为一个“区块”，区块内同一词条只高亮首次出现
    let block = node.parentElement, top = node.parentElement;
    while (block && block.parentElement && block.parentElement !== root) { block = block.parentElement; }
    if (!block) block = top || root;
    if (!seenByBlock.has(block)) seenByBlock.set(block, new Set());
    kwEnhanceTextNode(node, seenByBlock.get(block));
  });
}

/* ---------- 悬浮释义气泡 ---------- */
let kwTooltip = null;
let kwActive = null;

function kwEnsureTooltip() {
  if (kwTooltip) return kwTooltip;
  kwTooltip = document.createElement('div');
  kwTooltip.id = 'kw-tooltip';
  kwTooltip.className = 'kw-tooltip hidden';
  kwTooltip.setAttribute('role', 'tooltip');
  kwTooltip.setAttribute('data-nokw', '1');
  document.body.appendChild(kwTooltip);
  document.addEventListener('mouseover', kwOnOver);
  document.addEventListener('mouseleave', kwHide);
  document.addEventListener('click', kwOnClick, true);
  window.addEventListener('scroll', kwHide, true);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') kwHide(); });
  return kwTooltip;
}

function kwOnOver(e) {
  const target = e.target && e.target.closest ? e.target.closest('.kw-term') : null;
  if (target) { if (target !== kwActive) { kwActive = target; kwShow(target); } }
  else if (kwActive) kwHide();
}

function kwOnClick(e) {
  const target = e.target && e.target.closest ? e.target.closest('.kw-term') : null;
  if (target) { kwActive = target; kwShow(target); }
  else if (kwTooltip && !kwTooltip.classList.contains('hidden')) kwHide();
}

function kwShow(el) {
  const tip = kwEnsureTooltip();
  const en = el.getAttribute('data-kw-en') || '';
  const zh = el.getAttribute('data-kw-zh') || '';
  const def = el.getAttribute('data-kw-def') || '';
  const subj = el.getAttribute('data-kw-subj') || '';
  tip.innerHTML =
    '<div class="kwt-head"><span class="kwt-zh">' + kwEscape(zh) + '</span><span class="kwt-en">' + kwEscape(en) + '</span></div>' +
    (subj ? '<div class="kwt-subj">' + kwEscape(subj) + '</div>' : '') +
    '<div class="kwt-def">' + kwEscape(def) + '</div>';
  tip.classList.remove('hidden');
  const rect = el.getBoundingClientRect();
  const tw = tip.offsetWidth, th = tip.offsetHeight;
  let top = rect.bottom + 8;
  if (top + th > window.innerHeight - 10) top = Math.max(10, rect.top - th - 8);
  let left = Math.min(Math.max(10, rect.left), Math.max(10, window.innerWidth - tw - 10));
  tip.style.left = left + 'px';
  tip.style.top = top + 'px';
}

function kwHide() {
  kwActive = null;
  if (kwTooltip) kwTooltip.classList.add('hidden');
}

if (document.readyState === 'loading') window.addEventListener('DOMContentLoaded', kwEnsureTooltip);
else kwEnsureTooltip();
