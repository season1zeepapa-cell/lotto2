# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 프로젝트 개요

로또 번호 생성기 웹 애플리케이션 - 슬롯머신 애니메이션으로 1~45 범위의 로또 번호를 생성하는 정적 웹사이트입니다.

**프로젝트 규모**: 약 900줄 (HTML 452줄 + JavaScript 442줄)

## 개발 환경 설정

### 로컬 개발 서버 실행
정적 사이트이므로 빌드 과정이 필요 없습니다:
```bash
# Python 내장 서버로 실행 (포트 3001)
python3 -m http.server 3001
```

브라우저에서 `http://localhost:3001` 접속

### 배포
- **플랫폼**: Vercel (자동 배포)
- **트리거**: `main` 브랜치에 push 시 자동 배포
- **설정 파일**: `vercel.json` (정적 사이트 설정)

## 핵심 아키텍처

### 파일 구조
```
lotto2/
├── index.html       # 메인 HTML (Tailwind CSS 인라인)
├── client.js        # 전체 프론트엔드 로직
├── vercel.json      # Vercel 배포 설정
└── package.json     # Playwright 의존성만 포함
```

### 주요 함수 (client.js)

#### 1. `generateLottoNumbers()` (116번 줄)
- **역할**: 1~45 범위에서 중복 없이 6개의 랜덤 번호 생성
- **알고리즘**: `while` 루프 + `Set` 자료구조로 중복 제거
- **반환값**: 오름차순 정렬된 숫자 배열 `[3, 12, 25, 33, 41, 45]`

#### 2. `displayLottoNumbers(numbers, gameNumber)` (304번 줄)
- **역할**: 슬롯머신 애니메이션으로 번호를 순차적으로 표시
- **핵심 메커니즘**:
  - `setInterval(50ms)`: 각 공에 랜덤 숫자를 빠르게 회전
  - 순차 정지 지연: `1000ms + (index × 500ms)`
    - 1번째 공: 1초 후 정지
    - 2번째 공: 1.5초 후 정지
    - 3번째 공: 2초 후 정지
    - ...
  - 정지 시 `scale(1.2)` 애니메이션 (200ms 후 원래 크기로 복귀)

#### 3. `updateBallColor(ball, number)` (265번 줄)
- **역할**: 번호에 따라 로또 공 색상 지정
- **색상 규칙**:
  - 1~10: `bg-yellow-400` (노란색)
  - 11~20: `bg-blue-500` (파란색)
  - 21~30: `bg-red-500` (빨간색)
  - 31~40: `bg-gray-600` (회색)
  - 41~45: `bg-green-500` (초록색)

#### 4. `launchConfetti()` (41번 줄)
- **역할**: 모든 게임 완료 시 폭죽 효과 실행
- **라이브러리**: `canvas-confetti@1.9.0` (CDN)
- **효과**: 3초 동안 양쪽에서 로또 색상 폭죽 발사

### 전역 상태 관리
```javascript
let selectedGameCount = 1;       // 사용자가 선택한 게임 개수 (1~5)
let completedGamesCount = 0;     // 완료된 게임 수 (폭죽 트리거 조건)
let totalGamesCount = 0;         // 전체 게임 수
let isConfettiTriggered = false; // 폭죽 중복 실행 방지 플래그
```

## 스타일링 시스템

### Tailwind CSS
- **방식**: CDN 링크 (`https://cdn.tailwindcss.com`)
- **커스텀 CSS**: `index.html`의 `<style>` 태그에 3D 로또 공 스타일 정의
- **3D 효과 핵심**:
  - 방사형 그라디언트 (`radial-gradient`)
  - 다층 `box-shadow` (4단계 그림자)
  - `::before` 가상 요소로 하이라이트 표현

### 반응형 디자인
- 모바일/데스크톱 모두 지원
- Tailwind의 반응형 클래스 활용 (`md:`, `lg:` 등)

## 코드 스타일 규칙

### JavaScript
- **주석 언어**: 한국어 (초보자 교육용)
- **변수/함수명**: 영어 (표준 준수)
- **주석 스타일**: JSDoc 형식 + 단계별 상세 설명
- **예시**:
  ```javascript
  /**
   * 로또 번호를 생성하는 함수
   * @returns {number[]} 오름차순 정렬된 6개의 번호
   */
  function generateLottoNumbers() {
      // 1단계: 빈 Set 생성 (중복 방지용)
      const numbers = new Set();
      // ...
  }
  ```

### HTML
- **Tailwind 클래스**: 각 클래스에 한글 주석으로 설명
- **구조**: 시맨틱 태그 사용 (`<main>`, `<section>` 등)

### Git 커밋 메시지
- **언어**: 한국어
- **Co-Authored-By 필수**: `Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>`

## 주요 의존성

- **Tailwind CSS**: CDN (빌드 불필요)
- **canvas-confetti**: CDN (폭죽 효과)
- **Playwright**: `^1.58.0` (테스트용, 현재 미사용)

## 특이사항

1. **순수 정적 사이트**: 서버 없이 클라이언트 사이드만 사용
2. **교육용 코드**: 초보자를 위한 상세한 한글 주석이 핵심
3. **애니메이션 중심**: UX를 위한 타이밍 제어가 중요
   - 슬롯머신 회전 속도: 50ms
   - 공 정지 간격: 500ms
   - 폭죽 지속 시간: 3초
4. **번호 범위 고정**: 한국 로또 규격 (1~45, 6개 번호)

## 디버깅 팁

- **애니메이션 확인**: 브라우저 개발자 도구 콘솔에서 타이밍 확인
- **색상 테스트**: `updateBallColor()` 함수의 경계값 확인 (10, 20, 30, 40, 45)
- **폭죽 트리거**: `completedGamesCount === totalGamesCount` 조건 확인
