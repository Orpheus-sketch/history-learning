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

// Multiple proxy options for China accessibility
function getImageUrl(originalUrl) {
  if (!originalUrl) return null;
  // Return direct URL first (fastest if accessible),
  // the onError handler will try proxies
  return originalUrl;
}

function getProxyUrl(originalUrl) {
  if (!originalUrl) return null;
  // wsrv.nl proxy - often faster
  return `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}`;
}

function getProxyUrl2(originalUrl) {
  if (!originalUrl) return null;
  // images.weserv.nl fallback proxy
  return `https://images.weserv.nl/?url=${encodeURIComponent(originalUrl)}&default=1`;
}

async function fetchWikiImage(keyword, lang = 'zh', fallbackKeyword) {
  const cacheKey = `${lang}:${keyword}`;
  if (cache[cacheKey] !== undefined) return cache[cacheKey];

  // Deduplicate concurrent requests
  if (pendingRequests[cacheKey]) return pendingRequests[cacheKey];

  // Multiple API endpoints to try (for China accessibility)
  const API_ENDPOINTS = (language) => [
    `https://${language}.wikipedia.org/w/api.php?action=query&titles=__KW__&prop=pageimages&format=json&pithumbsize=800&origin=*`,
    `https://en.wikipedia.org/w/api.php?action=query&titles=__KW__&prop=pageimages&format=json&pithumbsize=800&origin=*`,
    `https://wiki.archlinux.org/title/__KW__`,  // dummy fallback, won't work for images
  ];

  async function tryFetch(kw, language) {
    const ck = `${language}:${kw}`;
    if (cache[ck] !== undefined) return cache[ck];

    const endpoints = [
      `https://${language}.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(kw)}&prop=pageimages&format=json&pithumbsize=800&origin=*`,
      `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(kw)}&prop=pageimages&format=json&pithumbsize=800&origin=*`,
    ];

    for (const apiUrl of endpoints) {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 8000);
        const response = await fetch(apiUrl, { signal: controller.signal });
        clearTimeout(timeout);
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
      } catch {
        continue; // Try next endpoint
      }
    }

    cache[ck] = null;
    persistCache();
    return null;
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
  const rawUrl = directUrl || apiResult.url;
  const resolved = directUrl ? true : apiResult.resolved;
  const [imgSrc, setImgSrc] = useState(null);
  const [retryCount, setRetryCount] = useState(0);

  // Set up cascade: direct -> proxy1 -> proxy2
  useEffect(() => {
    if (!rawUrl) {
      setImgSrc(null);
      return;
    }
    if (retryCount === 0) {
      setImgSrc(rawUrl); // Try direct URL first
    } else if (retryCount === 1) {
      setImgSrc(getProxyUrl(rawUrl)); // Try wsrv.nl
    } else if (retryCount === 2) {
      setImgSrc(getProxyUrl2(rawUrl)); // Try weserv.nl
    } else {
      setImgSrc(null); // All attempts failed
    }
  }, [rawUrl, retryCount]);

  const handleImgError = () => {
    if (retryCount < 2) {
      setRetryCount(c => c + 1); // Try next fallback
    } else {
      setImgSrc(null); // All failed, show fallback
    }
  };

  return (
    <figure className={styles.figure}>
      <div className={styles.imgWrapper}>
        {imgSrc ? (
          <img
            className={styles.image}
            src={imgSrc}
            alt={caption}
            loading="lazy"
            onError={handleImgError}
          />
        ) : resolved ? (
          <div className={`${styles.placeholder} ${styles.noImage}`}>
            <span className={styles.fallbackIcon}>🏛️</span>
            <span className={styles.fallbackText}>{caption || keyword}</span>
          </div>
        ) : (
          <div className={`${styles.placeholder} ${styles.loading}`}>
            <span className={styles.imgLoading}>图片加载中</span>
          </div>
        )}
      </div>
      <figcaption className={styles.figcaption}>
        <p className={styles.caption}>{caption}</p>
        <p className={styles.source}>来源：{source || 'Wikipedia'}</p>
      </figcaption>
    </figure>
  );
}
