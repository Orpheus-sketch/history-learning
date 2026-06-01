import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchQuestions } from '../../api';
import { saveQuizResult } from '../../utils/progress';
import { useAccount } from '../../context/AccountContext';
import { useSubject } from '../../context/SubjectContext';
import WikipediaImage from '../../components/WikipediaImage/WikipediaImage';
import styles from './QuizSession.module.css';

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
  if (Array.isArray(expected)) return expected.some((e) => normalize(e) === nUser);
  return nUser === normalize(expected);
}

function countKeywordMatches(userAnswer, keywords) {
  if (!keywords || keywords.length === 0) return { matched: [], missed: [] };
  const nUser = normalize(userAnswer);
  const matched = [];
  const missed = [];
  keywords.forEach((kw) => {
    if (nUser.includes(normalize(kw))) matched.push(kw);
    else missed.push(kw);
  });
  return { matched, missed };
}

export default function QuizSession() {
  const { activeAccount } = useAccount();
  const { subject } = useSubject();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selfAssessments, setSelfAssessments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load questions from API
  useEffect(() => {
    const gradeId = Number(searchParams.get('gradeId')) || undefined;
    const type = searchParams.get('type') || undefined;
    const count = Number(searchParams.get('count')) || 10;

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchQuestions({ gradeId, type }, subject)
      .then((all) => {
        if (cancelled) return;
        if (all.length === 0) {
          setError(`当前科目（${subject}）暂无题目，请返回重新选择。`);
          setLoading(false);
          return;
        }
        const shuffled = [...all].sort(() => Math.random() - 0.5);
        const selected = shuffled.slice(0, Math.min(count, shuffled.length));
        setQuestions(selected);
        setAnswers(selected.map((q) => (q.type === 'fill' || q.type === 'short' || q.type === 'material' ? '' : -1)));
        setSelfAssessments(new Array(selected.length).fill(null));
        setLoading(false);
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('QuizSession error:', err);
          setError('加载题目失败: ' + (err.message || '未知错误'));
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [searchParams, subject]);

  // Reset text value when navigating between questions
  useEffect(() => {
    if (questions.length > 0 && questions[currentIdx]) {
      const q = questions[currentIdx];
      if (q.type === 'fill' || q.type === 'short' || q.type === 'material') {
        setTextValue(answers[currentIdx] || '');
      }
    }
  }, [currentIdx]);

  // ALL hooks must be called before any conditional returns
  const q = questions[currentIdx] || null;
  const isTextType = q ? (q.type === 'fill' || q.type === 'short' || q.type === 'material') : false;
  const isMaterialType = q ? q.type === 'material' : false;
  const isAnswered = q ? (isTextType
    ? (typeof answers[currentIdx] === 'string' && answers[currentIdx].trim() !== '')
    : answers[currentIdx] !== -1) : false;
  const needsSelfAssess = q ? ((q.type === 'short' || q.type === 'material') && submitted && selfAssessments[currentIdx] === null) : false;

  const keywordResult = useMemo(() => {
    if (q && (q.type === 'short' || q.type === 'material') && submitted && q.keywords) {
      return countKeywordMatches(answers[currentIdx], q.keywords);
    }
    return null;
  }, [currentIdx, submitted, q?.keywords, answers]);

  // === RENDER: Loading ===
  if (loading) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.2rem', color: 'var(--primary)', marginBottom: '12px' }}>📥 正在加载题目...</p>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>科目: {subject}</p>
        </div>
      </div>
    );
  }

  // === RENDER: Error ===
  if (error) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--danger)', marginBottom: '20px' }}>⚠️ {error}</p>
          <button className={styles.exitBtn} onClick={() => navigate('/quiz')}>← 返回选题</button>
        </div>
      </div>
    );
  }

  // === RENDER: No questions ===
  if (questions.length === 0) {
    return (
      <div className={styles.page}>
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <p style={{ fontSize: '1.1rem', color: 'var(--text-muted)', marginBottom: '20px' }}>暂无题目，请选择其他范围</p>
          <button className={styles.exitBtn} onClick={() => navigate('/quiz')}>← 返回选题</button>
        </div>
      </div>
    );
  }

  if (!q) return null;

  // === Handlers ===
  const handleChoiceSelect = (optIdx) => {
    if (submitted) return;
    const next = [...answers];
    next[currentIdx] = optIdx;
    setAnswers(next);
  };

  const handleTextChange = (e) => setTextValue(e.target.value);

  const handleTextConfirm = () => {
    if (!textValue.trim()) return;
    const next = [...answers];
    next[currentIdx] = textValue.trim();
    setAnswers(next);
  };

  const handleSubmit = () => {
    if (isTextType && textValue.trim()) {
      const next = [...answers];
      next[currentIdx] = textValue.trim();
      setAnswers(next);
    }
    setSubmitted(true);
  };

  const handleSelfAssess = (passed) => {
    const next = [...selfAssessments];
    next[currentIdx] = passed;
    setSelfAssessments(next);
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSubmitted(false);
    }
  };

  const handleFinish = () => {
    let score = 0;
    answers.forEach((a, i) => {
      const qt = questions[i];
      if (qt.type === 'short' || qt.type === 'material') {
        if (qt.keywords && qt.keywords.length > 0) {
          const result = countKeywordMatches(a, qt.keywords);
          score += result.matched.length / qt.keywords.length;
        } else {
          if (selfAssessments[i] === true) score++;
        }
      } else if (qt.type === 'fill') {
        if (checkFillAnswer(a, qt.answer)) score++;
      } else {
        if (a === qt.answer) score++;
      }
    });
    score = Math.round(score);

    const wrongLessonIds = [];
    answers.forEach((a, i) => {
      const qt = questions[i];
      let isWrong = false;
      if (qt.type === 'short' || qt.type === 'material') {
        if (qt.keywords && qt.keywords.length > 0) {
          isWrong = countKeywordMatches(a, qt.keywords).matched.length < qt.keywords.length;
        } else {
          isWrong = selfAssessments[i] !== true;
        }
      } else if (qt.type === 'fill') {
        isWrong = !checkFillAnswer(a, qt.answer);
      } else {
        isWrong = a !== qt.answer;
      }
      if (isWrong) wrongLessonIds.push(qt.lessonId);
    });

    saveQuizResult(activeAccount?.id, { score, total: questions.length, gradeId: Number(searchParams.get('gradeId')) || 0, wrongLessonIds: [...new Set(wrongLessonIds)] }, subject);
    navigate(`/quiz/result?score=${score}&total=${questions.length}`, { state: { questions, answers, selfAssessments } });
  };

  const isCurrentCorrect = () => {
    if (q.type === 'short' || q.type === 'material') {
      if (keywordResult) return keywordResult.matched.length >= (q.keywords?.length || 0);
      return selfAssessments[currentIdx] === true;
    }
    if (q.type === 'fill') return checkFillAnswer(answers[currentIdx], q.answer);
    return answers[currentIdx] === q.answer;
  };

  const getFillAnswer = () => Array.isArray(q.answer) ? q.answer.join(' / ') : q.answer;

  const handleExit = () => {
    if (window.confirm('确定要退出练习吗？')) navigate('/quiz');
  };

  return (
    <div className={styles.page}>
      {/* Top bar */}
      <div className={styles.topBar}>
        <button className={styles.exitBtn} onClick={handleExit}>← 返回</button>
        <span className={styles.progress}>第 {currentIdx + 1} / {questions.length} 题</span>
        <span className={styles.type}>{TYPE_LABELS[q.type] || q.type}</span>
      </div>

      {/* Question image */}
      {q.image && (
        <div className={styles.questionImage}>
          <WikipediaImage keyword={q.image} caption={q.imageCaption || ''} source={q.imageSource || 'Wikipedia'} lang="zh" />
        </div>
      )}

      {/* Source material card */}
      {isMaterialType && q.sourceMaterial && (
        <div className={styles.sourceCard}>
          <div className={styles.sourceLabel}>📜 阅读下列史料，回答问题</div>
          <div className={styles.sourceText}>{q.sourceMaterial}</div>
          {q.sourceAttribution && <div className={styles.sourceAttr}>—— 摘自《{q.sourceAttribution}》</div>}
        </div>
      )}

      {/* Question stem */}
      <div className={styles.question}><p className={styles.stem}>{q.stem}</p></div>

      {/* Choice */}
      {q.type === 'choice' && q.options && (
        <div className={styles.options}>
          {q.options.map((opt, idx) => {
            let cls = styles.option;
            if (answers[currentIdx] === idx) cls += ` ${styles.selected}`;
            if (submitted && idx === q.answer) cls += ` ${styles.correct}`;
            if (submitted && answers[currentIdx] === idx && idx !== q.answer) cls += ` ${styles.wrong}`;
            return (
              <button key={idx} className={cls} onClick={() => handleChoiceSelect(idx)} disabled={submitted}>
                <span className={styles.optLetter}>{'ABCD'[idx]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Judge */}
      {q.type === 'judge' && (
        <div className={styles.options}>
          {[{ idx: true, label: '正确', icon: '✓' }, { idx: false, label: '错误', icon: '✗' }].map((opt) => {
            let cls = styles.option;
            if (answers[currentIdx] === opt.idx) cls += ` ${styles.selected}`;
            if (submitted && opt.idx === q.answer) cls += ` ${styles.correct}`;
            if (submitted && answers[currentIdx] === opt.idx && opt.idx !== q.answer) cls += ` ${styles.wrong}`;
            return (
              <button key={String(opt.idx)} className={cls} onClick={() => handleChoiceSelect(opt.idx)} disabled={submitted}>
                <span className={styles.optLetter}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fill */}
      {q.type === 'fill' && (
        <div className={styles.textArea}>
          {!submitted ? (
            <>
              <input className={styles.textInput} type="text" placeholder="请输入你的答案..." value={textValue} onChange={handleTextChange} autoFocus />
              {textValue.trim() && !answers[currentIdx] && <button className={styles.confirmTextBtn} onClick={handleTextConfirm}>确定输入</button>}
            </>
          ) : (
            <div className={styles.fillResult}>
              <div className={styles.answerRow}><span className={styles.answerLabel}>你的答案：</span><span className={isCurrentCorrect() ? styles.answerCorrect : styles.answerWrong}>{answers[currentIdx]}</span></div>
              {!isCurrentCorrect() && <div className={styles.answerRow}><span className={styles.answerLabel}>正确答案：</span><span className={styles.answerCorrect}>{getFillAnswer()}</span></div>}
            </div>
          )}
        </div>
      )}

      {/* Short / Material */}
      {(q.type === 'short' || q.type === 'material') && (
        <div className={styles.textArea}>
          {!submitted ? (
            <>
              <textarea className={styles.textareaInput} placeholder="请输入你的作答..." value={textValue} onChange={handleTextChange} rows={5} autoFocus />
              {textValue.trim() && !answers[currentIdx] && <button className={styles.confirmTextBtn} onClick={handleTextConfirm}>确定输入</button>}
            </>
          ) : (
            <div className={styles.shortResult}>
              <div className={styles.answerRow}><span className={styles.answerLabel}>你的作答：</span></div>
              <div className={styles.userAnswer}>{answers[currentIdx]}</div>
              <div className={styles.answerRow}><span className={styles.answerLabel}>参考答案：</span></div>
              <div className={styles.refAnswer}>{q.answer}</div>
              {keywordResult && q.keywords && q.keywords.length > 0 && (
                <div className={styles.keywordResult}>
                  <div className={styles.kwHeader}>📋 给分点匹配：</div>
                  <div className={styles.kwList}>
                    {q.keywords.map((kw, i) => {
                      const isHit = keywordResult.matched.includes(kw);
                      return <span key={i} className={`${styles.kwTag} ${isHit ? styles.kwHit : styles.kwMiss}`}>{isHit ? '✓' : '✗'} {kw}</span>;
                    })}
                  </div>
                  <div className={styles.kwScore}>得分：{keywordResult.matched.length} / {q.keywords.length}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {submitted && !needsSelfAssess && (
        <div className={`${styles.explanation} ${isCurrentCorrect() ? styles.expCorrect : styles.expWrong}`}>
          <p className={styles.expLabel}>{isCurrentCorrect() ? '✓ 回答正确' : '✗ 回答错误'}</p>
          <p>{q.explanation}</p>
          {q.sourceAttribution && <p className={styles.expSource}>📖 史料来源：{q.sourceAttribution}</p>}
        </div>
      )}

      {/* Self-assessment */}
      {needsSelfAssess && (
        <div className={styles.selfAssess}>
          <p className={styles.selfAssessLabel}>对比参考答案，你觉得自己答得怎么样？</p>
          {keywordResult && q.keywords && q.keywords.length > 0 && <p className={styles.selfAssessHint}>系统已根据给分点自动评分</p>}
          <div className={styles.selfAssessBtns}>
            <button className={styles.assessCorrectBtn} onClick={() => handleSelfAssess(true)}>✓ 我答对了</button>
            <button className={styles.assessWrongBtn} onClick={() => handleSelfAssess(false)}>还需要复习</button>
          </div>
        </div>
      )}

      {/* Post-assessment result */}
      {(q.type === 'short' || q.type === 'material') && submitted && selfAssessments[currentIdx] !== null && (
        <div className={`${styles.explanation} ${isCurrentCorrect() ? styles.expCorrect : styles.expWrong}`}>
          <p className={styles.expLabel}>{isCurrentCorrect() ? '✓ 已掌握' : '✗ 需要复习'}</p>
          <p>{q.explanation}</p>
          {q.sourceAttribution && <p className={styles.expSource}>📖 史料来源：{q.sourceAttribution}</p>}
        </div>
      )}

      {/* Actions */}
      <div className={styles.actions}>
        {!submitted ? (
          <button className={styles.submitBtn} onClick={handleSubmit} disabled={!isAnswered}>确认答案</button>
        ) : needsSelfAssess ? null : currentIdx < questions.length - 1 ? (
          <button className={styles.nextBtn} onClick={handleNext}>下一题</button>
        ) : (
          <button className={styles.finishBtn} onClick={handleFinish}>查看结果</button>
        )}
      </div>
    </div>
  );
}
