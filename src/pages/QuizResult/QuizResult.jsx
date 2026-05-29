import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import styles from './QuizResult.module.css';

const TYPE_LABELS = { choice: '选择题', judge: '判断题', fill: '填空题', short: '问答题' };

function normalize(str) {
  return (str || '').trim().replace(/\s+/g, '');
}

function isAnswerCorrect(q, answer, selfAssessments, idx) {
  if (q.type === 'short') return selfAssessments?.[idx] === true;
  if (q.type === 'fill') return normalize(answer) === normalize(q.answer);
  return answer === q.answer;
}

export default function QuizResult() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const score = Number(searchParams.get('score')) || 0;
  const total = Number(searchParams.get('total')) || 0;
  const { questions = [], answers = [], selfAssessments = [] } = location.state || {};

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGrade = (p) => {
    if (p >= 90) return { text: '优秀', cls: 'excellent' };
    if (p >= 70) return { text: '良好', cls: 'good' };
    if (p >= 60) return { text: '及格', cls: 'pass' };
    return { text: '继续努力', cls: 'fail' };
  };

  const grade = getGrade(pct);

  return (
    <div className={styles.page}>
      <div className={styles.resultCard}>
        <div className={styles.scoreCircle}>
          <span className={styles.scoreNum}>{score}</span>
          <span className={styles.scoreDivider}>/</span>
          <span className={styles.scoreTotal}>{total}</span>
        </div>
        <div className={`${styles.grade} ${styles[grade.cls]}`}>{grade.text}</div>
        <p className={styles.pct}>正确率 {pct}%</p>
      </div>

      {questions.length > 0 && (
        <div className={styles.review}>
          <h2>答题详情</h2>
          {questions.map((q, i) => {
            const correct = isAnswerCorrect(q, answers[i], selfAssessments, i);
            return (
              <div
                key={i}
                className={`${styles.reviewItem} ${correct ? styles.rCorrect : styles.rWrong}`}
              >
                <div className={styles.reviewHeader}>
                  <span className={styles.reviewIdx}>
                    第 {i + 1} 题 · {TYPE_LABELS[q.type] || q.type}
                  </span>
                  <span className={correct ? styles.tagCorrect : styles.tagWrong}>
                    {q.type === 'short'
                      ? (correct ? '✓ 已掌握' : '✗ 需复习')
                      : (correct ? '✓ 正确' : '✗ 错误')}
                  </span>
                </div>
                <p className={styles.reviewStem}>{q.stem}</p>

                {/* Show user answer for fill and short */}
                {q.type === 'fill' && (
                  <div className={styles.fillReview}>
                    <span className={styles.reviewLabel}>你的答案：</span>
                    <span className={correct ? styles.reviewCorrect : styles.reviewWrong}>
                      {answers[i]}
                    </span>
                    {!correct && (
                      <>
                        <span className={styles.reviewLabel}> 正确答案：</span>
                        <span className={styles.reviewCorrect}>{q.answer}</span>
                      </>
                    )}
                  </div>
                )}

                {q.type === 'short' && (
                  <div className={styles.shortReview}>
                    <p className={styles.reviewLabel}>你的作答：</p>
                    <div className={styles.userAnswerBox}>{answers[i]}</div>
                    <p className={styles.reviewLabel}>参考答案：</p>
                    <div className={styles.refAnswerBox}>{q.answer}</div>
                  </div>
                )}

                <p className={styles.reviewExp}>{q.explanation}</p>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.botActions}>
        <button className={styles.retryBtn} onClick={() => navigate('/quiz')}>
          再来一次
        </button>
        <button className={styles.backBtn} onClick={() => navigate('/')}>
          返回首页
        </button>
      </div>
    </div>
  );
}
