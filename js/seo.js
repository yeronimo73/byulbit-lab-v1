const SITE = {
  url: 'https://byulbit-lab-v1.vercel.app',
  name: '별빛연구소',
  ogImage: '/assets/hero-poster.jpeg',
};

function upsertMeta(selector, attr, key, value) {
  let el = document.querySelector(selector);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', value);
}

function upsertLink(rel, href) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id);
  if (!el) {
    el = document.createElement('script');
    el.type = 'application/ld+json';
    el.id = id;
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

/** 동적 페이지(sign·인포·연구노트) 메타 갱신 */
export function applyPageSEO({ title, description, path, jsonLd, jsonLdId = 'page-jsonld' }) {
  const canonical = `${SITE.url}${path.startsWith('/') ? path : `/${path}`}`;
  const image = `${SITE.url}${SITE.ogImage}`;

  document.title = title;
  upsertMeta('meta[name="description"]', 'name', 'description', description);
  upsertMeta('meta[property="og:title"]', 'property', 'og:title', title);
  upsertMeta('meta[property="og:description"]', 'property', 'og:description', description);
  upsertMeta('meta[property="og:url"]', 'property', 'og:url', canonical);
  upsertMeta('meta[property="og:image"]', 'property', 'og:image', image);
  upsertMeta('meta[name="twitter:title"]', 'name', 'twitter:title', title);
  upsertMeta('meta[name="twitter:description"]', 'name', 'twitter:description', description);
  upsertMeta('meta[name="twitter:image"]', 'name', 'twitter:image', image);
  upsertLink('canonical', canonical);

  if (jsonLd) upsertJsonLd(jsonLdId, jsonLd);
}

export function articleJsonLd({ headline, description, path, datePublished }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline,
    description,
    inLanguage: 'ko',
    url: `${SITE.url}${path}`,
    datePublished,
    author: { '@type': 'Organization', name: SITE.name },
    publisher: {
      '@type': 'Organization',
      name: SITE.name,
      logo: { '@type': 'ImageObject', url: `${SITE.url}${SITE.ogImage}` },
    },
  };
}