# 홈 SEO / AEO / GEO 진단

**대상**: `https://starlightlab.org/` (홈)  
**정본 대조**: 로컬 `index.html` ( ahead of live for soft-night·연구노트 )  
**일자**: 2026-07-23  
**방법**: `seo` + `seo-geo` + `ai-seo` 체크리스트 합성 (라이브 fetch · 정적 HTML · robots/llms/sitemap)

---

## 종합 점수 (홈 전용)

| 축 | 점수 | 한 줄 |
|----|------|--------|
| **SEO** (전통 검색) | **72 / 100** | 메타·H1·스키마·크롤 기본은 탄탄. JS 슬롯·사이트맵 신선도·내부 콘텐츠 깊이에서 깎임 |
| **AEO** (답변 엔진 추출) | **58 / 100** | 미션 한 줄은 추출 가능. FAQ·통계·질문형 H2·연구 인용 블록 부족 |
| **GEO** (생성형·LLM 인용) | **64 / 100** | `llms.txt`·봇 허용·정적 정체성 문장 좋음. 엔티티·신선도·인용 가능한 연구 패스 약함 |

**판정**: 홈은 “검색 입구”로는 합격선, “AI가 한 페이지에서 인용할 연구소 자료”로는 아직 얇다. 연구 허브·연구 노트·sign 페이지가 본진인데 홈이 그 권위를 충분히 전달하지 못함.

---

## SEO (Technical + On-page)

### 잘 된 것
- `title` / `meta description` / `canonical` / `robots: index,follow` 정상
- OG·Twitter 카드 풀세트, `og:image` 200 OK (~254KB)
- 정적 **JSON-LD** `@graph`: `WebSite` + `Organization`
- **H1 1개**: 「별과 빛으로 마음을 돌아봅니다」
- H2 골격: 탐구 · 12별자리 · 인포 · About
- HTTPS + HSTS + `X-Content-Type-Options: nosniff`
- Google Search Console 인증 메타 존재
- 내부 링크: `/research` `/sky` `/color-atlas` `/tools/*`
- 정적 main 한글 **~460자** 이상 (미션·About 3기둥 포함) — 완전 빈 홈 아님

### 문제 · 갭

| 심각도 | 이슈 | 영향 |
|--------|------|------|
| **High** | `#sign-grid`, `#info-grid`, `#hero-summary` 등 **JS 주입 슬롯이 SSR 비어 있음** | 크롤러/봇이 12별자리 카드·이달의 별 요약을 못 읽음 |
| **High** | `sitemap.xml` 홈·연구 `lastmod` **2026-06-15** (실제 배포 7/23) | 신선도 신호 왜곡 |
| **Medium** | Organization 스키마에 `sameAs`, `description` 상세, 연락 채널 없음 | 엔티티 연결 약함 |
| **Medium** | 홈에 **연구 노트 / 최신 연구 질문** 링크 없음 | 토픽 클러스터 허브 역할 약함 |
| **Medium** | WebGL 배경 + 다중 웹폰트 | LCP/INP 리스크 (시각은 브랜드, 성능 트레이드오프) |
| **Low** | `theme-color` 아직 `#0a0a0f` (소프트나이트 미반영) | 브랜드 일관성 |
| **Low** | favicon 404 (로컬 서버 로그 기준) | 크롤·UX 소소 |

### 라이브 vs 로컬
- **라이브**: 7/23 00:42 UTC 배포분 (홈 리뉴얼 + 7/28 팝업). soft-night·`astro-coexist` 미포함.
- **로컬**: 배경 soft-night, 연구 노트 #5–6 있음 → 재배포 시 SEO/GEO 자산 증가.

---

## AEO (Answer Engine Optimization)

체크 (`ai-seo` extractability):

| 항목 | 결과 |
|------|------|
| 첫 문단에 정의형 답 | **부분** — 「운세가 아니라 거울… 비영리 연구」 (40–60자 답변 블록으로 쓸 만함) |
| 자립 가능한 답변 블록 2+ | **약함** — About 3기둥은 있으나 출처·수치 없음 |
| 질문형 헤딩 | **약함** — 「별과 빛을 연구합니다」 정도. 「별빛연구소란?」「운세 사이트인가?」 부재 |
| FAQ | **없음** |
| 통계 + 출처 | **없음** (홈) |
| 비교/표 | **없음** |
| Schema FAQ/QAPage | **없음** (Google FAQ rich 폐지 후에도 LLM 추출용으로는 가치 있음 — 신규 남용 금지만) |
| 작성자/갱신일 | **없음** |

**AEO 우선 카피 갭**  
사용자/엔진이 물을 법한 쿼리:
1. 별빛연구소란 무엇인가?
2. 별자리 사이트인데 운세인가?
3. 12별자리에서 무엇을 연구하나? (별·빛·거울)
4. 세미나/오프라인은?

홈에 **3–4개 FAQ + 40–60자 직접 답**이 있으면 AEO 점수가 바로 올라감.

---

## GEO (Generative Engine / AI search)

### 기술 접근성 — 양호
| 항목 | 상태 |
|------|------|
| `robots.txt` AI 봇 차단 | **없음** (GPTBot 등 Disallow 없음) → 인용 허용 방향 |
| `/llms.txt` | **존재** · 정체성·URL·인용 주의 잘 정리됨 |
| SSR 핵심 메시지 | **가능** (H1·lead·About) |
| AI 비실행 JS 의존 | **중간** — 카드 그리드는 비어 있음 |

### 인용 가능성 — 보통 이하
| 항목 | 상태 |
|------|------|
| 134–167자 자립 패스 | 부족 (짧은 리드 위주) |
| 1차 출처 링크 (NASA/DOI) | 홈에 없음 → 연구 노트에 있음 |
| 엔티티 (Wikipedia/Wikidata/sameAs) | 미확인·사실상 약할 가능성 |
| 브랜드 3rd party 멘션 | 세미나 오프라인 외 웹 멘션 약함 추정 |
| 신선도 (`last updated`) | 홈·sitemap 약함 |
| ResearchNote in llms | **미기재** (`astro-coexist`, `zodiac-not-destiny`) |

### 플랫폼별 메모
- **Google AIO**: 전통 SEO + 랭킹 상관. 홈은 입구, 실제 인용은 sign/research-note가 유리. sign 정적 폴백이 장기 과제.
- **ChatGPT / Perplexity**: `llms.txt` + 명확 정의 + 비영리·비운세 면책이 강점. 연구 노트 URL을 llms에 넣는 것이 저비용 고효율.
- **훈련 봇(CCBot)**: 현재 전체 Allow. 원하면 검색 봇만 허용·훈련 봇 차단 분리 가능 (정책 결정).

---

## 우선 조치 (홈 중심, 영향순)

### P0 — 이번 주
1. **홈에 「별빛연구소란?」 정의 블록 + FAQ 3문항** (운세 여부, 3축, 연구 허브 링크)  
2. **`llms.txt`에 연구 노트·연구 허브 질문 보드 URL 추가**  
3. **sitemap `lastmod` 갱신** (홈·research·research-note·신규 노트)  
4. **미배포 로컬 자산 배포** (연구 노트 #5–6, soft-night는 UX)

### P1 — 2주
5. 홈 **이달의 별 / 연구 하이라이트** SSR 폴백 1카드 (JS 실패 시에도 텍스트)  
6. Organization JSON-LD `sameAs` (인스타·스레드 등 공식 채널)  
7. `sign-grid` noscript 또는 서버 정적 12링크 리스트 (이름만이라도)

### P2 — 중기
8. sign 페이지 정적 폴백·canonical `?id=` 정합 (핸드오프 패키지 C)  
9. 홈 LCP: hero 포스터 우선, WebGL 지연 로드  
10. 외부 엔티티·멘션 (보도·디렉터리·세미나 후기)

---

## 점수 근거 요약

| 카테고리 | 가중 | 평가 |
|----------|------|------|
| Technical | 22% | 크롤 허용·HTTPS·스키마 기본 OK / 사이트맵 신선도·favicon |
| Content | 23% | 미션 명확·얇은 홈 본문·JS 카드 |
| On-page | 20% | 타이틀·H1·내부링크 OK / FAQ·연구 링크 약 |
| Schema | 10% | WebSite+Org OK / 확장 부족 |
| Performance | 10% | WebGL·폰트 리스크 (수치 PSI 재측정 권장) |
| AI readiness | 10% | llms+봇 허용 강 / 인용 패스·FAQ 약 |
| Images | 5% | 팝업 alt OK / 홈 이미지 빈약·그리드 JS |

---

## 참고
- 스킬: `~/.claude/skills/seo`, `seo-geo` · `~/.agents/skills/ai-seo`
- 선행: `docs/HANDOFF_2026-07-23.md` SEO 이중 점검 메모
- 라이브 스냅: 2026-07-23 fetch · `last-modified: Thu, 23 Jul 2026 00:42:57 GMT`
