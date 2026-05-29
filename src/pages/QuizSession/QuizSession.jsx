import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { fetchQuestions } from '../../api';
import { saveQuizResult } from '../../utils/progress';
import styles from './QuizSession.module.css';

const TYPE_LABELS = { choice: '选择题', judge: '判断题', fill: '填空题', short: '问答题' };

function normalize(str) {
  return str.trim().replace(/\s+/g, '');
}

export default function QuizSession() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [questions, setQuestions] = useState([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [selfAssessments, setSelfAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const gradeId = Number(searchParams.get('gradeId')) || undefined;
    const type = searchParams.get('type') || undefined;
    const count = Number(searchParams.get('count')) || 10;

    fetchQuestions({ gradeId, type })
      .then((all) => {
        const shuffled = all.sort(() => Math.random() - 0.5);
        return shuffled.slice(0, count);
      })
      .then((selected) => {
        setQuestions(selected);
        // Init answers: -1 for choice/judge, '' for fill/short
        setAnswers(selected.map((q) => (q.type === 'fill' || q.type === 'short' ? '' : -1)));
        setSelfAssessments(new Array(selected.length).fill(null));
        setLoading(false);
      });
  }, [searchParams]);

  // Reset text value when navigating between questions
  useEffect(() => {
    if (questions[currentIdx]) {
      const q = questions[currentIdx];
      if (q.type === 'fill' || q.type === 'short') {
        setTextValue(answers[currentIdx] || '');
      }
    }
  }, [currentIdx]);

  const q = questions[currentIdx];
  if (!q) {
    if (loading) return <p className={styles.loading}>加载题目中...</p>;
    return <p className={styles.loading}>暂无题目，请选择其他范围</p>;
  }

  const isTextType = q.type === 'fill' || q.type === 'short';

  const isAnswered = isTextType
    ? (typeof answers[currentIdx] === 'string' && answers[currentIdx].trim() !== '')
    : answers[currentIdx] !== -1;

  // For short-answer, after submit, check if self-assessed
  const needsSelfAssess = q.type === 'short' && submitted && selfAssessments[currentIdx] === null;

  const allAnswered = answers.every((a, i) => {
    const qt = questions[i]?.type;
    if (qt === 'fill' || qt === 'short') return typeof a === 'string' && a.trim() !== '';
    return a !== -1;
  });

  // For short-answer, also check that all are self-assessed
  const allAssessed = questions.every((qt, i) => {
    if (qt.type === 'short') return selfAssessments[i] !== null;
    return true;
  });

  const handleChoiceSelect = (optIdx) => {
    if (submitted) return;
    const next = [...answers];
    next[currentIdx] = optIdx;
    setAnswers(next);
  };

  const handleTextChange = (e) => {
    setTextValue(e.target.value);
  };

  const handleTextConfirm = () => {
    if (!textValue.trim()) return;
    const next = [...answers];
    next[currentIdx] = textValue.trim();
    setAnswers(next);
  };

  const handleSubmit = () => {
    if (isTextType) {
      // Save current text value to answers before submitting
      if (textValue.trim()) {
        const next = [...answers];
        next[currentIdx] = textValue.trim();
        setAnswers(next);
      }
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
      if (qt.type === 'short') {
        if (selfAssessments[i] === true) score++;
      } else if (qt.type === 'fill') {
        if (normalize(a) === normalize(qt.answer)) score++;
      } else {
        if (a === qt.answer) score++;
      }
    });

    const wrongLessonIds = [];
    answers.forEach((a, i) => {
      const qt = questions[i];
      let isWrong = false;
      if (qt.type === 'short') {
        isWrong = selfAssessments[i] !== true;
      } else if (qt.type === 'fill') {
        isWrong = normalize(a) !== normalize(qt.answer);
      } else {
        isWrong = a !== qt.answer;
      }
      if (isWrong) wrongLessonIds.push(qt.lessonId);
    });

    saveQuizResult({
      score,
      total: questions.length,
      gradeId: Number(searchParams.get('gradeId')) || 0,
      wrongLessonIds: [...new Set(wrongLessonIds)],
    });

    navigate(`/quiz/result?score=${score}&total=${questions.length}`, {
      state: { questions, answers, selfAssessments },
    });
  };

  const isCurrentCorrect = () => {
    if (q.type === 'short') return selfAssessments[currentIdx] === true;
    if (q.type === 'fill') return normalize(answers[currentIdx]) === normalize(q.answer);
    return answers[currentIdx] === q.answer;
  };

  return (
    <div className={styles.page}>
      <div className={styles.topBar}>
        <span className={styles.progress}>
          第 {currentIdx + 1} / {questions.length} 题
        </span>
        <span className={styles.type}>{TYPE_LABELS[q.type] || q.type}</span>
      </div>

      <div className={styles.question}>
        <p className={styles.stem}>{q.stem}</p>
      </div>

      {/* Choice options */}
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

      {/* Judge options */}
      {q.type === 'judge' && (
        <div className={styles.options}>
          {[
            { idx: 0, label: '正确', icon: '✓' },
            { idx: 1, label: '错误', icon: '✗' },
          ].map((opt) => {
            let cls = styles.option;
            if (answers[currentIdx] === opt.idx) cls += ` ${styles.selected}`;
            if (submitted && opt.idx === q.answer) cls += ` ${styles.correct}`;
            if (submitted && answers[currentIdx] === opt.idx && opt.idx !== q.answer) cls += ` ${styles.wrong}`;

            return (
              <button key={opt.idx} className={cls} onClick={() => handleChoiceSelect(opt.idx)} disabled={submitted}>
                <span className={styles.optLetter}>{opt.icon}</span>
                <span>{opt.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Fill in the blank */}
      {q.type === 'fill' && (
        <div className={styles.textArea}>
          {!submitted ? (
            <>
              <input
                className={styles.textInput}
                type="text"
                placeholder="请输入你的答案..."
                value={textValue}
                onChange={handleTextChange}
                autoFocus
              />
              {textValue.trim() && !answers[currentIdx] && (
                <button className={styles.confirmTextBtn} onClick={handleTextConfirm}>
                  确定输入
                </button>
              )}
            </>
          ) : (
            <div className={styles.fillResult}>
              <div className={styles.answerRow}>
                <span className={styles.answerLabel}>你的答案：</span>
                <span className={isCurrentCorrect() ? styles.answerCorrect : styles.answerWrong}>
                  {answers[currentIdx]}
                </span>
              </div>
              {!isCurrentCorrect() && (
                <div className={styles.answerRow}>
                  <span className={styles.answerLabel}>正确答案：</span>
                  <span className={styles.answerCorrect}>{q.answer}</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Short answer */}
      {q.type === 'short' && (
        <div className={styles.textArea}>
          {!submitted ? (
            <>
              <textarea
                className={styles.textareaInput}
                placeholder="请输入你的作答..."
                value={textValue}
                onChange={handleTextChange}
                rows={5}
                autoFocus
              />
              {textValue.trim() && !answers[currentIdx] && (
                <button className={styles.confirmTextBtn} onClick={handleTextConfirm}>
                  确定输入
                </button>
              )}
            </>
          ) : (
            <div className={styles.shortResult}>
              <div className={styles.answerRow}>
                <span className={styles.answerLabel}>你的作答：</span>
              </div>
              <div className={styles.userAnswer}>{answers[currentIdx]}</div>
              <div className={styles.answerRow}>
                <span className={styles.answerLabel}>参考答案：</span>
              </div>
              <div className={styles.refAnswer}>{q.answer}</div>
            </div>
          )}
        </div>
      )}

      {/* Explanation */}
      {submitted && !needsSelfAssess && (
        <div className={`${styles.explanation} ${isCurrentCorrect() ? styles.expCorrect : styles.expWrong}`}>
          <p className={styles.expLabel}>
            {isCurrentCorrect() ? '✓ 回答正确' : '✗ 回答错误'}
          </p>
          <p>{q.explanation}</p>
        </div>
      )}

      {/* Self-assessment for short answer */}
      {needsSelfAssess && (
        <div className={styles.selfAssess}>
          <p className={styles.selfAssessLabel}>对比参考答案，你觉得自己答得怎么样？</p>
          <div className={styles.selfAssessBtns}>
            <button className={styles.assessCorrectBtn} onClick={() => handleSelfAssess(true)}>
              ✓ 我答对了
            </button>
            <button className={styles.assessWrongBtn} onClick={() => handleSelfAssess(false)}>
              还需要复习
            </button>
          </div>
        </div>
      )}

      {/* Self-assessment result + explanation */}
      {q.type === 'short' && submitted && selfAssessments[currentIdx] !== null && (
        <div className={`${styles.explanation} ${isCurrentCorrect() ? styles.expCorrect : styles.expWrong}`}>
          <p className={styles.expLabel}>
            {isCurrentCorrect() ? '✓ 自评：已掌握' : '✗ 自评：需要复习'}
          </p>
          <p>{q.explanation}</p>
        </div>
      )}

      <div className={styles.actions}>
        {!submitted ? (
          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={!isAnswered}
          >
            确认答案
          </button>
        ) : needsSelfAssess ? null : currentIdx < questions.length - 1 ? (
          <button className={styles.nextBtn} onClick={handleNext}>
            下一题
          </button>
        ) : (
          <button
            className={styles.finishBtn}
            onClick={handleFinish}
            disabled={!allAssessed}
          >
            查看结果
          </button>
        )}
      </div>
    </div>
  );
}
