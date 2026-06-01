import { useSearchParams, useLocation, useNavigate } from 'react-router-dom';
import { useAccount } from '../../context/AccountContext';
import styles from './QuizResult.module.css';

const TYPE_LABELS = { choice: '选择题', judge: '判断题', fill: '填空题', short: '问答题', material: '史料分析题' };

function normalize(str) {
  if (!str) return '';
  let s = str.trim().replace(/\s+/g, '');
  s = s.replace(/[，。、；：！？《》（）【】「」『』""'',\.;:!?\(\)\[\]{}""'']/g, '');
  s = s.replace(/[０-９]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  s = s.replace(/[Ａ-Ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  s = s.replace(/[ａ-ｚ]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xFEE0));
  return s.toLowerCase();
}

function checkFillAnswer(userAnswer, expected) {
  const nUser = normalize(userAnswer);
  if (Array.isArray(expected)) {
    return expected.some((e) => normalize(e) === nUser);
  }
  return nUser === normalize(expected);
}

function countKeywordMatches(userAnswer, keywords) {
  if (!keywords || keywords.length === 0) return { matched: [], missed: [] };
  const nUser = normalize(userAnswer);
  const matched = [];
  const missed = [];
  keywords.forEach((kw) => {
    if (nUser.includes(normalize(kw))) {
      matched.push(kw);
    } else {
      missed.push(kw);
    }
  });
  return { matched, missed };
}

function isAnswerCorrect(q, answer, selfAssessments, idx) {
  if (q.type === 'short' || q.type === 'material') {
    if (q.keywords && q.keywords.length > 0) {
      const result = countKeywordMatches(answer, q.keywords);
      return result.matched.length >= q.keywords.length;
    }
    return selfAssessments?.[idx] === true;
  }
  if (q.type === 'fill') return checkFillAnswer(answer, q.answer);
  if (q.type === 'judge') return answer === q.answer; // boolean comparison
  return answer === q.answer;
}

export default function QuizResult() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { activeAccount } = useAccount();

  const score = Number(searchParams.get('score')) || 0;
  const total = Number(searchParams.get('total')) || 0;
  const { questions = [], answers = [], selfAssessments = [], keywordResults = [] } = location.state || {};

  const pct = total > 0 ? Math.round((score / total) * 100) : 0;

  const getGrade = (p) => {
    if (p >= 90) return { text: '优秀', cls: 'excellent' };
    if (p >= 70) return { text: '良好', cls: 'good' };
    if (p >= 60) return { text: '及格', cls: 'pass' };
    return { text: '继续努力', cls: 'fail' };
  };

  const grade = getGrade(pct);

  const getFillAnswer = (q) => {
    if (Array.isArray(q.answer)) return q.answer.join(' / ');
    return q.answer;
  };

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
            const correct = isAnswerCorrect(q, answers[i], selfAssessments, i, keywordResults);
            const kwResult = keywordResults[i] || (q.type === 'short' || q.type === 'material' ? countKeywordMatches(answers[i], q.keywords) : null);

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
                    {q.type === 'short' || q.type === 'material'
                      ? (correct ? '✓ 已掌握' : '✗ 需复习')
                      : (correct ? '✓ 正确' : '✗ 错误')}
                  </span>
                </div>

                {/* Source material display */}
                {q.type === 'material' && q.sourceMaterial && (
                  <div className={styles.sourceCard}>
                    <div className={styles.sourceLabel}>📜 史料原文</div>
                    <div className={styles.sourceText}>{q.sourceMaterial}</div>
                    {q.sourceAttribution && (
                      <div className={styles.sourceAttr}>—— 摘自《{q.sourceAttribution}》</div>
                    )}
                  </div>
                )}

                <p className={styles.reviewStem}>{q.stem}</p>

                {/* Question image */}
                {q.image && (
                  <div className={styles.reviewImage}>
                    <span className={styles.reviewLabel}>📷 题目配图：{q.imageCaption || q.image}</span>
                  </div>
                )}

                {/* Fill answer review */}
                {q.type === 'fill' && (
                  <div className={styles.fillReview}>
                    <span className={styles.reviewLabel}>你的答案：</span>
                    <span className={correct ? styles.reviewCorrect : styles.reviewWrong}>
                      {answers[i]}
                    </span>
                    {!correct && (
                      <>
                        <span className={styles.reviewLabel}> 正确答案：</span>
                        <span className={styles.reviewCorrect}>{getFillAnswer(q)}</span>
                      </>
                    )}
                  </div>
                )}

                {/* Short / Material answer review */}
                {(q.type === 'short' || q.type === 'material') && (
                  <div className={styles.shortReview}>
                    <p className={styles.reviewLabel}>你的作答：</p>
                    <div className={styles.userAnswerBox}>{answers[i]}</div>
                    <p className={styles.reviewLabel}>参考答案：</p>
                    <div className={styles.refAnswerBox}>{q.answer}</div>

                    {/* Keyword match display */}
                    {kwResult && q.keywords && q.keywords.length > 0 && (
                      <div className={styles.kwResult}>
                        <div className={styles.kwHeader}>📋 给分点：</div>
                        <div className={styles.kwTags}>
                          {q.keywords.map((kw, j) => {
                            const hit = kwResult.matched.includes(kw);
                            return (
                              <span key={j} className={`${styles.kwTag} ${hit ? styles.kwHit : styles.kwMiss}`}>
                                {hit ? '✓' : '✗'} {kw}
                              </span>
                            );
                          })}
                        </div>
                        <div className={styles.kwScoreText}>
                          得分：{kwResult.matched.length} / {q.keywords.length}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                <p className={styles.reviewExp}>{q.explanation}</p>
                {q.sourceAttribution && (
                  <p className={styles.reviewSource}>📖 史料来源：{q.sourceAttribution}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.botActions}>
        <button className={styles.retryBtn} onClick={() => navigate('/quiz')}>
          再来一次
        </button>
        <button className={styles.backBtn} onClick={() => navigate(activeAccount ? '/home' : '/')}>
          返回首页
        </button>
      </div>
    </div>
  );
}
