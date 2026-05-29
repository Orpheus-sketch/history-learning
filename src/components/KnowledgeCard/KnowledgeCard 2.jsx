import { Link } from 'react-router-dom';
import styles from './KnowledgeCard.module.css';

export default function KnowledgeCard({ lesson, completed }) {
  return (
    <Link to={`/knowledge/${lesson.id}`} className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{lesson.title}</h3>
        {completed && <span className={styles.badge}>✓ 已学习</span>}
      </div>
      {lesson.keyPoints && (
        <ul className={styles.points}>
          {lesson.keyPoints.slice(0, 2).map((p, i) => (
            <li key={i} className={styles.point}>{p}</li>
          ))}
        </ul>
      )}
    </Link>
  );
}
