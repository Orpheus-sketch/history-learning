import { useEffect, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { fetchLessons, fetchUnits, fetchAllGrades } from '../../api';
import { useSubject } from '../../context/SubjectContext';
import styles from './TimelinePage.module.css';

function parseYear(str) {
  let s = str.trim();

  // Normalize Chinese numerals in approximations
  s = s.replace(/四五千年/g, '4500年前');
  s = s.replace(/四千多年/g, '4000年前');
  s = s.replace(/约|距今/g, '');

  // ---- Check contextual patterns BEFORE splitting on range ----

  // Prehistoric: 万年前 (e.g. "170万年前" → -1700000)
  let m = s.match(/(\d+(?:\.\d+)?)\s*万/);
  if (m) return { num: -parseFloat(m[1]) * 10000, era: 'bc' };

  // 千年前
  m = s.match(/(\d+(?:\.\d+)?)\s*千/);
  if (m) return { num: -parseFloat(m[1]) * 1000, era: 'bc' };

  // 年前 (years before present, e.g. "7000年前", "4000年前")
  m = s.match(/(\d+)\s*年前/);
  if (m) return { num: -parseInt(m[1]), era: 'bc' };

  // BC century (e.g. "前18世纪" → 18th c. BC ≈ -1750)
  m = s.match(/前\s*(\d+)\s*世纪/);
  if (m) return { num: -(parseInt(m[1]) * 100 - 50), era: 'bc' };

  // AD century (e.g. "2世纪", "15—16世纪", "19世纪70年代")
  m = s.match(/(\d+)\s*世纪/);
  if (m) return { num: parseInt(m[1]) * 100 - 50, era: 'ad' };

  // ---- Now split on range for remaining patterns ----
  s = s.split(/[—～~]/)[0];

  // BC year (e.g. "前221年", "前221")
  m = s.match(/前\s*(\d+)/);
  if (m) return { num: -parseInt(m[1]), era: 'bc' };

  // ---- Text-based era approximations ----
  if (s.includes('商朝后期')) return { num: -1200, era: 'bc' };
  if (s.includes('春秋时期')) return { num: -550, era: 'bc' };
  if (s.includes('战国时期')) return { num: -350, era: 'bc' };
  if (s.includes('盛唐时期')) return { num: 720, era: 'ad' };
  if (s.includes('北宋'))         return { num: 1050, era: 'ad' };
  if (s.includes('宋元时期'))     return { num: 1200, era: 'ad' };

  // ---- AD year (fallback: extract first number) ----
  m = s.match(/(\d+)/);
  if (m) return { num: parseInt(m[1]), era: 'ad' };

  return { num: 0, era: 'ad' };
}

function formatYearLabel(parsed, original) {
  const n = parsed.num;
  const abs = Math.abs(n);

  // Prehistoric: display in 万年前 format
  if (n <= -10000) {
    if (abs >= 10000) return `约${(abs / 10000).toFixed(abs % 10000 ? 1 : 0).replace(/\.0$/, '')}万年前`;
    return `约${abs}年前`;
  }

  // BC
  if (n < 0) return `公元前${abs}年`;

  // AD
  return `公元${abs}年`;
}

export default function TimelinePage() {
  const { subject } = useSubject();
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all'); // 'all' | 'china' | 'world'
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (subject !== 'history') return;
    const load = async () => {
      const [lessons, units, grades] = await Promise.all([
        fetchLessons(undefined, subject),
        fetchUnits(undefined, subject),
        fetchAllGrades(subject),
      ]);

      // Build unitId → gradeId map
      const unitGrade = {};
      units.forEach((u) => { unitGrade[u.id] = u.gradeId; });

      // Determine which grades are Chinese vs world history
      // grades 1-4 are Chinese, 5-6 are world
      const gradeRegion = {};
      grades.forEach((g) => {
        gradeRegion[g.id] = g.id <= 4 ? 'china' : 'world';
      });

      const all = [];
      lessons.forEach((lesson) => {
        if (lesson.timelineEvents) {
          const gid = unitGrade[lesson.unitId] || 0;
          const region = gradeRegion[gid] || 'china';
          lesson.timelineEvents.forEach((e) => {
            const parsed = parseYear(e.year);
            all.push({
              ...e,
              lessonId: lesson.id,
              lessonTitle: lesson.title,
              parsedYear: parsed.num,
              region,
              yearLabel: formatYearLabel(parsed, e.year),
            });
          });
        }
      });

      // Sort by parsed numeric year (ascending)
      all.sort((a, b) => a.parsedYear - b.parsedYear);
      setEvents(all);
      setLoading(false);
    };
    load();
  }, [subject]);

  // Timeline only available for history
  if (subject !== 'history') {
    return <Navigate to="/home" replace />;
  }

  const filteredEvents = filter === 'all'
    ? events
    : events.filter((e) => e.region === filter);

  // Group by BC/AD for visual separation
  const bcEvents = filteredEvents.filter((e) => e.parsedYear < 0);
  const adEvents = filteredEvents.filter((e) => e.parsedYear >= 0);

  if (loading) {
    return <p className={styles.loading}>加载中...</p>;
  }

  return (
    <div className={styles.page}>
      <h1>历史时间线</h1>
      <p className={styles.subtitle}>按时间顺序纵览历史事件，构建完整的历史脉络</p>

      <div className={styles.tabs}>
        {[
          { key: 'all', label: '全部历史' },
          { key: 'china', label: '中国历史' },
          { key: 'world', label: '世界历史' },
        ].map((t) => (
          <button
            key={t.key}
            className={`${styles.tab} ${filter === t.key ? styles.tabActive : ''}`}
            onClick={() => setFilter(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {filteredEvents.length === 0 && (
        <p className={styles.empty}>暂无时间线数据</p>
      )}

      {bcEvents.length > 0 && (
        <div className={styles.eraSection}>
          <div className={styles.eraHeader}>公元前</div>
          <div className={styles.timeline}>
            {bcEvents.map((e, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.dot} />
                <div className={styles.card}>
                  <span className={styles.year}>{e.yearLabel}</span>
                  <p className={styles.event}>{e.event}</p>
                  <Link to={`/knowledge/${e.lessonId}`} className={styles.link}>
                    查看详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {adEvents.length > 0 && (
        <div className={styles.eraSection}>
          <div className={styles.eraHeader}>公元后</div>
          <div className={styles.timeline}>
            {adEvents.map((e, i) => (
              <div key={i} className={styles.item}>
                <div className={styles.dot} />
                <div className={styles.card}>
                  <span className={styles.year}>{e.yearLabel}</span>
                  <p className={styles.event}>{e.event}</p>
                  <Link to={`/knowledge/${e.lessonId}`} className={styles.link}>
                    查看详情 →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
