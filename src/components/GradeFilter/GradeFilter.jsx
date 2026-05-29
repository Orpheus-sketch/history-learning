import { useEffect, useState } from 'react';
import { fetchGrades } from '../../api';
import styles from './GradeFilter.module.css';

export default function GradeFilter({ value, onChange }) {
  const [grades, setGrades] = useState([]);
  useEffect(() => { fetchGrades().then(setGrades); }, []);

  return (
    <div className={styles.filter}>
      {[{ id: 0, name: '全部年级' }, ...grades].map((g) => (
        <button
          key={g.id}
          className={`${styles.btn} ${value === g.id ? styles.active : ''}`}
          onClick={() => onChange(g.id)}
        >
          {g.name}
        </button>
      ))}
    </div>
  );
}
