import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './Welcome.module.css';

const quotes = [
  { text: '以史为鉴，可以知兴替。', author: '唐太宗 李世民' },
  { text: '读史使人明智。', author: '弗朗西斯·培根' },
  { text: '历史是一面镜子，它照亮现实，也照亮未来。', author: '赵鑫珊' },
  { text: '忘记历史就意味着背叛。', author: '列宁' },
  { text: '前事不忘，后事之师。', author: '《战国策》' },
  { text: '历史是生活的教师。', author: '克罗齐' },
  { text: '一切历史都是当代史。', author: '贝内德托·克罗齐' },
  { text: '欲知大道，必先为史。', author: '龚自珍' },
  { text: '历史不是记忆的负担，而是心灵的启迪。', author: '歌德' },
  { text: '人类从历史中学到的唯一教训，就是人类无法从历史中学到任何教训。', author: '黑格尔' },
  { text: '历史孕育了真理，它能和时间抗衡，把遗闻旧事保藏下来。', author: '塞万提斯' },
  { text: '我们之所以回望过去，是为了更好地走向未来。', author: '丘吉尔' },
  { text: '不尊重历史的人，注定要重蹈覆辙。', author: '乔治·桑塔亚那' },
  { text: '历史是最好的教科书，也是最好的清醒剂。', author: '习近平' },
  { text: '历史是说过和做过事情的记忆。', author: '卡尔·贝克' },
  { text: '我们从历史中走来，也终将成为历史。', author: '佚名' },
  { text: '史者，所以明夫治天下之道也。', author: '曾巩' },
  { text: '鉴往知来，砺行致远。', author: '中国古训' },
  { text: '究天人之际，通古今之变，成一家之言。', author: '司马迁' },
  { text: '历史是时间的见证，真理的光辉。', author: '西塞罗' },
  { text: '观今宜鉴古，无古不成今。', author: '《增广贤文》' },
  { text: '历史是一出没有结局的戏，每一个结局都是新戏的开始。', author: '彼得·海尔' },
  { text: '不读史，则不知前人创业之艰难，后世守成之不易。', author: '曾国藩' },
  { text: '历史是民族的记忆，文化是民族的灵魂。', author: '钱穆' },
];

export default function Welcome() {
  const navigate = useNavigate();
  const [quote, setQuote] = useState(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Pick a quote based on today's date (changes daily)
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const idx = dayOfYear % quotes.length;
    setQuote(quotes[idx]);

    // Entrance animation
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleEnter = () => {
    setVisible(false);
    setTimeout(() => navigate('/home'), 600);
  };

  if (!quote) return null;

  return (
    <div className={`${styles.welcome} ${visible ? styles.visible : ''}`}>
      {/* Decorative marigold petals */}
      <div className={styles.petals}>
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={styles.petal}
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 8}s`,
              transform: `rotate(${Math.random() * 360}deg) scale(${0.4 + Math.random() * 0.8})`,
              opacity: 0.15 + Math.random() * 0.25,
            }}
          />
        ))}
      </div>

      <div className={styles.content}>
        <div className={styles.emblem}>
          <div className={styles.emblemInner}>
            <span className={styles.emblemChar}>史</span>
          </div>
        </div>

        <h1 className={styles.title}>历史学习</h1>
        <p className={styles.subtitle}>穿越时空，与文明对话</p>

        <div className={styles.quoteCard}>
          <span className={styles.quoteMark}>"</span>
          <p className={styles.quoteText}>{quote.text}</p>
          <p className={styles.quoteAuthor}>—— {quote.author}</p>
        </div>

        <button className={styles.enterBtn} onClick={handleEnter}>
          <span className={styles.btnText}>进入学习</span>
          <span className={styles.btnArrow}>→</span>
        </button>
      </div>

      <div className={styles.footer}>
        <p>初中历史学科学习平台 · 部编版（统编版）</p>
      </div>
    </div>
  );
}
