#!/usr/bin/env python3
# -*- coding: utf-8 -*-
import json

# ===== EXPAND BIOLOGY =====
with open('db-biology.json') as f:
    bio = json.load(f)

new_lessons = [
    {
        "id": 517, "unitId": 443,
        "title": "绿色植物的呼吸作用",
        "content": "## 一、呼吸作用的概念\n\n细胞利用**氧气**，将有机物分解成**二氧化碳和水**，并且将储存在有机物中的能量释放出来，供给生命活动的需要。\n\n### 呼吸作用公式\n\n**有机物 + 氧气 --(线粒体)--> 二氧化碳 + 水 + 能量**\n\n## 二、呼吸作用与光合作用的区别与联系\n\n| 比较项目 | 光合作用 | 呼吸作用 |\n|---------|---------|----------|\n| 场所 | 叶绿体 | 线粒体 |\n| 条件 | 光 | 有光无光均可 |\n| 原料 | 二氧化碳、水 | 有机物、氧气 |\n| 产物 | 有机物、氧气 | 二氧化碳、水 |\n| 能量 | 储存能量 | 释放能量 |\n\n## 三、呼吸作用的意义\n\n呼吸作用释放的能量一部分用于维持体温，另一部分用于各项生命活动。呼吸作用是**所有生物的共同特征**。",
        "keyPoints": ["呼吸作用分解有机物释放能量", "呼吸作用在线粒体中进行", "光合作用和呼吸作用相互对立又相互依存", "呼吸作用有光无光都能进行"],
        "images": [{"keyword": "植物呼吸作用", "caption": "植物呼吸作用示意图", "source": "Wikipedia"}, {"keyword": "线粒体结构", "caption": "线粒体结构图-细胞的动力工厂", "source": "Wikipedia"}]
    },
    {
        "id": 518, "unitId": 446,
        "title": "人体内废物的排出",
        "content": "## 一、排泄的途径\n\n人体将二氧化碳、尿素以及多余的水和无机盐等排出体外的过程叫做排泄。\n\n三条排泄途径：\n1. **呼吸系统**：排出二氧化碳和少量水（以气体形式）\n2. **皮肤**：排出水、无机盐和少量尿素（以汗液形式）\n3. **泌尿系统**：排出绝大部分水、无机盐和尿素（以尿液形式）\n\n## 二、泌尿系统的组成\n\n泌尿系统由**肾脏、输尿管、膀胱、尿道**组成。\n\n- **肾脏**：形成尿液（主要器官）\n- **输尿管**：输送尿液\n- **膀胱**：暂时储存尿液\n- **尿道**：排出尿液\n\n## 三、尿的形成\n\n肾脏结构和功能的基本单位是**肾单位**。每个肾单位由**肾小球、肾小囊、肾小管**组成。\n\n尿的形成过程：\n1. **肾小球的过滤作用**：血液流经肾小球时，血细胞和大分子蛋白质不能滤过，形成**原尿**\n2. **肾小管的重吸收作用**：原尿流经肾小管时，全部葡萄糖、大部分水和部分无机盐被重吸收回血液，形成**尿液**",
        "keyPoints": ["排泄的三条途径：呼吸、皮肤、泌尿", "泌尿系统由肾脏、输尿管、膀胱、尿道组成", "肾单位是肾脏的基本单位", "尿的形成：过滤-原尿-重吸收-尿液"],
        "images": [{"keyword": "人体泌尿系统", "caption": "人体泌尿系统示意图", "source": "Wikipedia"}, {"keyword": "肾单位结构", "caption": "肾单位结构图-肾小球、肾小囊、肾小管", "source": "Wikipedia"}]
    },
    {
        "id": 519, "unitId": 448,
        "title": "细菌",
        "content": "## 一、细菌的发现\n\n17世纪，荷兰人**列文虎克**用自制显微镜发现了细菌。\n\n19世纪，法国科学家**巴斯德**通过鹅颈瓶实验证明了细菌不是自然发生的，而是由原来已存在的细菌产生的。巴斯德还发明了**巴氏消毒法**和**狂犬病疫苗**，被称为**微生物学之父**。\n\n## 二、细菌的形态和结构\n\n细菌的形态：**球状、杆状、螺旋状**三种。\n\n细菌的结构：\n- 基本结构：细胞壁、细胞膜、细胞质、DNA集中区域\n- 特殊结构：荚膜（保护）、鞭毛（运动）\n- **没有成形的细胞核**（原核生物）\n\n## 三、细菌的营养和生殖\n\n- 营养方式：大多数细菌利用现成的有机物生活（异养）\n- 生殖方式：**分裂生殖**，繁殖速度极快\n- 不良环境下形成**芽孢**（休眠体），不是生殖细胞",
        "keyPoints": ["列文虎克发现细菌，巴斯德证明细菌非自然发生", "细菌形态：球状、杆状、螺旋状", "细菌是原核生物，无成形细胞核", "细菌分裂生殖，可形成芽孢抵抗不良环境"],
        "images": [{"keyword": "细菌形态", "caption": "细菌三种基本形态示意图", "source": "Wikipedia"}, {"keyword": "巴斯德", "caption": "巴斯德鹅颈瓶实验", "source": "Wikipedia"}]
    },
    {
        "id": 520, "unitId": 451,
        "title": "人的生殖",
        "content": "## 一、生殖系统的组成\n\n### 男性生殖系统\n主要由**睾丸、附睾、输精管、阴茎**等组成。- **睾丸**：产生精子，分泌雄性激素\n\n### 女性生殖系统\n主要由**卵巢、输卵管、子宫、阴道**等组成。- **卵巢**：产生卵细胞，分泌雌性激素 - **输卵管**：受精的场所 - **子宫**：胚胎发育的场所\n\n## 二、生殖过程\n1. **受精**：精子与卵细胞在**输卵管**中结合形成受精卵\n2. **怀孕**：受精卵分裂形成胚胎，移动到**子宫**内着床\n3. **分娩**：胎儿从母体阴道产出\n\n## 三、青春期\n青春期是人生中身体发育和智力发展的黄金时期。显著特点：**身高突增**，性器官迅速发育，出现第二性征。",
        "keyPoints": ["睾丸产生精子和雄性激素", "卵巢产生卵细胞和雌性激素", "受精在输卵管，胚胎发育在子宫", "青春期显著特点：身高突增"],
        "images": [{"keyword": "人体生殖系统", "caption": "人体生殖系统结构图", "source": "Wikipedia"}]
    },
]

bio['lessons'].extend(new_lessons)

new_bio_questions = [
    {"id": 751, "lessonId": 517, "type": "choice", "difficulty": "medium", "stem": "呼吸作用的场所是？", "options": ["叶绿体", "线粒体", "细胞核", "细胞膜"], "answer": 1, "explanation": "呼吸作用在线粒体中进行。线粒体被称为细胞的动力工厂。"},
    {"id": 752, "lessonId": 517, "type": "judge", "difficulty": "medium", "stem": "植物只在夜晚进行呼吸作用。", "options": [], "answer": False, "explanation": "呼吸作用有光无光都能进行，植物全天24小时都在进行呼吸作用。"},
    {"id": 753, "lessonId": 517, "type": "choice", "difficulty": "hard", "stem": "关于光合作用和呼吸作用的叙述，正确的是？", "options": ["光合作用只在白天进行，呼吸作用只在夜晚进行", "光合作用储存能量，呼吸作用释放能量", "呼吸作用的原料与光合作用的产物完全相同", "只有动物进行呼吸作用"], "answer": 1, "explanation": "光合作用储存能量（光能变化学能），呼吸作用释放能量。两者相互对立又相互依存。"},
    {"id": 754, "lessonId": 518, "type": "choice", "difficulty": "easy", "stem": "泌尿系统形成尿液的主要器官是？", "options": ["肾脏", "输尿管", "膀胱", "尿道"], "answer": 0, "explanation": "肾脏是形成尿液的主要器官。输尿管输送尿液，膀胱储存尿液，尿道排出尿液。"},
    {"id": 755, "lessonId": 518, "type": "choice", "difficulty": "medium", "stem": "肾单位中，具有过滤作用的结构是？", "options": ["肾小管", "肾小球", "肾小囊", "集合管"], "answer": 1, "explanation": "血液流经肾小球时发生过滤作用，形成原尿。肾小管起重吸收作用。"},
    {"id": 756, "lessonId": 518, "type": "fill", "difficulty": "medium", "stem": "肾单位由____、____和____三部分组成。", "options": [], "answer": ["肾小球", "肾小囊", "肾小管"], "explanation": "肾单位是肾脏的结构和功能单位，由肾小球、肾小囊、肾小管三部分组成。"},
    {"id": 757, "lessonId": 519, "type": "choice", "difficulty": "easy", "stem": "被称为微生物学之父的科学家是？", "options": ["列文虎克", "巴斯德", "达尔文", "孟德尔"], "answer": 1, "explanation": "巴斯德通过鹅颈瓶实验证明细菌非自然发生，发明巴氏消毒法和狂犬病疫苗。"},
    {"id": 758, "lessonId": 519, "type": "fill", "difficulty": "medium", "stem": "细菌的生殖方式是____生殖。", "options": [], "answer": "分裂", "explanation": "细菌通过分裂生殖繁殖，速度极快。不良环境下形成芽孢（休眠体，非生殖细胞）。"},
    {"id": 759, "lessonId": 520, "type": "choice", "difficulty": "easy", "stem": "受精的场所是？", "options": ["卵巢", "子宫", "输卵管", "阴道"], "answer": 2, "explanation": "精子和卵细胞在输卵管中结合形成受精卵。胚胎在子宫内发育。"},
    {"id": 760, "lessonId": 520, "type": "fill", "difficulty": "easy", "stem": "男性产生精子的器官是____，女性产生卵细胞的器官是____。", "options": [], "answer": ["睾丸", "卵巢"], "explanation": "睾丸是男性主要生殖器官，卵巢是女性主要生殖器官。"},
    {"id": 761, "lessonId": 503, "type": "choice", "difficulty": "hard", "stem": "【读图题】在显微镜下观察洋葱表皮细胞时，要使视野从模糊变为清晰，应调节？", "options": ["粗准焦螺旋", "细准焦螺旋", "反光镜", "遮光器"], "answer": 1, "explanation": "细准焦螺旋用于微调焦距使物像清晰。粗准焦螺旋用于快速升降镜筒。", "image": "显微镜", "imageCaption": "显微镜结构图", "imageSource": "Wikipedia"},
    {"id": 762, "lessonId": 505, "type": "choice", "difficulty": "hard", "stem": "【读图题】验证绿叶在光下制造淀粉的实验，滴加碘液后叶片见光部分和遮光部分分别呈什么颜色？", "options": ["见光部分蓝色，遮光部分不变色", "见光部分不变色，遮光部分蓝色", "都变蓝色", "都不变色"], "answer": 0, "explanation": "见光部分进行光合作用产生淀粉，遇碘变蓝。遮光部分没有产生淀粉，遇碘不变色。", "image": "光合作用实验", "imageCaption": "绿叶在光下制造淀粉实验", "imageSource": "Wikipedia"},
    {"id": 763, "lessonId": 509, "type": "choice", "difficulty": "hard", "stem": "【读图题】观察消化系统图，胆汁是由哪个器官分泌的？", "options": ["胃", "胰腺", "肝脏", "胆囊"], "answer": 2, "explanation": "胆汁由肝脏分泌，储存在胆囊中。胆汁不含消化酶，但能乳化脂肪。", "image": "人体消化系统", "imageCaption": "人体消化系统图", "imageSource": "Wikipedia"},
    {"id": 764, "lessonId": 510, "type": "choice", "difficulty": "hard", "stem": "【读图题】观察心脏结构图，与主动脉相连的腔室是？", "options": ["左心房", "右心房", "左心室", "右心室"], "answer": 2, "explanation": "左心室与主动脉相连，将含氧多的动脉血泵至全身各处。", "image": "人体心脏结构", "imageCaption": "人体心脏结构图", "imageSource": "Wikipedia"},
    {"id": 765, "lessonId": 511, "type": "choice", "difficulty": "hard", "stem": "【读图题】观察反射弧结构图，传出神经受损时会出现什么情况？", "options": ["有感觉但不能运动", "无感觉但能运动", "既无感觉也不能运动", "感觉和运动都正常"], "answer": 0, "explanation": "反射弧五环节必须完整。传出神经受损后神经中枢指令无法传到效应器，不能运动，但传入神经到神经中枢的感觉通路正常。", "image": "反射弧", "imageCaption": "反射弧结构示意图", "imageSource": "Wikipedia"},
]

bio['questions'].extend(new_bio_questions)

with open('db-biology.json', 'w', encoding='utf-8') as f:
    json.dump(bio, f, ensure_ascii=False, indent=2)

print(f"Biology: {len(bio['lessons'])} lessons, {len(bio['questions'])} questions")

# ===== EXPAND GEOGRAPHY =====
with open('db-geography.json') as f:
    geo = json.load(f)

new_geo_questions = [
    {"id": 551, "lessonId": 304, "type": "choice", "difficulty": "hard", "stem": "【读图题】观察世界地图，完全位于北半球的大洲是？", "options": ["非洲和南美洲", "欧洲和北美洲", "亚洲和大洋洲", "南极洲和南美洲"], "answer": 1, "explanation": "欧洲和北美洲完全位于北半球。非洲、南美洲、大洋洲跨南北半球，南极洲在南半球。", "image": "世界地图", "imageCaption": "世界大洲分布图", "imageSource": "Wikipedia"},
    {"id": 552, "lessonId": 305, "type": "choice", "difficulty": "hard", "stem": "【读图题】根据板块构造图，喜马拉雅山脉是由哪两个板块碰撞形成的？", "options": ["亚欧板块与太平洋板块", "亚欧板块与印度洋板块", "非洲板块与亚欧板块", "印度洋板块与太平洋板块"], "answer": 1, "explanation": "喜马拉雅山脉由亚欧板块与印度洋板块碰撞挤压形成，至今仍在缓慢抬升。", "image": "板块构造", "imageCaption": "全球板块分布图", "imageSource": "Wikipedia"},
    {"id": 553, "lessonId": 306, "type": "choice", "difficulty": "hard", "stem": "【读图题】根据世界气候类型分布图，地中海气候分布在？", "options": ["赤道附近", "南北纬30-40度大陆西岸", "南北纬40-60度大陆西岸", "大陆内部"], "answer": 1, "explanation": "地中海气候分布在南北纬30-40度的大陆西岸，夏季炎热干燥，冬季温和多雨。", "image": "世界气候类型", "imageCaption": "世界气候类型分布图", "imageSource": "Wikipedia"},
    {"id": 554, "lessonId": 312, "type": "choice", "difficulty": "hard", "stem": "【读图题】观察中国地形图，位于第二、三级阶梯分界线上的山脉是？", "options": ["昆仑山脉", "太行山脉", "喜马拉雅山脉", "横断山脉"], "answer": 1, "explanation": "第二、三级阶梯分界线：大兴安岭-太行山-巫山-雪峰山。太行山脉位于此线上。", "image": "中国地形图", "imageCaption": "中国三级阶梯分界线", "imageSource": "Wikipedia"},
    {"id": 555, "lessonId": 314, "type": "choice", "difficulty": "hard", "stem": "【读图题】秦岭-淮河线南北两侧，下列哪项差异是正确的？", "options": ["北侧水田为主，南侧旱地为主", "北侧一年两熟，南侧两年三熟", "北侧河流有结冰期，南侧河流无结冰期", "北侧降水大于800mm，南侧降水小于800mm"], "answer": 2, "explanation": "秦岭-淮河以北1月均温低于0度，河流有结冰期；以南高于0度，无结冰期。其它选项南北正好相反。", "image": "秦岭淮河线", "imageCaption": "秦岭-淮河线南北差异", "imageSource": "Wikipedia"},
    {"id": 556, "lessonId": 305, "type": "fill", "difficulty": "medium", "stem": "全球六大板块中，几乎全部位于海洋的是____板块。", "options": [], "answer": "太平洋", "explanation": "太平洋板块几乎全部位于海洋中，这与它周围板块边界均为海沟有关。"},
    {"id": 557, "lessonId": 306, "type": "fill", "difficulty": "medium", "stem": "一天中，最高气温出现在____时左右，最低气温出现在____前后。", "options": [], "answer": ["午后2", "日出"], "explanation": "午后2时（14时）地面辐射最强气温最高；日出前后地面辐射最弱气温最低。"},
    {"id": 558, "lessonId": 310, "type": "fill", "difficulty": "medium", "stem": "印度半岛以____气候为主，全年高温，分____、____两季。", "options": [], "answer": ["热带季风", "旱", "雨"], "explanation": "印度以热带季风气候为主，6-9月为雨季（西南季风），10-次年5月为旱季（东北季风）。"},
    {"id": 559, "lessonId": 313, "type": "fill", "difficulty": "hard", "stem": "解决水资源季节分配不均的措施是____，解决水资源地区分布不均的措施是____。", "options": [], "answer": ["兴修水库", "跨流域调水"], "explanation": "兴修水库调节水资源的时间分配（蓄洪补枯），跨流域调水（如南水北调）调节水资源的空间分配。"},
    {"id": 560, "lessonId": 319, "type": "fill", "difficulty": "medium", "stem": "黄土高原水土流失的人为原因包括____、____和____。", "options": [], "answer": ["过度开垦", "过度放牧", "过度樵采"], "explanation": "人为原因破坏植被是加剧水土流失的主要因素。治理措施：植树种草、退耕还林还草。"},
]

geo['questions'].extend(new_geo_questions)

with open('db-geography.json', 'w', encoding='utf-8') as f:
    json.dump(geo, f, ensure_ascii=False, indent=2)

print(f"Geography: {len(geo['lessons'])} lessons, {len(geo['questions'])} questions")
print("All done!")
