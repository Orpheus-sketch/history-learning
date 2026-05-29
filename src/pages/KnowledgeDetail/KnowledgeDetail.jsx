import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import ReactMarkdown from 'react-markdown';
import { fetchLesson } from '../../api';
import { markLessonCompleted, isLessonCompleted } from '../../utils/progress';
import { useAccount } from '../../context/AccountContext';
import WikipediaImage from '../../components/WikipediaImage/WikipediaImage';
import styles from './KnowledgeDetail.module.css';

export default function KnowledgeDetail() {
  const { activeAccount } = useAccount();
  const { lessonId } = useParams();
  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    fetchLesson(lessonId).then((data) => {
      setLesson(data);
      setCompleted(isLessonCompleted(activeAccount?.id, data.id));
    });
  }, [lessonId]);

  const handleComplete = () => {
    markLessonCompleted(activeAccount?.id, Number(lessonId));
    setCompleted(true);
  };

  if (!lesson) {
    return <p className={styles.loading}>加载中...</p>;
  }

  return (
    <div className={styles.page}>
      <Link to="/knowledge" className={styles.back}>← 返回知识列表</Link>
      <h1 className={styles.title}>{lesson.title}</h1>

      {lesson.images && lesson.images.length > 0 && (
        <div className={styles.gallery}>
          {lesson.images.map((img, i) => (
            <WikipediaImage
              key={i}
              keyword={img.keyword}
              caption={img.caption}
              source={img.source}
              lang="zh"
            />
          ))}
        </div>
      )}

      <div className={styles.contentCard}>
        <div className={styles.markdown}>
          <ReactMarkdown>{lesson.content}</ReactMarkdown>
        </div>
      </div>

      {lesson.keyPoints && lesson.keyPoints.length > 0 && (
        <div className={styles.keyPointsCard}>
          <h3>🔑 关键要点</h3>
          <ul>
            {lesson.keyPoints.map((p, i) => (
              <li key={i}>{p}</li>
            ))}
          </ul>
        </div>
      )}

      {lesson.timelineEvents && lesson.timelineEvents.length > 0 && (
        <div className={styles.timelineCard}>
          <h3>⏳ 时间线</h3>
          <div className={styles.timeline}>
            {lesson.timelineEvents.map((e, i) => (
              <div key={i} className={styles.timelineItem}>
                <div className={styles.dot} />
                <span className={styles.year}>{e.year}</span>
                <span className={styles.event}>{e.event}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button
        className={`${styles.completeBtn} ${completed ? styles.done : ''}`}
        onClick={handleComplete}
        disabled={completed}
      >
        {completed ? '✓ 已完成学习' : '标记为已完成'}
      </button>
    </div>
  );
}
