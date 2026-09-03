# EmoLetter Frontend

React 19 + Vite + Tailwind. 백엔드(`../EmoLetter_BE`, Spring Boot)의 REST API를 호출한다.

## 실행

```bash
npm install
npm run dev     # http://localhost:5173
```

개발 서버는 `/api` 요청을 `VITE_BACKEND_ORIGIN`(기본 `http://localhost:8080`)으로 프록시한다.
같은 오리진으로 나가기 때문에 CORS 없이도 백엔드가 내려주는 httpOnly `refreshToken` 쿠키가 그대로 오간다.
설정을 바꾸려면 `.env.example`을 `.env`로 복사해서 값을 채운다.

## 디렉터리 구조

```
src/
  api/          # fetch 래퍼(http.js) + 도메인별 API 모듈, 백엔드 DTO -> 프런트 모델 변환
  constants/    # 감정/편지지 코드, 화면(View) 목록
  contexts/     # Auth / Diary / Letter 전역 상태 (API 호출은 여기서만)
  hooks/        # useAppNavigation, useLetterReader, useClickOutside
  utils/        # 날짜 포맷, 편지 도착 여부 판정
  components/
    common/     # Button, Card, Modal, TextField, FilterTabs, StatusMessage ...
    layout/     # Header, ViewRouter, AppLayout
    landing/    # Landing
    calendar/   # CalendarPage > CalendarNav / CalendarGrid > CalendarCell
    diary/      # DiaryWritePage > EmotionPicker
    letter/     # LetterWritePage, Sent/ReceivedLettersPage > LetterList > LetterCard
    auth/       # LoginModal > AuthTabs / LoginFields / SignupFields (+ useAuthForm)
    mypage/     # MyPage > ProfileSummary / StatCard / NicknameForm
```

컴포넌트는 화면을 조립만 하고, 서버 호출은 `contexts/` → `api/` 로만 내려간다.

## API 매핑

| 화면 | 호출 |
| --- | --- |
| 로그인 / 회원가입 | `POST /api/user/login`, `POST /api/user` |
| 로그아웃 | `DELETE /api/user/logout` |
| 세션 복구 / 마이페이지 | `GET /api/user`, `PUT /api/user/info` |
| 달력, 일기 쓰기 | `GET /api/diary`, `POST /api/diary`, `PUT /api/diary/{id}` |
| 편지 쓰기 | `POST /api/letter` |
| 보낸/받은 편지함 | `GET /api/letter?isOpened=true|false` (두 번 호출해 합침) |
| 편지 열기(읽음 처리) | `GET /api/letter/{id}` |

- 감정은 `Diary.emojiCode`(`HAPPY`, `SAD`, ...), 편지지는 `Letter.noteCode`(`PINK`, `PURPLE`, ...)로 주고받는다.
- 날짜는 백엔드 `LocalDateTime`에 맞춰 `YYYY-MM-DDTHH:mm:ss` 형식으로 보낸다. (`toISOString()`은 UTC로 밀리므로 쓰지 않는다.)
- `accessToken`은 `localStorage`에 두고 `Authorization: Bearer` 헤더로 붙인다.
  `refreshToken`은 httpOnly 쿠키라 JS가 읽을 수 없어서, 401이 오면 자동 재발급 대신 세션을 정리하고 다시 로그인받는다.
