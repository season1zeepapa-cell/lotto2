# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

로또 번호 생성기 웹 애플리케이션 - 사용자가 원하는 개수의 로또 번호를 생성하고, 슬롯머신 애니메이션으로 표시하는 정적 웹사이트입니다.

**프로젝트 규모**: 약 450줄 (HTML 152줄 + JavaScript 297줄)

## 핵심 아키텍처

### 파일 구조
- `index.html`: 메인 HTML 파일 (Tailwind CSS 사용)
- `client.js`: 프론트엔드 JavaScript 로직
- `vercel.json`: Vercel 배포 설정

### 주요 컴포넌트

#### 1. 번호 생성 로직 (`generateLottoNumbers()`)
- 1~45 범위에서 중복 없이 6개의 랜덤 번호 생성
- 오름차순 정렬하여 반환

#### 2. 슬롯머신 애니메이션 시스템 (`displayLottoNumbers()`)
- 50ms 간격으로 랜덤 숫자를 회전시키는 `setInterval`
- 각 번호를 순차적으로 멈추는 지연 효과 (공식: 1000ms + index × 500ms)
  - 1번째 공: 1초 후, 2번째 공: 1.5초 후, 3번째 공: 2초 후...
- 멈출 때 scale(1.2) 애니메이션으로 강조 (200ms 후 원래 크기로 복귀)

#### 3. 색상 시스템 (`updateBallColor()`)
- 1~10: 노란색 (`bg-yellow-400`)
- 11~20: 파란색 (`bg-blue-500`)
- 21~30: 빨간색 (`bg-red-500`)
- 31~40: 회색 (`bg-gray-600`)
- 41~45: 초록색 (`bg-green-500`)

## 개발 명령어

### 로컬 개발
정적 사이트이므로 별도의 빌드 과정이 없습니다. 로컬 서버로 바로 실행:
```bash
# 파이썬 내장 서버 사용 (포트 3001)
python3 -m http.server 3001
```

### 배포
Vercel을 통한 자동 배포:
- main 브랜치에 push하면 자동으로 배포됨
- `vercel.json`에 정적 사이트 설정이 되어 있음

## 코드 스타일 규칙

### HTML/CSS
- Tailwind CSS 유틸리티 클래스만 사용 (별도 CSS 파일 없음)
- 각 Tailwind 클래스에 한글 주석으로 설명 추가
- 시각적 효과 설명 시 비유 사용 (예: "상자 테두리에서 멀어지는 거리")

### JavaScript
- 초보자도 이해할 수 있도록 상세한 한글 주석 작성
- 각 함수 앞에 JSDoc 스타일 설명 추가
- 복잡한 로직은 단계별로 주석 구분
- 변수/함수명은 영어, 주석은 한국어

### Git 커밋 메시지
- 한국어로 작성
- Co-Authored-By 태그 사용

## 주요 기술 스택

- **프론트엔드**: Vanilla JavaScript, Tailwind CSS (CDN)
- **테스팅**: Playwright ^1.58.0
- **배포**: Vercel (정적 사이트 호스팅)
- **패키지 관리**: npm (CommonJS)

## 특이사항

1. **정적 사이트**: 서버 없이 순수 클라이언트 사이드로만 동작
2. **애니메이션 중심**: 사용자 경험을 위한 슬롯머신 효과가 핵심
3. **교육용 주석**: 코드 전체에 초보자를 위한 상세한 설명이 포함됨

---

## 배포 테스트 이력

### 2026-01-29: Git → Vercel 자동 배포 점검
- `.gitignore` 파일 업데이트 (Node.js 표준 항목 추가)
- 자동 배포 작동 확인을 위한 테스트 커밋
- 예상 흐름: Git push → GitHub webhook → Vercel 자동 배포
