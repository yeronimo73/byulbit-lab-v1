/** Resolve quiz visual metadata → renderable props */

export function buildInfographicCatalog(items) {
  return Object.fromEntries(items.map((i) => [i.id, i]));
}

export function resolveQuizVisual(item, quizMeta, catalogById) {
  if (!item?.visual && quizMeta?.visual?.variant !== 'thumb') return null;

  const infoId = item?.visual?.infographicId || quizMeta?.infographicId;
  const info = catalogById[infoId];
  if (!info) return null;

  const v = item.visual || {};
  const variant = v.variant || 'thumb';

  if (variant === 'crop' && v.src) {
    return {
      variant,
      src: v.src,
      srcset: v.srcset,
      alt: v.alt || info.title,
      caption: v.caption || '',
      href: `../infographic.html?id=${infoId}`,
      accent: info.color,
    };
  }

  if (variant === 'thumb' || !v.src) {
    return {
      variant: 'thumb',
      src: info.thumb,
      alt: `${info.title} 썸네일`,
      caption: v.caption || '',
      href: `../infographic.html?id=${infoId}`,
      accent: info.color,
    };
  }

  return null;
}

export function prefetchImage(src) {
  if (!src) return;
  const link = document.createElement('link');
  link.rel = 'prefetch';
  link.as = 'image';
  link.href = src;
  document.head.appendChild(link);
}