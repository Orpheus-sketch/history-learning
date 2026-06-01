import { useEffect, useState } from 'react';
import { fetchGrades, fetchUnits, fetchLessons } from '../../api';
import { preloadImages } from '../../components/WikipediaImage/WikipediaImage';
import WikipediaImage from '../../components/WikipediaImage/WikipediaImage';
import styles from './MapAtlas.module.css';

export default function MapAtlas() {
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      const grades = await fetchGrades('geography');
      const data = [];

      for (const g of grades.sort((a, b) => a.order - b.order)) {
        const units = await fetchUnits(g.id, 'geography');
        for (const u of units.sort((a, b) => a.order - b.order)) {
          const lessons = await fetchLessons(u.id, 'geography');
          const chapterImages = [];
          for (const l of lessons) {
            if (l.images && l.images.length > 0) {
              chapterImages.push({ lessonTitle: l.title, images: l.images });
            }
          }
          if (chapterImages.length > 0) {
            data.push({ gradeName: g.name, unitName: u.name, lessons: chapterImages });
          }
        }
      }

      setChapters(data);
      setLoading(false);

      // Preload ALL images
      const allImages = data.flatMap((c) => c.lessons.flatMap((l) => l.images));
      preloadImages(allImages);
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className={styles.page}>
        <div className={styles.loading}>正在加载地图册...</div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>🗺️ 地理地图册</h1>
      <p className={styles.subtitle}>初中地理全册地图索引 · 按章节排列</p>

      {chapters.map((chapter, ci) => (
        <div key={ci} className={styles.chapter}>
          <div className={styles.chapterHeader}>
            <h2 className={styles.gradeName}>{chapter.gradeName}</h2>
            <h3 className={styles.unitName}>{chapter.unitName}</h3>
          </div>

          <div className={styles.imageGrid}>
            {chapter.lessons.map((lesson, li) =>
              lesson.images.map((img, ii) => (
                <div key={`${li}-${ii}`} className={styles.imageCard}>
                  <WikipediaImage
                    keyword={img.keyword}
                    caption={img.caption}
                    source={img.source}
                    lang="zh"
                    directUrl={img.url || null}
                  />
                  <div className={styles.lessonTag}>{lesson.lessonTitle}</div>
                </div>
              ))
            )}
          </div>
        </div>
      ))}

      {chapters.length === 0 && (
        <p className={styles.empty}>暂无地图数据</p>
      )}
    </div>
  );
}
