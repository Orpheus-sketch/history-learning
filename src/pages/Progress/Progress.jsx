import { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell,
} from 'recharts';
import { fetchGrades, fetchUnits, fetchLessons, fetchAllGrades } from '../../api';
import { getProgressStats } from '../../utils/progress';
import styles from './Progress.module.css';

const COLORS = ['#2563eb', '#16a34a', '#f59e0b', '#dc2626', '#8b5cf6', '#06b6d4'];

export default function Progress() {
  const [gradeStats, setGradeStats] = useState([]);
  const [quizHistory, setQuizHistory] = useState([]);
  const [learningPct, setLearningPct] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const grades = await fetchAllGrades();
      const stats = getProgressStats();

      const gradeData = [];
      let totalLessonsCount = 0;
      for (const g of grades.sort((a, b) => a.order - b.order)) {
        const units = await fetchUnits(g.id);
        let lessonCount = 0;
        let completedCount = 0;
        for (const u of units) {
          const lessons = await fetchLessons(u.id);
          lessonCount += lessons.length;
          completedCount += lessons.filter((l) =>
            stats.completedLessons.includes(l.id)
          ).length;
        }
        totalLessonsCount += lessonCount;
        gradeData.push({
          name: g.name.replace('册', ''),
          completed: completedCount,
          total: lessonCount,
          pct: lessonCount > 0 ? Math.round((completedCount / lessonCount) * 100) : 0,
        });
      }
      setGradeStats(gradeData);
      setLearningPct(
        totalLessonsCount > 0
          ? Math.round((stats.completedLessons.length / totalLessonsCount) * 100)
          : 0
      );

      const chartHistory = stats.quizHistory.slice(-10).map((h, i) => ({
        index: i + 1,
        score: Math.round((h.score / h.total) * 100),
        date: new Date(h.date).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' }),
      }));
      setQuizHistory(chartHistory);

      setLoading(false);
    };
    load();
  }, []);

  if (loading) return <p className={styles.loading}>加载中...</p>;

  return (
    <div className={styles.page}>
      <h1>学习进度</h1>
      <p className={styles.subtitle}>追踪你的学习轨迹，发现薄弱环节</p>

      <div className={styles.overviewCards}>
        <div className={styles.overviewCard}>
          <div className={styles.ovValue}>{learningPct}%</div>
          <div className={styles.ovLabel}>总体完成率</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.ovValue}>{quizHistory.length}</div>
          <div className={styles.ovLabel}>练习次数</div>
        </div>
        <div className={styles.overviewCard}>
          <div className={styles.ovValue}>
            {quizHistory.length > 0
              ? Math.round(quizHistory.reduce((s, q) => s + q.score, 0) / quizHistory.length)
              : 0}%
          </div>
          <div className={styles.ovLabel}>平均正确率</div>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2>各年级学习完成率</h2>
        <div className={styles.chartBox}>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={gradeStats}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="name" tick={{ fontSize: 13 }} stroke="#94a3b8" />
              <YAxis unit="%" tick={{ fontSize: 13 }} stroke="#94a3b8" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="pct" name="完成率" fill="#2563eb" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className={styles.chartSection}>
        <h2>练习正确率趋势</h2>
        {quizHistory.length > 0 ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={quizHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                <XAxis dataKey="date" tick={{ fontSize: 13 }} stroke="#94a3b8" />
                <YAxis unit="%" tick={{ fontSize: 13 }} stroke="#94a3b8" domain={[0, 100]} />
                <Tooltip formatter={(v) => `${v}%`} />
                <Line
                  type="monotone"
                  dataKey="score"
                  name="正确率"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className={styles.empty}>暂无练习数据，去完成一次练习吧！</p>
        )}
      </div>

      <div className={styles.chartSection}>
        <h2>年级学习分布</h2>
        {gradeStats.some((g) => g.completed > 0) ? (
          <div className={styles.chartBox}>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={gradeStats.filter((g) => g.completed > 0)}
                  dataKey="completed"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  label={({ name, completed }) => `${name} (${completed}课)`}
                >
                  {gradeStats
                    .filter((g) => g.completed > 0)
                    .map((_, idx) => (
                      <Cell key={idx} fill={COLORS[idx % COLORS.length]} />
                    ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <p className={styles.empty}>暂无学习记录，开始学习吧！</p>
        )}
      </div>
    </div>
  );
}
