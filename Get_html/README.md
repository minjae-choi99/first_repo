# 홍시 MPA 프로젝트

## 실행 방법
1. 이 폴더를 VS Code에서 엽니다.
2. `index.html`을 우클릭합니다.
3. **Open with Live Server**를 선택합니다.
4. 상단 네비게이션으로 각 페이지 이동을 확인합니다.

## 페이지 구성
- `index.html` : 메인 쉼터
- `profile.html` : 홍시 소개
- `diet.html` : 다이어트 전후 변화
- `gallery.html` : 홍시 사진 갤러리
- `game.html` : 마음 나눔
- `guestbook.html` : 편지 쓰기

## 공통 파일
- `navigation.html` : 1단계에서 확정한 공통 네비게이션 원본
- `css/style.css` : 모든 페이지가 공유하는 스타일
- `js/common.js` : 모바일 메뉴와 페이지별 인터랙션 코드

## 네비게이션 유지 원칙
각 HTML 파일 안의 `<!-- 공통 네비게이션 바 -->` 부분은 모두 동일합니다.
현재 페이지 강조는 `<body data-page="...">` 값과 `data-nav-page`를 비교해 자동 적용합니다.
따라서 메뉴 디자인을 바꿀 때는 모든 페이지에 같은 네비게이션 코드를 반영해야 합니다.
