---
from: Rostar
to: operator
date: 2026-06-10
subject: 별빛연구소 starlightlab.org 도메인 연결·검색 등록
project: Starlight Research (byulbit-lab-v1)
status: waiting
---

# 요청서 — starlightlab.org 도메인 연결 및 검색 노출

## 한 줄 요약

**도메인 `starlightlab.org` 구매 완료.** 사이트 코드·Vercel 배포·도메인 등록은 끝났고, **DNS만 연결하면** 공식 URL로 서비스 가능. 이후 Search Console·네이버 서치어드바이저 등록 필요.

---

## 배경

| 항목 | 내용 |
|------|------|
| 사이트명 | 별빛연구소 (Starlight Research) |
| 기존 URL | `https://byulbit-lab-v1.vercel.app` |
| **신규 정본 URL** | **`https://starlightlab.org`** |
| Vercel 프로젝트 | `yeronimo73s-projects/byulbit-lab-v1` |
| 정본 경로 | `~/Library/Mobile Documents/com~apple~CloudDocs/Homepage/Starlight Research/` |

### Rostar 완료 사항 (2026-06-10)

- [x] 전역 canonical·OG·JSON-LD → `starlightlab.org`
- [x] `sitemap.xml`·`robots.txt`·`llms.txt` 갱신
- [x] `vercel.app` → `.org` 301 리다이렉트 (`vercel.json`)
- [x] Vercel 프로덕션 배포
- [x] Vercel에 `starlightlab.org`·`www.starlightlab.org` 도메인 추가

### 미완료 (본 요청서 대상)

- [ ] DNS 레코드 설정 (등록업체)
- [ ] HTTPS·도메인 연결 확인
- [ ] Google Search Console 등록
- [ ] 네이버 서치어드바이저 등록
- [ ] SNS·외부 채널 URL 정리

---

## P0 — DNS 연결 (필수, 즉시)

**현재 상태**: `starlightlab.org` DNS 미설정 → 사이트 접속 불가.

**등록업체**: Cloudflare Registrar

### Cloudflare DNS 설정 경로

1. https://dash.cloudflare.com → 좌측 메뉴 **Websites** → `starlightlab.org` 선택
2. 좌측 메뉴 **DNS** → **Records**
3. **Add record** 버튼으로 아래 레코드 각각 추가

아래 **둘 중 하나**를 설정한다.

### 방법 A — A 레코드 (권장)

기존 DNS·메일 설정을 유지할 때.

| 타입 | 호스트 | 값 | TTL |
|------|--------|-----|-----|
| **A** | `@` (또는 비움) | `76.76.21.21` | 3600 (기본) |
| **A** | `www` | `76.76.21.21` | 3600 |

### 방법 B — Vercel 네임서버 (전체 위임)

DNS를 Vercel에 맡길 때. 등록업체 **네임서버**를 아래로 변경:

```
ns1.vercel-dns.com
ns2.vercel-dns.com
```

### 완료 확인

DNS 반영 후(수분~24시간) 아래가 모두 통과하면 P0 완료:

```bash
curl -sI https://starlightlab.org/ | head -5
# → HTTP/2 200

curl -sL https://starlightlab.org/robots.txt | head -3
# → Sitemap: https://starlightlab.org/sitemap.xml
```

브라우저에서 https://starlightlab.org 열리고, 홈 제목이 **「별빛연구소 | Starlight Research」**이면 OK.

---

## P1 — 검색엔진 등록 (DNS 연결 후)

### Google Search Console

1. https://search.google.com/search-console
2. 속성 추가 → URL 접두어: `https://starlightlab.org`
3. 소유권 확인 (HTML 메타 태그 권장 — 확인 코드 받으면 Rostar에 전달, `index.html`에 삽입·재배포)
4. **Sitemaps** → `https://starlightlab.org/sitemap.xml` 제출
5. URL 검사 → `https://starlightlab.org/` **색인 생성 요청**

### 네이버 서치어드바이저

1. https://searchadvisor.naver.com
2. 사이트 등록 → `https://starlightlab.org`
3. 소유 확인 (HTML 메타 또는 DNS)
4. **사이트맵 제출**: `https://starlightlab.org/sitemap.xml`
5. **요청 → URL 수집** → `https://starlightlab.org/` 수집 요청
6. (선택) RSS 없으면 생략. 네이버 블로그·스레드에 사이트 URL 링크 1건 이상 권장

---

## P2 — 외부 채널 URL 정리

| 채널 | 변경 내용 |
|------|-----------|
| 인스타·스레드 프로필 | 공식 URL → `https://starlightlab.org` |
| 네이버 블로그·티스토리 | 소개 글·프로필에 신규 URL |
| Notion·명함·자료 | `byulbit-lab-v1.vercel.app` → `starlightlab.org` |

구 URL(`byulbit-lab-v1.vercel.app`)은 301로 `.org`에 리다이렉트되므로 북마크는 동작하나, **신규 노출은 `.org`만** 사용.

---

## 참고 — 기술 상세

| 파일 | 역할 |
|------|------|
| `js/seo.js` | `SITE.url = 'https://starlightlab.org'` |
| `data/site-meta.json` | 동일 URL |
| `sitemap.xml` | 38 URL, lastmod 2026-06-10 |
| `scripts/generate-sitemap.py` | sitemap 재생성 스크립트 |
| `scripts/deploy-vercel.sh` | `./scripts/deploy-vercel.sh` 프로덕션 배포 |

### 소유권 확인 메타 태그 삽입 위치 (필요 시)

`index.html` `<head>` 내 `<!-- seo -->` 블록 직전:

```html
<meta name="google-site-verification" content="여기에_구글_코드" />
<meta name="naver-site-verification" content="여기에_네이버_코드" />
```

삽입 후:

```bash
cd "~/Library/Mobile Documents/com~apple~CloudDocs/Homepage/Starlight Research"
./scripts/deploy-vercel.sh
```

---

## 체크리스트 (담당자용)

| P | 작업 | 담당 | 완료 |
|---|------|------|------|
| P0 | DNS A레코드 또는 NS 설정 | 도메인 관리자 | ☐ |
| P0 | https://starlightlab.org 접속 확인 | — | ☐ |
| P1 | Google Search Console 등록·sitemap | — | ☐ |
| P1 | 네이버 서치어드바이저 등록·수집요청 | — | ☐ |
| P2 | SNS·블로그 URL 갱신 | — | ☐ |
| — | 확인 코드 → Rostar 전달 (메타 삽입·배포) | 필요 시 | ☐ |

---

## 완료 보고 시 전달 항목

1. DNS 방법 (A레코드 / NS위임) + 등록업체명
2. `curl -sI https://starlightlab.org/` 결과 (200 여부)
3. Search Console·서치어드바이저 등록 여부
4. (있으면) google/naver verification 코드

---

**요청 발행**: Rostar · 2026-06-10  
**관련**: `docs/PRD_별빛연구소_v1.0.md` · Vercel https://vercel.com/yeronimo73s-projects/byulbit-lab-v1