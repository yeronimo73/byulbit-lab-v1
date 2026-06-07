# 별빛연구소 홈페이지 PRD v1.0

**일자**: 2026-06-07  
**주관**: 별빛연구소 (Starlight Research)  
**성격**: 비영리 천체·심리 연구 기관  
**산출 경로 (정본)**: `~/Library/Mobile Documents/com~apple~CloudDocs/Homepage/Starlight Research/`  
**Git 심볼릭 링크**: `Grok/Rostar/projects/byulbit-lab-v1` → 위 iCloud 경로

## 목표

1. 기관 소개 (상업 전환 아님)
2. 이달의 별자리 + 12별자리 이야기
3. 인포그래픽 허브 (자체 제작)
4. MBTI·에니어그램 정밀 자가분석 (비율·wing·tritype)
5. 세미나 — **현재 비노출** (2026-06-07: 홈 팝업 제거). 재개 시에도 팝업 또는 별도 안내 페이지로만, 결제·신청 인프라 없음

## 금지

- 레퍼런스 사이트 UI/카피 도용
- React/framer-motion/lucide 바이브 UI
- 메인에 참가비·정원·환불
- 세미나 팝업·신청 경로 임의 복구 (PRD 합의 전)

## 기술

- 정적 HTML + CSS + vanilla JS
- Mobile-first (320px~)
- 배경: opencli 스타일 WebGL (Three.js module)

## 문서

- `TOOLS_mbti_spec.md` — 4축 % 산출
- `TOOLS_enneagram_spec.md` — 9유형%·wing·tritype