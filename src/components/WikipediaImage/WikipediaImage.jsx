import { useState, useEffect } from 'react';
import styles from './WikipediaImage.module.css';

// Module-level cache shared across all WikipediaImage instances
const LS_KEY = 'hl-img-cache';
const cache = {};

// Load persisted cache from localStorage on init
try {
  const saved = JSON.parse(localStorage.getItem(LS_KEY) || '{}');
  Object.assign(cache, saved);
} catch { /* ignore */ }

function persistCache() {
  try {
    // Keep max 200 entries to avoid localStorage overflow
    const keys = Object.keys(cache);
    if (keys.length > 200) {
      const toRemove = keys.slice(0, keys.length - 200);
      toRemove.forEach(k => delete cache[k]);
    }
    localStorage.setItem(LS_KEY, JSON.stringify(cache));
  } catch { /* ignore */ }
}

const pendingRequests = {};

// Preload images for a list of keywords (call from page components on mount)
export function preloadImages(images, lang = 'zh') {
  if (!images || images.length === 0) return;
  images.forEach((img) => {
    if (img && img.keyword) {
      fetchWikiImage(img.keyword, lang, img.fallbackKeyword);
    }
  });
}

async function fetchWikiImage(keyword, lang = 'zh', fallbackKeyword) {
  const cacheKey = `${lang}:${keyword}`;
  if (cache[cacheKey] !== undefined) return cache[cacheKey];

  // Deduplicate concurrent requests
  if (pendingRequests[cacheKey]) return pendingRequests[cacheKey];

  async function tryFetch(kw, language) {
    const ck = `${language}:${kw}`;
    if (cache[ck] !== undefined) return cache[ck];

    const apiUrl = `https://${language}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(kw)}&prop=pageimages&format=json&pithumbsize=800&origin=*`;

    try {
      const response = await fetch(apiUrl);
      const data = await response.json();
      const pages = data.query?.pages;
      if (pages) {
        const page = Object.values(pages)[0];
        const src = page?.thumbnail?.source;
        if (src) {
        cache[ck] = src;
        persistCache();
        return src;
      }
      }
      cache[ck] = null;
      persistCache();
      return null;
    } catch {
      cache[ck] = null;
      persistCache();
      return null;
    }
  }

  const promise = (async () => {
    // 1. Try primary keyword in primary language
    let result = await tryFetch(keyword, lang);
    if (result) return result;

    // 2. Try fallback keyword
    if (fallbackKeyword) {
      result = await tryFetch(fallbackKeyword, lang);
      if (result) return result;
    }

    // 3. Try English Wikipedia
    if (lang !== 'en') {
      result = await tryFetch(keyword, 'en');
      if (result) return result;

      if (fallbackKeyword) {
        result = await tryFetch(fallbackKeyword, 'en');
        if (result) return result;
      }
    }

    return null;
  })();

  pendingRequests[cacheKey] = promise;
  promise.finally(() => { delete pendingRequests[cacheKey]; });
  return promise;
}

function useWikiImage(keyword, lang = 'zh', fallbackKeyword) {
  const [url, setUrl] = useState(() => {
    // Check cache synchronously on first render
    if (!keyword) return null;
    return cache[`${lang}:${keyword}`] || null;
  });
  const [resolved, setResolved] = useState(() => {
    if (!keyword) return true;
    return cache[`${lang}:${keyword}`] !== undefined;
  });

  useEffect(() => {
    if (!keyword) return;

    let cancelled = false;
    const cacheKey = `${lang}:${keyword}`;

    // Already cached → show immediately
    if (cache[cacheKey] !== undefined) {
      setUrl(cache[cacheKey]);
      setResolved(true);
      return;
    }

    // Fetch in background
    fetchWikiImage(keyword, lang, fallbackKeyword).then((result) => {
      if (!cancelled) {
        setUrl(result);
        setResolved(true);
      }
    });

    return () => { cancelled = true; };
  }, [keyword, lang, fallbackKeyword]);

  return { url, resolved };
}

export default function WikipediaImage({ keyword, caption, source, lang, fallbackKeyword, directUrl }) {
  // If a pre-resolved URL is provided, use it directly (no API call)
  const apiResult = useWikiImage(directUrl ? null : keyword, lang, fallbackKeyword);
  const url = directUrl || apiResult.url;
  const resolved = directUrl ? true : apiResult.resolved;

  return (
    <figure className={styles.figure}>
      {/* Always render the image container — just hidden until loaded */}
      <div className={styles.imgWrapper}>
        {url ? (
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
        ) : (
          <div className={`${styles.placeholder} ${resolved ? styles.noImage : styles.loading}`}>
            {!resolved ? (
              <span className={styles.imgLoading}>图片加载中</span>
            ) : (
              <>
                <span className={styles.fallbackIcon}>🏛️</span>
                <span className={styles.fallbackText}>{caption || keyword}</span>
              </>
            )}
          </div>
        )}
        {/* Fallback when img fails */}
        <div className={styles.fallback} style={{ display: 'none' }}>
          <span className={styles.fallbackIcon}>🏛️</span>
          <span className={styles.fallbackText}>{caption || keyword}</span>
        </div>
      </div>
      <figcaption className={styles.figcaption}>
        <p className={styles.caption}>{caption}</p>
        <p className={styles.source}>来源：{source || 'Wikipedia'}</p>
      </figcaption>
    </figure>
  );
}
