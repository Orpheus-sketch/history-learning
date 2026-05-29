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
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    const idx = dayOfYear % quotes.length;
    setQuote(quotes[idx]);
    setTimeout(() => setVisible(true), 200);
  }, []);

  const handleEnter = () => {
    setVisible(false);
    setTimeout(() => navigate('/home'), 600);
  };

  if (!quote) return null;

  return (
    <div className={`${styles.welcome} ${visible ? styles.visible : ''}`}>
      {/* Wave layers at bottom */}
      <div className={styles.waves}>
        <div className={styles.wave1} />
        <div className={styles.wave2} />
        <div className={styles.wave3} />
        <div className={styles.wave4} />
      </div>

      {/* Floating clouds */}
      <div className={styles.clouds}>
        {[...Array(8)].map((_, i) => (
          <div key={i} className={styles.cloud} style={{
            top: `${3 + i * 12}%`,
            left: `${-10 + i * 16}%`,
            animationDelay: `${i * 2.5}s`,
            animationDuration: `${20 + i * 3}s`,
            opacity: 0.3 + (i % 3) * 0.15,
            transform: `scale(${0.6 + (i % 3) * 0.4})`,
          }} />
        ))}
      </div>

      {/* Seagulls */}
      <div className={styles.seagulls}>
        {[...Array(5)].map((_, i) => (
          <div key={i} className={styles.seagull} style={{
            top: `${10 + i * 15}%`,
            left: `${-5 + i * 25}%`,
            animationDelay: `${i * 1.8}s`,
            animationDuration: `${10 + i * 2}s`,
          }} />
        ))}
      </div>

      {/* Rain lines for atmosphere */}
      <div className={styles.rain}>
        {[...Array(30)].map((_, i) => (
          <div key={i} className={styles.drop} style={{
            left: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${1.5 + Math.random() * 2}s`,
            opacity: 0.04 + Math.random() * 0.06,
          }} />
        ))}
      </div>

      <div className={styles.content}>
        {/* Seal script emblem */}
        <div className={styles.emblem}>
          <div className={styles.emblemRing}>
            <svg viewBox="0 0 120 120" className={styles.sealSvg}>
              {/* Outer circle */}
              <circle cx="60" cy="60" r="55" fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.4" />
              <circle cx="60" cy="60" r="50" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.25" />
              {/* Inner decorative ring */}
              <circle cx="60" cy="60" r="42" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2"
                strokeDasharray="3 3" />

              {/* Small seal script 史 character */}
              <g transform="translate(60,60)" fill="none" stroke="currentColor" strokeWidth="2.8"
                strokeLinecap="round" strokeLinejoin="round">
                {/* Top: 中-like shape */}
                <rect x="-8" y="-32" width="16" height="18" rx="2" opacity="0.9" />
                <line x1="0" y1="-32" x2="0" y2="-48" opacity="0.9" />
                <line x1="0" y1="-48" x2="-6" y2="-54" opacity="0.75" />
                <line x1="0" y1="-48" x2="6" y2="-54" opacity="0.75" />

                {/* Middle: horizontal separator */}
                <path d="M-20,-10 Q0,-7 20,-10" opacity="0.5" />

                {/* Bottom: 又-like shape (hand) */}
                <path d="M-12,-6 Q-20,8 -10,18 Q-5,22 0,24" opacity="0.9" />
                <path d="M12,-6 Q20,8 10,18 Q5,22 0,24" opacity="0.9" />
                <line x1="0" y1="-14" x2="0" y2="-4" opacity="0.7" />

                {/* Bottom stroke */}
                <path d="M-8,16 Q0,22 8,16" opacity="0.5" />
              </g>

              {/* Small dots around the ring */}
              <circle cx="60" cy="12" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="60" cy="108" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="12" cy="60" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="108" cy="60" r="1.5" fill="currentColor" opacity="0.3" />
            </svg>
          </div>
        </div>

        <h1 className={styles.title}>歷史學習</h1>
        <p className={styles.subtitle}>穿越時空 · 與文明對話</p>

        <div className={styles.quoteCard}>
          <span className={styles.quoteMark}>「</span>
          <p className={styles.quoteText}>{quote.text}</p>
          <p className={styles.quoteAuthor}>—— {quote.author}</p>
        </div>

        <button className={styles.enterBtn} onClick={handleEnter}>
          <span className={styles.btnText}>進 入 學 習</span>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={styles.btnArrow}>
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>

        <p className={styles.hint}>點擊進入，開啓歷史探索之旅</p>
      </div>

      <div className={styles.footer}>
        <p>初中歷史學科學習平台 · 部編版（統編版）</p>
      </div>
    </div>
  );
}
