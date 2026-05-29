import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { fetchGrades, fetchUnits } from '../../api';
import styles from './Sidebar.module.css';

export default function Sidebar() {
  const [grades, setGrades] = useState([]);
  const [expandedGrade, setExpandedGrade] = useState(null);
  const [unitsMap, setUnitsMap] = useState({});
  const location = useLocation();

  useEffect(() => {
    fetchGrades().then((data) => setGrades(data.sort((a, b) => a.order - b.order)));
  }, []);

  const toggleGrade = async (gradeId) => {
    if (expandedGrade === gradeId) {
      setExpandedGrade(null);
      return;
    }
    setExpandedGrade(gradeId);
    if (!unitsMap[gradeId]) {
      const units = await fetchUnits(gradeId);
      setUnitsMap((prev) => ({ ...prev, [gradeId]: units.sort((a, b) => a.order - b.order) }));
    }
  };

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sectionTitle}>课程目录</div>
      {grades.map((grade) => (
        <div key={grade.id} className={styles.gradeGroup}>
          <button
            className={`${styles.gradeBtn} ${expandedGrade === grade.id ? styles.expanded : ''}`}
            onClick={() => toggleGrade(grade.id)}
          >
            <span className={styles.gradeName}>{grade.name}</span>
            <span className={styles.arrow}>{expandedGrade === grade.id ? '▾' : '▸'}</span>
          </button>
          <div className={`${styles.periodTag}`}>{grade.period}</div>
          {expandedGrade === grade.id && unitsMap[grade.id] && (
            <div className={styles.unitsList}>
              {unitsMap[grade.id].map((unit) => (
                <NavLink
                  key={unit.id}
                  to={`/knowledge?unitId=${unit.id}`}
                  className={({ isActive }) =>
                    `${styles.unitLink} ${isActive ? styles.unitActive : ''}`
                  }
                >
                  {unit.name}
                </NavLink>
              ))}
            </div>
          )}
        </div>
      ))}
    </aside>
  );
}
