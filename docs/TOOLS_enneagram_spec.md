# 에니어그램 도구 스펙

**갱신**: 2026-07-23  
**정본 데이터**: `data/enneagram-types.json` · `data/enneagram-items.json`  
**UI**: `tools/enneagram.html` · `tools/enneagram.js` · `tools/enneagram-guide.html` (9유형 정적 안내)  
**채점**: `js/scoring.js` → `scoreEnneagram`  
**콘텐츠 계획**: `docs/ENNEAGRAM_CONTENT_PLAN.md`

---

## 채점

- 63문항 (유형당 7), Likert 1–5
- 9유형 % = 유형 raw / 전체 합 × 100
- Core = 최고 점수 유형
- Wing = core 인접(±1 mod 9) 중 높은 점수 → `NwM`
- Tritype = gut(8,9,1) · heart(2,3,4) · head(5,6,7) 각 최고를 이어 붙인 세 자리
- `centers`는 `{ types: number[], label, summary }` 객체 또는 legacy `number[]` 모두 허용

---

## 유형 메타 필드 (types[N])

| 필드 | 용도 |
|------|------|
| name / nameEn / center / summary | 기본 |
| coreMotivation / coreFear | 동기·불편 |
| strengths[] / shadow[] | 빛·그림자 |
| growthQuestions[] | 성장 질문 |
| wingHint | 날개 읽기 가이드 |
| mirrorPractice | 10~30초 실습 |

글로벌: `about` · `howToRead[]` · `limits` · `sources[]` · `centers.*.label/summary/types`

---

## 톤 · 금지

- 비공식 자가탐구 · 임상 진단 대체 금지
- 금지어: 치유, 운명, 반드시, 확정 성격, 진단·치료 암시
- 권장: 경향, 스냅샷, 거울, 울림, 기록, 가설

---

## 결과 UI 블록 순서

1. 유형 라벨 · 센터 · summary  
2. 동기와 불편  
3. 빛 / 그림자  
4. 날개 · 트라이타입  
5. 성장 질문 · 실습  
6. 9% 막대  
7. 탐구 일지  
8. limits · disclaimer  
