# 별빛연구소 콘텐츠 보강 로드맵

**일자**: 2026-06-07  
**주관**: 별빛연구소 (Starlight Research)  
**상태**: P1 완료 · P2(color-atlas·행성 색·COLOR_RESEARCH) 완료

---

## 1. 목표

「별과 빛을 연구하는 연구소」 정체성을 콘텐츠 깊이로 증명한다.

| 축 | 의미 | 현재 갭 |
|----|------|---------|
| **별** | 검증 가능한 천문·관측 | 별자리당 `observe` 1단락 |
| **빛** | 색채·스펙트럼·시각 앵커 | `colorPsych` 1단락 |
| **거울** | 심리·퀴즈·자기 기록 | 상대적으로 충실 |

---

## 2. 완료 (2026-06-07)

| 항목 | 경로 |
|------|------|
| 연구 허브 페이지 | `research.html` |
| 허브 메타 | `data/research-hub.json` |
| 참고문헌 | `data/research-bibliography.json` |
| 네비 「연구」 | `index.html`, `research.html` |
| 별자리 4층 (12종) | 전 12궁 `data/signs.json` 완료 |
| sign 상세 렌더 | `sign.html` (신규 필드 + 구 필드 폴백) |
| 인포 3층 | `data/infographic-details.json` → `facts`/`light`/`mirror` |
| 인포 포스터 | `js/infographic-poster.js` (3층 라벨) |
| 관측 달력 | `data/sky-calendar.json` + 홈 `#hero-sky` |
| 스타일 | `css/site.css` (research-*, sign-astro-*, hero-sky) |
| 인포 상세 3층 | `infographic.html` + `renderInfographicLayers()` |
| 연구 노트 #1 | `research-note.html`, `data/research-notes/color-emotion.json` |
| 연구 허브 노트 목록 | `research.html` → `#research-notes-section` |
| 연구 노트 #2 | `stellar-color.json` |
| 관측 달력 페이지 | `sky.html` (12개월) |
| 탐구 일지 | `js/explore-journal.js` → MBTI·에니어그램·행성 거울·지식 퀴즈 4종 |

### 별자리 4층 JSON 스키마 (템플릿)

```json
{
  "astronomyFacts": ["천문 사실 2~3줄"],
  "lightNote": "왜 이 hue인지 · 별빛·스펙트럼 연결",
  "colorAssociation": "색–연상 (단정 금지)",
  "colorContext": "명도·채도·맥락·면책",
  "colorPractice": "10~30초 앵커 실습",
  "colorPsych": "레거시 요약 (선택, 신규 필드 없을 때 폴백)",
  "sources": [{ "label": "...", "url": "..." }]
}
```

---

## 3. P0 — 다음 스프린트 (1~2주)

### 3.1 나머지 9별자리 4층 확장

| 순서 | id | 비고 |
|------|-----|------|
| 1 | gemini | ✅ |
| 2 | cancer | ✅ |
| 3 | leo | ✅ |
| 4 | aries | ✅ (배치 1) |
| 5 | taurus | ✅ (배치 1) |
| 6 | virgo | ✅ (배치 1) |
| 7 | libra | ✅ (배치 2) |
| 8 | scorpio | ✅ (배치 2) |
| 9 | sagittarius | ✅ (배치 2) |
| 10 | capricorn | ✅ (배치 3) |
| 11 | aquarius | ✅ (배치 3) |
| 12 | pisces | ✅ (배치 3) |

**작업 단위**: 별자리 2~3개/일, 천문 사실 출처 `sources`에 1건 이상.

### 3.2 인포그래픽 3층 분리

- ✅ `facts` / `light` / `mirror` 추가 (5종)
- ✅ `infographic-poster.js` 라벨 전환
- ✅ `infographic.html` 상세 본문 3층 요약 블록 (5종 + 행성 거울)

### 3.3 관측 달력

- ✅ `data/sky-calendar.json` (2026년 12개월)
- ✅ 홈 `hero-sky` 한 줄
- ✅ `research.html` 이달의 하늘 highlights
- ✅ `sky.html` 연간 12개월 목록

---

## 4. P1 — 깊이·재방문 (2~4주)

### 4.1 관측 달력

- `data/sky-calendar.json` — 월별 보름달, 유성우, 춘분·추분
- 홈 hero 아래 「이달의 하늘」 1줄
- 인포·별자리 `observe`와 교차 링크

### 4.2 빛 연구 노트 시리즈 (월 1편)

| # | 제목 | data 파일 후보 |
|---|------|----------------|
| 1 | 색은 감정을 바꾸는가? | ✅ `data/research-notes/color-emotion.json` |
| 2 | 별빛의 색 — 스펙트럼 | ✅ `stellar-color.json` |
| 3 | 달빛과 명도 | ✅ `moonlight.json` |
| 4 | 황도 12색 디자인 노트 | ✅ `zodiac-hues.json` |

렌더: `research-note.html?id=` 또는 연구 허브 하위 목록.

### 4.3 탐구 일지 (localStorage)

- ✅ MBTI / 에니어그램 / 행성 거울 결과 하단
- ✅ 「오늘의 울림 한 줄」 → `localStorage` (최대 20건)
- ✅ 지식 퀴즈 4종 결과 → `js/knowledge-quiz-shell.js` + `explore-journal.js`

---

## 5. P2 — 장기 자산

| 항목 | 설명 |
|------|------|
| `data/color-atlas.json` | ✅ 12 hue + HSL + 면책 · `color-atlas.html` · `sign.html` 앵커 링크 |
| 행성 천체 색 카드 | ✅ `planet-types.json` `skyColorFact` 8체 · 인포 카드·퀴즈 결과 |
| `docs/COLOR_RESEARCH.md` | ✅ 내부 집필 가이드 (3층 분리·금지어·필드·검수) |
| 세미나 노트 아카이브 | `auto/` → 승격 시 공개 |

---

## 6. 집필·인용 규칙

상세: **`docs/COLOR_RESEARCH.md`** (내부 정본)

1. **천문**: IAU, NASA, 국립천문대/KASI 보도 — 운세 구간과 혼동 금지.
2. **색채**: Jonauskaite & Mohr 2025, Elliot 2015 인용. **연상 ≠ 체감**.
3. **금지**: Lüscher 색씨, 「치유」「운세 확정」, 성격 단정.
4. **톤**: 「떠올리기 쉬움」「그날의 기록」「시각적 앵커」.

---

## 7. 검증 체크리스트 (별자리 1건 완료 시)

- [ ] `astronomyFacts` 2~3개, 사실·해석 분리
- [ ] `lightNote`에 천문(별 색) + 상징(hue) 연결
- [ ] `colorContext`에 맥락·면책 1문장 이상
- [ ] `colorPractice` 실행 가능 (10~30초)
- [ ] `sources` 1건 이상 (DOI 또는 NASA)
- [ ] `sign.html` 렌더 · 모바일 320px
- [ ] 구 `colorPsych`만 있는 별자리 — 폴백 UI 정상

---

## 8. 파일 맵 (목표 IA)

```
byulbit-lab-v1/
├── research.html              ← 연구 허브 ✅
├── sky.html                   ← 2026 관측 달력 ✅
├── research-note.html         ← 연구 노트 ✅
├── data/
│   ├── research-hub.json      ✅
│   ├── research-bibliography.json ✅
│   ├── research-notes/        ✅ (4/4)
│   ├── sky-calendar.json      ✅
│   ├── color-atlas.json       ✅
│   ├── color-atlas.html       ✅
│   └── signs.json             ← 4층 필드 확장 중
└── docs/
    ├── CONTENT_PLAN.md        ← 이 문서
    └── COLOR_RESEARCH.md      ← 빛·색채 집필 가이드 (내부)
```

---

## 9. 담당·후속

| 작업 | 제안 담당 |
|------|-----------|
| 11별자리 4층 카피 | Elon/Cup (집필) + Rostar (스키마·검증) |
| 천문 사실 팩트체크 | Coco 또는 수동 NASA 대조 |
| 인포 3층 | Miho(비주얼) + 집필 |
| 배포 | `./scripts/deploy-vercel.sh` |

**다음 권장 작업**: 7/28 세미나 요지 노트 · 거울 방법론 노트 · 월간 하늘 메모 · 홈 이달의 별 SSR 폴백.

### 홈 v1.1 콘텐츠 패키지 (2026-07-23) — 완료

| # | 블록 | 경로 |
|---|------|------|
| 1 | 연구 노트 하이라이트 3카드 | `index.html#research-spotlight` |
| 2 | 지금 묻는 질문 | `index.html#agenda-home` |
| 3 | 이달의 하늘 (7월) | `index.html#this-month-sky` |
| 4 | 콘텐츠 갱신일 footer | `time datetime=2026-07-23` |
| 5 | 세미나 스트립 7/28 | `index.html#seminar` |

### P3 1단계 (2026-07-23) — 완료

| 항목 | 경로 |
|------|------|
| 연구 질문 보드 | `data/research-hub.json` → `agenda` · `research.html#agenda-heading` |
| 연구 노트 #5 · 별자리 ≠ 운명 | `data/research-notes/zodiac-not-destiny.json` |
| 연구 노트 #6 · 천문↔점성 공존·분리 | `data/research-notes/astro-coexist.json` (Brain `천문과 점성의 공존-분리` + yaan 3부작 증류) |