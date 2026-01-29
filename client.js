// ============================================
// 로또 번호 생성기 - 클라이언트 스크립트
// ============================================

// 전역 변수: 사용자가 선택한 게임 개수를 저장하는 변수
// 처음에는 1개로 설정해요
let selectedGameCount = 1;

// ============================================
// 폭죽 효과를 위한 전역 변수들
// ============================================

/**
 * 완료된 게임 수를 추적하는 변수
 * 모든 게임이 완료되면 폭죽을 실행하기 위해 사용해요
 */
let completedGamesCount = 0;

/**
 * 전체 게임 수 (사용자가 선택한 개수: 1~5)
 * 이 값과 completedGamesCount가 같아지면 폭죽!
 */
let totalGamesCount = 0;

/**
 * 폭죽이 이미 실행되었는지 확인하는 플래그
 * 중복 실행 방지용
 */
let isConfettiTriggered = false;

// ============================================
// 1단계: 화려한 폭죽 효과 함수
// ============================================

/**
 * 화려한 폭죽 효과를 실행하는 함수 🎆
 *
 * canvas-confetti 라이브러리를 사용하여
 * 로또 색상 테마(노랑, 파랑, 빨강, 초록)의 폭죽을 터뜨려요!
 */
function launchConfetti() {
    // 로또 공의 색상들을 16진수 색상 코드로 변환
    // 이 색상들이 폭죽에 사용됩니다!
    const lottoColors = [
        '#fbbf24',  // 노란색 (1~10번 공)
        '#3b82f6',  // 파란색 (11~20번 공)
        '#ef4444',  // 빨간색 (21~30번 공)
        '#22c55e'   // 초록색 (41~45번 공)
        // 회색(31~40번)은 화려함을 위해 제외
    ];

    // 폭죽 효과 설정
    const duration = 3000; // 3초 동안 폭죽이 터집니다
    const animationEnd = Date.now() + duration;

    // 랜덤 값을 생성하는 헬퍼 함수
    function randomInRange(min, max) {
        return Math.random() * (max - min) + min;
    }

    // 폭죽 애니메이션을 반복 실행하는 인터벌
    const interval = setInterval(function() {
        const timeLeft = animationEnd - Date.now();

        // 3초가 지나면 폭죽 멈춤
        if (timeLeft <= 0) {
            clearInterval(interval);
            return;
        }

        // 폭죽의 입자 개수 (시간이 지날수록 줄어듦)
        const particleCount = 50 * (timeLeft / duration);

        // 왼쪽에서 폭죽 발사! 🎆
        confetti({
            particleCount: particleCount,
            startVelocity: 30,           // 폭죽 속도
            spread: 360,                 // 360도 전방향으로 퍼짐
            origin: {
                x: randomInRange(0.1, 0.3), // 화면 왼쪽 10~30% 지점
                y: Math.random() - 0.2      // 화면 세로 랜덤 위치
            },
            colors: lottoColors          // 로또 색상 사용!
        });

        // 오른쪽에서도 폭죽 발사! 🎆
        confetti({
            particleCount: particleCount,
            startVelocity: 30,
            spread: 360,
            origin: {
                x: randomInRange(0.7, 0.9), // 화면 오른쪽 70~90% 지점
                y: Math.random() - 0.2
            },
            colors: lottoColors
        });
    }, 250); // 0.25초(250ms)마다 폭죽 발사

    console.log('🎉 폭죽 효과 실행!');
}

// ============================================
// 2단계: 로또 번호 생성 함수
// ============================================

/**
 * 로또 번호 한 세트(6개)를 생성하는 함수
 *
 * 작동 방식:
 * 1. 1부터 45까지의 숫자 중에서
 * 2. 중복 없이 6개를 랜덤하게 선택하고
 * 3. 작은 숫자부터 순서대로 정렬해요
 *
 * @returns {Array} 6개의 로또 번호가 담긴 배열 (예: [3, 12, 23, 31, 38, 42])
 */
function generateLottoNumbers() {
    // 빈 배열을 만들어요 - 여기에 번호들을 담을 거예요
    const numbers = [];

    // 6개의 번호를 뽑을 때까지 반복해요
    while (numbers.length < 6) {
        // 1부터 45 사이의 랜덤한 정수를 만들어요
        // Math.random()은 0~1 사이의 소수를 만들고
        // * 45를 하면 0~45 사이가 되고
        // + 1을 하면 1~46 사이가 되고
        // Math.floor()로 소수점을 버리면 1~45 정수가 돼요
        const randomNumber = Math.floor(Math.random() * 45) + 1;

        // 이미 뽑은 번호인지 확인해요
        // includes()는 배열에 특정 값이 있는지 true/false로 알려줘요
        if (!numbers.includes(randomNumber)) {
            // 새로운 번호면 배열에 추가해요
            numbers.push(randomNumber);
        }
        // 이미 있는 번호면 다시 반복해서 새 번호를 뽑아요
    }

    // 번호들을 작은 것부터 큰 순서로 정렬해요
    // sort()의 (a, b) => a - b 는 "숫자 오름차순 정렬"을 의미해요
    numbers.sort((a, b) => a - b);

    // 완성된 6개 번호를 반환해요
    return numbers;
}

// ============================================
// 2단계: 화면 요소를 찾아서 변수에 저장
// ============================================

// DOM이 완전히 로드된 후에 실행돼요
// 이렇게 하지 않으면 HTML 요소를 찾지 못할 수 있어요
document.addEventListener('DOMContentLoaded', function() {

    // HTML에서 필요한 요소들을 찾아요

    // 게임 개수 선택 버튼들 (1, 2, 3, 4, 5 버튼)
    // querySelectorAll은 해당하는 모든 요소를 찾아 배열처럼 반환해요
    const gameCountButtons = document.querySelectorAll('.game-count-btn');

    // "행운의 번호 생성하기" 버튼
    // querySelector는 해당하는 첫 번째 요소 하나만 찾아요
    const generateBtn = document.querySelector('#generateBtn');

    // 생성된 번호를 표시할 영역
    const resultsDiv = document.querySelector('#results');

    // ============================================
    // 3단계: 게임 개수 선택 버튼 이벤트 처리
    // ============================================

    /**
     * 각 게임 개수 버튼에 클릭 이벤트를 연결해요
     *
     * 실행 흐름:
     * 사용자가 버튼 클릭 → 해당 버튼만 강조 표시 → 선택된 개수 저장
     */
    gameCountButtons.forEach(function(button) {
        // 각 버튼마다 클릭했을 때 실행할 함수를 연결해요
        button.addEventListener('click', function() {

            // 1단계: 모든 버튼을 미선택 상태로 변경해요
            // (다른 버튼이 선택되어 있을 수 있으니까요)
            gameCountButtons.forEach(function(btn) {
                // 선택 클래스를 제거하고
                btn.classList.remove('game-btn-selected');
                // 미선택 클래스를 추가해요
                btn.classList.add('game-btn-unselected');
            });

            // 2단계: 클릭된 버튼만 선택 상태로 변경해요
            // 미선택 클래스를 제거하고
            this.classList.remove('game-btn-unselected');
            // 선택 클래스를 추가해요
            this.classList.add('game-btn-selected');

            // 3단계: 선택된 개수를 저장해요
            // 버튼의 data-count 속성에서 개수 값을 가져와요
            // getAttribute는 HTML 속성 값을 읽어와요
            // Number()로 문자열을 숫자로 변환해요
            selectedGameCount = Number(this.getAttribute('data-count'));

            // 개발자 도구 콘솔에 선택된 개수를 출력해요 (디버깅용)
            console.log('선택된 게임 수:', selectedGameCount);
        });
    });

    // 첫 번째 버튼(1개)을 기본으로 선택된 상태로 만들어요
    if (gameCountButtons.length > 0) {
        // 미선택 클래스를 제거하고
        gameCountButtons[0].classList.remove('game-btn-unselected');
        // 선택 클래스를 추가해요
        gameCountButtons[0].classList.add('game-btn-selected');
    }

    // ============================================
    // 4단계: 번호 생성 버튼 이벤트 처리
    // ============================================

    /**
     * "행운의 번호 생성하기" 버튼 클릭 시 실행
     *
     * 실행 흐름:
     * 버튼 클릭 → 선택된 개수만큼 번호 생성 → 화면에 표시
     */
    generateBtn.addEventListener('click', function() {
        console.log('번호 생성 시작! 게임 수:', selectedGameCount);

        // ============================================
        // 폭죽 효과를 위한 초기화
        // ============================================
        // 새로 생성할 때마다 카운터와 플래그를 리셋해요
        completedGamesCount = 0;           // 완료된 게임 수 0으로
        totalGamesCount = selectedGameCount;   // 총 게임 수 저장
        isConfettiTriggered = false;       // 폭죽 플래그 리셋

        // 결과 영역을 비워요 (이전 결과를 지우기 위해)
        resultsDiv.innerHTML = '';

        // 선택된 게임 수만큼 번호를 생성해요
        for (let i = 0; i < selectedGameCount; i++) {
            // 로또 번호 한 세트를 생성해요
            const lottoNumbers = generateLottoNumbers();

            // 생성된 번호를 화면에 표시하는 함수를 호출해요
            // i + 1은 게임 번호 (1번째, 2번째...)를 의미해요
            displayLottoNumbers(lottoNumbers, i + 1);
        }
    });
});

// ============================================
// 5단계: 번호를 화면에 표시하는 함수
// ============================================

/**
 * 번호 공의 색상을 업데이트하는 헬퍼 함수 (3D 스타일)
 *
 * 로또 번호 규칙에 따라 숫자 범위별로 다른 3D 그라디언트 색상을 적용해요!
 * 이제 평면 색상이 아니라 입체적인 그라디언트로 진짜 공처럼 보여요.
 * index.html의 <style> 태그에 정의된 .lotto-ball-* 클래스를 사용합니다.
 *
 * @param {HTMLElement} ball - 색상을 변경할 번호 공 요소
 * @param {Number} number - 1~45 사이의 로또 번호
 */
function updateBallColor(ball, number) {
    // 기존에 적용된 모든 3D 색상 클래스를 먼저 제거해요
    // 슬롯머신 회전 중에는 숫자가 계속 바뀌니까 색상도 계속 바뀌어야 해요!
    ball.classList.remove(
        'lotto-ball-yellow',    // 노란색 3D 그라디언트 클래스
        'lotto-ball-blue',      // 파란색 3D 그라디언트 클래스
        'lotto-ball-red',       // 빨간색 3D 그라디언트 클래스
        'lotto-ball-gray',      // 회색 3D 그라디언트 클래스
        'lotto-ball-green'      // 초록색 3D 그라디언트 클래스
    );

    // 번호 범위에 따라 3D 그라디언트 클래스를 추가해요
    // 각 클래스는 radial-gradient로 입체감을 표현합니다!
    if (number <= 10) {
        // 1~10: 노란색 3D 공 (밝은 노랑 → 중간 노랑 → 진한 주황)
        ball.classList.add('lotto-ball-yellow');
    } else if (number <= 20) {
        // 11~20: 파란색 3D 공 (하늘색 → 파랑 → 네이비)
        ball.classList.add('lotto-ball-blue');
    } else if (number <= 30) {
        // 21~30: 빨간색 3D 공 (핑크 → 빨강 → 와인색)
        ball.classList.add('lotto-ball-red');
    } else if (number <= 40) {
        // 31~40: 회색 3D 공 (밝은 회색 → 회색 → 진한 회색)
        ball.classList.add('lotto-ball-gray');
    } else {
        // 41~45: 초록색 3D 공 (연두 → 초록 → 진한 초록)
        ball.classList.add('lotto-ball-green');
    }
}

/**
 * 생성된 로또 번호를 카지노 슬롯머신 스타일로 화면에 표시하는 함수
 *
 * 숫자가 빠르게 돌아가다가 하나씩 순차적으로 멈추는 효과를 만들어요!
 *
 * @param {Array} numbers - 6개의 최종 로또 번호 배열
 * @param {Number} gameNumber - 게임 번호 (몇 번째 게임인지)
 */
function displayLottoNumbers(numbers, gameNumber) {
    // 결과를 표시할 영역을 찾아요
    const resultsDiv = document.querySelector('#results');

    // 하나의 게임 결과를 담을 div를 만들어요
    const gameDiv = document.createElement('div');

    // 이 div에 스타일 클래스를 추가해요
    // bg-gradient-to-r: 왼쪽에서 오른쪽으로 그라디언트
    // from-indigo-50 to-purple-50: 연한 남보라색 배경
    // p-6: 안쪽 여백 6단위
    // rounded-xl: 모서리를 둥글게
    // shadow-md: 중간 크기 그림자
    gameDiv.className = 'bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-md';

    // 게임 번호 제목을 만들어요 (예: "🎯 1번째 게임")
    const gameTitle = document.createElement('div');
    gameTitle.className = 'text-lg font-semibold text-gray-700 mb-3';
    gameTitle.textContent = `🎯 ${gameNumber}번째 게임`;

    // 번호들을 담을 컨테이너를 만들어요
    const numbersContainer = document.createElement('div');
    // flex: 가로로 나열
    // flex-wrap: 공간이 부족하면 다음 줄로 넘어감
    // gap-3: 요소들 사이 간격 3단위
    // justify-center: 가운데 정렬
    numbersContainer.className = 'flex flex-wrap gap-3 justify-center';

    // 6개의 번호 공이 카지노 슬롯머신처럼 돌아가는 효과! 🎰
    // forEach의 두 번째 매개변수 index를 사용해서 각 공마다 다른 시간에 멈춰요
    numbers.forEach(function(finalNumber, index) {
        // 1단계: 번호 공 요소를 만들어요 (div로 생성)
        const numberBall = document.createElement('div');

        // 3D 입체 공 클래스를 적용해요!
        // 이제 Tailwind 클래스 대신 index.html의 <style>에 정의된 .lotto-ball을 사용해요!
        // .lotto-ball 클래스에는 다음이 모두 포함되어 있어요:
        // - 크기 (56x56px)
        // - 원형 (border-radius: 50%)
        // - 중앙 정렬 (flexbox)
        // - 4단계 다층 그림자 (내부 그림자 + 바닥 그림자 + 테두리)
        // - ::before로 하이라이트(빛 반사) 효과
        // - 부드러운 바운스 애니메이션 (cubic-bezier)
        numberBall.className = 'lotto-ball';

        // 숫자를 담을 span 요소를 만들어요
        // 왜 span이 필요한가요?
        // → CSS의 ::before로 만든 하이라이트(빛 반사)와 숫자의 z-index를 분리하기 위해서예요!
        // → 이렇게 하면 숫자가 하이라이트 위에 선명하게 보입니다.
        const numberSpan = document.createElement('span');
        numberBall.appendChild(numberSpan);

        // 2단계: 번호 공을 즉시 컨테이너에 추가해요 (6개 모두 동시에 나타남)
        numbersContainer.appendChild(numberBall);

        // 3단계: 슬롯머신 회전 시작! 숫자가 빠르게 바뀌어요
        // 먼저 시작 숫자를 랜덤으로 정해요
        let currentNumber = Math.floor(Math.random() * 45) + 1;
        // numberBall 안의 span에 숫자를 표시해요 (하이라이트와 분리)
        numberSpan.textContent = currentNumber;
        updateBallColor(numberBall, currentNumber);

        // setInterval: 일정 간격(50ms)마다 함수를 반복 실행하는 타이머예요
        // 이걸로 숫자가 계속 바뀌는 "회전" 효과를 만들어요!
        const spinInterval = setInterval(function() {
            // 1부터 45 사이의 랜덤한 숫자를 만들어요
            currentNumber = Math.floor(Math.random() * 45) + 1;

            // 공에 표시된 숫자를 업데이트해요 (span에 표시)
            numberSpan.textContent = currentNumber;

            // 숫자에 맞는 3D 그라디언트 색상으로 변경해요
            // (노란색 → 파란색 → 빨간색 → 회색 → 초록색)
            updateBallColor(numberBall, currentNumber);

            // 이게 50ms(0.05초)마다 반복되니까 숫자가 엄청 빠르게 바뀌어 보여요!
            // 1초에 20번 바뀌니까 진짜 슬롯머신처럼 돌아가는 것 같죠? 🎰
        }, 50);

        // 4단계: 각 공을 순차적으로 멈춰요!
        // 첫 번째 공: 1초 후, 두 번째: 1.5초 후, 세 번째: 2초 후...
        // 계산식: 1000ms(1초) + (공의 순서 × 500ms)
        const stopDelay = 1000 + (index * 500);

        // setTimeout: 정해진 시간(stopDelay) 후에 한 번만 함수를 실행해요
        setTimeout(function() {
            // clearInterval: 반복 실행을 멈춰요
            // 이제 숫자 회전이 멈춰요!
            clearInterval(spinInterval);

            // 최종 번호를 설정해요 (이게 진짜 당첨 번호예요!)
            // span에 최종 숫자를 표시합니다
            numberSpan.textContent = finalNumber;

            // 최종 번호에 맞는 정확한 3D 그라디언트 색상을 적용해요
            updateBallColor(numberBall, finalNumber);

            // 5단계: 멈출 때 "딩!" 하면서 강조하는 효과
            // 공을 1.2배로 확대했다가
            numberBall.style.transform = 'scale(1.2)';

            // 0.2초 후에 다시 원래 크기로 돌아와요
            // 이렇게 하면 멈춘 공이 통통 튀는 것처럼 보여요!
            setTimeout(function() {
                numberBall.style.transform = 'scale(1)';

                // ============================================
                // 폭죽 효과 트리거 로직
                // ============================================
                // 이 게임의 마지막 공(6번째 공)이 멈췄을 때만 실행
                if (index === 5) {
                    // 완료된 게임 수를 1 증가시켜요
                    completedGamesCount++;

                    console.log(`게임 ${gameNumber} 완료! (${completedGamesCount}/${totalGamesCount})`);

                    // 모든 게임이 완료되었고, 아직 폭죽을 터뜨리지 않았다면
                    if (completedGamesCount === totalGamesCount && !isConfettiTriggered) {
                        // 폭죽 플래그를 true로 변경 (중복 실행 방지)
                        isConfettiTriggered = true;

                        // 약간의 딜레이 후 폭죽 실행 (공이 완전히 멈춘 후)
                        setTimeout(function() {
                            console.log('🎊 모든 게임 완료! 폭죽을 터뜨립니다!');
                            launchConfetti(); // 폭죽 함수 실행!
                        }, 300); // 300ms 딜레이 (여유 시간)
                    }
                }
            }, 200);
        }, stopDelay);
    });

    // 게임 div에 제목과 번호들을 추가해요
    gameDiv.appendChild(gameTitle);
    gameDiv.appendChild(numbersContainer);

    // 완성된 게임 div를 결과 영역에 추가해요
    resultsDiv.appendChild(gameDiv);
}
