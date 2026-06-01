import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchGrades, fetchUnits, fetchLessons } from '../../api';
import { getCompletedLessons } from '../../utils/progress';
import { useAccount } from '../../context/AccountContext';
import { useSubject } from '../../context/SubjectContext';
import KnowledgeCard from '../../components/KnowledgeCard/KnowledgeCard';
import GradeFilter from '../../components/GradeFilter/GradeFilter';
import { preloadImages } from '../../components/WikipediaImage/WikipediaImage';
import styles from './KnowledgeList.module.css';

export default function KnowledgeList() {
  const { activeAccount } = useAccount();
  const { subject, currentSubject } = useSubject();
  const [searchParams, setSearchParams] = useSearchParams();
  const [grades, setGrades] = useState([]);
  const [units, setUnits] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const gradeId = Number(searchParams.get('gradeId')) || 0;
  const unitId = Number(searchParams.get('unitId')) || 0;

  useEffect(() => {
    fetchGrades(subject).then((d) => setGrades(d.sort((a, b) => a.order - b.order)));
  }, [subject]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      let unitsData;
      if (unitId) {
        unitsData = await fetchUnits(unitId, subject);
      } else if (gradeId) {
        unitsData = await fetchUnits(gradeId, subject);
      } else {
        unitsData = await fetchUnits(undefined, subject);
      }
      unitsData.sort((a, b) => a.order - b.order);
      setUnits(unitsData);

      const lessonPromises = unitsData.map((u) => fetchLessons(u.id, subject));
      const lessonsResults = await Promise.all(lessonPromises);
      const allLessons = lessonsResults.flat();
      setLessons(allLessons);
      // Preload images for all visible lessons
      allLessons.forEach((l) => {
        if (l.images) preloadImages(l.images);
      });
      setLoading(false);
    };
    load();
  }, [gradeId, unitId, subject]);

  const completedLessons = getCompletedLessons(activeAccount?.id, subject);

  return (
    <div className={styles.page}>
      <h1>知识学习</h1>
      <p className={styles.subtitle}>按课程目录浏览知识点，系统学习{currentSubject.name}内容</p>

      <div className={styles.filterRow}>
        <GradeFilter
          value={gradeId}
          onChange={(id) => {
            const params = new URLSearchParams();
            if (id) params.set('gradeId', id);
            setSearchParams(params);
          }}
        />
        {units.length > 0 && (
          <div className={styles.unitFilter}>
            <button
              className={`${styles.unitBtn} ${!unitId ? styles.unitActive : ''}`}
              onClick={() => setSearchParams(gradeId ? { gradeId } : {})}
            >
              全部单元
            </button>
            {units.map((u) => (
              <button
                key={u.id}
                className={`${styles.unitBtn} ${unitId === u.id ? styles.unitActive : ''}`}
                onClick={() => setSearchParams({ unitId: u.id })}
              >
                {u.name}
              </button>
            ))}
          </div>
        )}
      </div>

      {loading ? (
        <p className={styles.loading}>加载中...</p>
      ) : (
        <div className={styles.grid}>
          {lessons.map((lesson) => (
            <KnowledgeCard
              key={lesson.id}
              lesson={lesson}
              completed={completedLessons.includes(lesson.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
