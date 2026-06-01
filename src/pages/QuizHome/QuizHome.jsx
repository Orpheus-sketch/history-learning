import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchGrades } from '../../api';
import { useSubject } from '../../context/SubjectContext';
import styles from './QuizHome.module.css';

export default function QuizHome() {
  const navigate = useNavigate();
  const { subject } = useSubject();
  const [gradeId, setGradeId] = useState(0);
  const [questionType, setQuestionType] = useState('all');
  const [count, setCount] = useState(10);
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    fetchGrades(subject).then((d) => setGrades(d.sort((a, b) => a.order - b.order))).catch(() => {});
  }, [subject]);

  const handleStart = () => {
    const params = new URLSearchParams();
    if (gradeId) params.set('gradeId', gradeId);
    if (questionType !== 'all') params.set('type', questionType);
    params.set('count', count);
    navigate(`/quiz/session?${params.toString()}`);
  };

  return (
    <div className={styles.page}>
      <h1>习题练习</h1>
      <p className={styles.subtitle}>选择练习范围，检验你的学习成果</p>

      <div className={styles.config}>
        <div className={styles.field}>
          <label className={styles.label}>选择年级</label>
          <div className={styles.filter}>
            {[{ id: 0, name: '全部年级' }, ...grades].map((g) => (
              <button
                key={g.id}
                className={`${styles.optBtn} ${gradeId === g.id ? styles.optActive : ''}`}
                onClick={() => setGradeId(g.id)}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>题型</label>
          <div className={styles.options}>
            {[
              { value: 'all', label: '全部' },
              { value: 'choice', label: '选择题' },
              { value: 'judge', label: '判断题' },
              { value: 'fill', label: '填空题' },
              { value: 'short', label: '问答题' },
            ].map((t) => (
              <button
                key={t.value}
                className={`${styles.optBtn} ${questionType === t.value ? styles.optActive : ''}`}
                onClick={() => setQuestionType(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>题目数量</label>
          <div className={styles.options}>
            {[5, 10, 15, 20].map((n) => (
              <button
                key={n}
                className={`${styles.optBtn} ${count === n ? styles.optActive : ''}`}
                onClick={() => setCount(n)}
              >
                {n} 题
              </button>
            ))}
          </div>
        </div>

        <button className={styles.startBtn} onClick={handleStart}>
          开始练习
        </button>
      </div>
    </div>
  );
}
