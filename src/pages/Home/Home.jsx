import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchGrades, fetchUnits, fetchLessons } from '../../api';
import { getProgressStats } from '../../utils/progress';
import { useAccount } from '../../context/AccountContext';
import ProgressBar from '../../components/ProgressBar/ProgressBar';
import styles from './Home.module.css';

export default function Home() {
  const { activeAccount } = useAccount();
  const [grades, setGrades] = useState([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);
  const [quizCount, setQuizCount] = useState(0);
  const [recentQuiz, setRecentQuiz] = useState(null);

  useEffect(() => {
    const load = async () => {
      const gradesData = await fetchGrades();
      setGrades(gradesData.sort((a, b) => a.order - b.order));

      let total = 0;
      for (const g of gradesData) {
        const units = await fetchUnits(g.id);
        for (const u of units) {
          const lessons = await fetchLessons(u.id);
          total += lessons.length;
        }
      }
      setTotalLessons(total);

      const stats = getProgressStats(activeAccount?.id);
      setCompletedCount(stats.completedLessons.length);
      setQuizCount(stats.quizHistory.length);
      if (stats.quizHistory.length > 0) {
        setRecentQuiz(stats.quizHistory[stats.quizHistory.length - 1]);
      }
    };
    load();
  }, []);

  const completionPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className={styles.home}>
      <h1 className={styles.greeting}>欢迎来到历史学习平台</h1>
      <p className={styles.subtitle}>系统学习初中历史，掌握每一个重要知识点</p>

      <div className={styles.statsRow}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📚</div>
          <div className={styles.statValue}>{totalLessons}</div>
          <div className={styles.statLabel}>知识点总数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{completedCount}</div>
          <div className={styles.statLabel}>已学习</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>📝</div>
          <div className={styles.statValue}>{quizCount}</div>
          <div className={styles.statLabel}>练习次数</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎯</div>
          <div className={styles.statValue}>
            {recentQuiz ? `${recentQuiz.score}/${recentQuiz.total}` : '-'}
          </div>
          <div className={styles.statLabel}>最近练习得分</div>
        </div>
      </div>

      <div className={styles.section}>
        <ProgressBar value={completedCount} max={totalLessons} label="总体学习进度" />
      </div>

      <div className={styles.section}>
        <h2>课程目录</h2>
        <div className={styles.gradeGrid}>
          {grades.map((g) => (
            <Link key={g.id} to={`/knowledge?gradeId=${g.id}`} className={styles.gradeCard}>
              <div className={styles.gradeHeader}>
                <span className={styles.gradeIcon}>📖</span>
                <h3>{g.name}</h3>
              </div>
              <p className={styles.period}>{g.period}</p>
            </Link>
          ))}
        </div>
      </div>

      <div className={styles.quickLinks}>
        <Link to="/knowledge" className={styles.quickLink}>
          <span>📚</span> 开始学习
        </Link>
        <Link to="/quiz" className={styles.quickLink}>
          <span>✏️</span> 去练习
        </Link>
        <Link to="/timeline" className={styles.quickLink}>
          <span>⏳</span> 查看时间线
        </Link>
      </div>
    </div>
  );
}
