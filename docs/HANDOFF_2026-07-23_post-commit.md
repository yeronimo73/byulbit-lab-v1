---
from: Grok (Starlight Research workspace)
to: next-agent
date: 2026-07-23
subject: 홈 리뉴얼 커밋 완료 · 미배포 · SEO 후속 대기
project: Starlight Research / starlightlab.org
status: waiting
repo: ~/Library/Mobile Documents/com~apple~CloudDocs/Homepage/Starlight Research
live: https://starlightlab.org
policy:
  - 커밋은 사용자 승인 후 (이번 라운드: 이미 1커밋 완료)
  - 푸시·배포는 아직 승인 없음
  - 데이터 병합·삭제 금지 (1 source = 1 file)
  - 스택: 정적 HTML + CSS + vanilla ES modules + Three.js (React 금지)
  - 톤: 비영리 · 운세 아님 · 별·빛·거울
---

# 핸드오프 — 2026-07-23 (커밋 이후)

## 1. 한 줄 상태

**로컬 커밋 완료** (`b24944a`, main ahead 1). **origin 푸시·라이브 배포 안 함.**  
라이브(`starlightlab.org`)는 여전히 **구버전**(7/14 팝업·구 히어로 가능).  
SEO/AEO/GEO 이중 점검 조치안(패키지 A–D)은 **미실행** — 사용자 패키지 선택 대기였음.

## 2. 세션에서 한 일

1. 최근 커밋 확인 → `c2bf19e` (2026-07-12, 7/14 팝업).
2. 팝업 내림 요청 후 **7/28 데시오 포스터로 교체**.
3. 홈 **전면 리뉴얼** 계획 승인 → 구현 (하이브리드 히어로, IA 재배치, `home.css`).
4. SEO 스킬 탐색·설치 시점 비교 → 1차 `ai-seo`(6/22) + 2차 `seo` 스위트(7/20) **이중 점검 보고**.
5. 사용자: 커밋 전 로컬 확인이 당연한 순서라고 확인.
6. 사용자 지시로 **커밋 실행** (`b24944a`). 푸시 안 함.
7. 디자인 변화 범위 설명: IA·첫화면 중~큼 / 브랜드 톤·하위 페이지 거의 동일.

## 3. Git

```
HEAD: b24944a feat: 홈 리뉴얼 + 7/28 세미나 팝업(데시오 3층)
parent: c2bf19e feat: 팝업 세미나 포스터 7/14 로스팅로보 3층으로 교체
branch: main...origin/main [ahead 1]
```

### 커밋에 포함된 파일 (8)

| 파일 | 역할 |
|------|------|
| `index.html` | 홈 IA·히어로·Explore·About·7/28 팝업 |
| `css/home.css` | 홈 전용 스타일 (신규) |
| `css/site.css` | spacing/type/surface 토큰 |
| `js/site.js` | popup KEY `byulbit_v1_popup_20260728` |
| `assets/popup/seminar-2026-07-28.jpeg` | 7/28 포스터 |
| `docs/PRD_별빛연구소_v1.0.md` | 세미나 팝업 운영 문구 |
| `docs/HOME_RENEWAL.md` | 리뉴얼 메모 |
| `docs/HANDOFF_2026-07-23.md` | 이전 핸드오프 (커밋 전 스냅샷) |

### 커밋 제외 (untracked 잔여 가능)

- `scripts/__pycache__/`
- `팝업/` (원본 폴더, `photo_2026-07-11…jpeg` — 사이트 경로 아님)

`git status`로 재확인.

## 4. 리뉴얼 요지 (다음 에이전트용)

### IA 순서
`Hero(미션 + 이달의 별 피처 카드)` → `Explore` → `Signs` → `Info` → `About(별·빛·거울)` → Footer

### 내비
- 데스크톱: 별자리 · 탐구 · 연구 · 하늘  
- 드로어: 상세 링크 유지  

### 디자인 체감
- **바뀜:** 히어로 구성, 섹션 순서, 내비 밀도, 도구 카드, About 3기둥, 팝업 일정  
- **유지:** 팔레트·폰트·WebGL·하위 페이지 UI  

### 팝업
- 일정: **7/28(화) 14시, 데시오 3층 (중구 공평동 82-15)**  
- dismiss KEY: `byulbit_v1_popup_20260728`  
- 구 이미지 7/7·7/14 파일은 assets에 **잔존** (삭제 금지 기본)

## 5. 라이브 vs 로컬

| | 로컬 (b24944a) | 라이브 |
|--|----------------|--------|
| 홈 리뉴얼 | ✅ | ❌ 미배포 |
| 팝업 | 7/28 데시오 | 구버전(7/14 등) 가능 |
| 푸시 | ahead 1 | origin은 c2bf19e 계열 |

## 6. SEO/AEO/GEO (미착수 후속)

상세: `docs/HANDOFF_2026-07-23.md` 및 세션 보고.

| Critical | 내용 |
|----------|------|
| sign 페이지 | `main` 정적 ≈0단어, H1/스키마 없음, canonical=`/sign` |
| 홈 그리드 | `#sign-grid`/`#info-grid` JS 주입 전 비어 있음 |
| 인용 블록 | 히어로 리드 짧음 · dateModified/저자 약함 |
| sitemap | lastmod 전부 `2026-06-15` |
| 팝업 H2 | 아웃라인 오염 (visually-hidden H2) |

### 권장 패키지 (사용자 미선택)

| ID | 내용 |
|----|------|
| A | 푸시·배포만 |
| B | A + meta·H2 수정·sitemap lastmod·홈 인용 블록 |
| **C (추천)** | B + **sign 정적 폴백** + canonical + JSON-LD |
| D | C + 인포/스카이 폴백 + OG 차별화 |

스킬: 점검 본체 `~/.claude/skills/seo`·`seo-geo` (2026-07-20); 전략 보조 `~/.agents/skills/ai-seo` (2026-06-22).

## 7. 하지 말 것

- 사용자 승인 없는 **force push** / 데이터 삭제  
- React 도입, 세미나 결제 폼, 메인 참가비  
- AI 전용 얇은 페이지 양산, HowTo 스키마  
- `팝업/`·구 seminar jpeg 임의 삭제  

## 8. 다음 액션 체크리스트

- [ ] 로컬 육안 확인 (`python3 -m http.server`, 홈·팝업·Explore)
- [ ] 사용자: **푸시/배포** 여부
- [ ] 사용자: SEO 패키지 **B vs C** (또는 A만 배포)
- [ ] 배포 후 라이브에서 7/28 팝업·미션 H1 확인
- [ ] (C 시) `sign.html` 정적 폴백 설계·구현

## 9. 핵심 경로

| 용도 | 경로 |
|------|------|
| 홈 | `index.html` |
| 홈 CSS | `css/home.css` |
| 공유 토큰 | `css/site.css` |
| 팝업/내비 JS | `js/site.js` |
| 이달의 별 | `js/scoring.js` · `data/signs.json` |
| 이전 핸드오프 | `docs/HANDOFF_2026-07-23.md` |
| 본 핸드오프 | `docs/HANDOFF_2026-07-23_post-commit.md` |
| 리뉴얼 메모 | `docs/HOME_RENEWAL.md` |

## 10. 열린 결정

1. `git push` / Vercel 배포 지금 할까?  
2. SEO 후속 패키지 A / B / C / D?  
3. sign URL: `?id=` 유지 vs 클린 경로?

---

*생성: 2026-07-23 · 커밋 b24944a 이후 핸드오프. 수신 에이전트 미지정 → docs/ 보관.*
