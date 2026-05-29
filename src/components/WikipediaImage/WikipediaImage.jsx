import { useState, useEffect } from 'react';
import styles from './WikipediaImage.module.css';

const cache = {};

function useWikiImage(keyword, lang = 'zh') {
  const [url, setUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!keyword) return;

    const cacheKey = `${lang}:${keyword}`;
    if (cache[cacheKey]) {
      setUrl(cache[cacheKey]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const apiUrl = `https://${lang}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(keyword)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;

    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        if (cancelled) return;
        const pages = data.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0];
          const src = page?.thumbnail?.source;
          if (src) {
            cache[cacheKey] = src;
            setUrl(src);
          }
        }
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => { cancelled = true; };
  }, [keyword, lang]);

  return { url, loading };
}

export default function WikipediaImage({ keyword, caption, source, lang }) {
  const { url, loading } = useWikiImage(keyword, lang);

  return (
    <figure className={styles.figure}>
      {loading ? (
        <div className={styles.placeholder}>
          <span className={styles.spinner} />
          <span className={styles.loadingText}>加载图片中...</span>
        </div>
      ) : url ? (
        <img
          className={styles.image}
          src={url}
          alt={caption}
          loading="lazy"
          onError={(e) => {
            e.target.style.display = 'none';
            e.target.nextSibling.style.display = 'flex';
          }}
        />
      ) : null}
      <div className={styles.fallback} style={{ display: url && !loading ? 'none' : 'flex' }}>
        <span className={styles.fallbackIcon}>🏛️</span>
        <span className={styles.fallbackText}>{keyword}</span>
      </div>
      <figcaption className={styles.figcaption}>
        <p className={styles.caption}>{caption}</p>
        <p className={styles.source}>来源：{source || 'Wikipedia'}</p>
      </figcaption>
    </figure>
  );
}
