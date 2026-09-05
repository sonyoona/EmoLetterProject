# EmoLetter

하루의 감정을 이모지와 함께 달력에 기록하고, 미래의 나에게 편지를 보내
정해둔 날짜가 되면 받아보는 서비스입니다.

프론트엔드와 백엔드를 한 저장소에 둔 모노리포이며, **로컬 연동까지 완료한 상태**입니다.

<br>

## 기술 스택

| 영역 | 스택 |
| --- | --- |
| Frontend | React 19, Vite 6, Tailwind CSS 3 |
| Backend | Spring Boot 3.2, Java 21, JPA, Spring Security, JWT |
| Database | MySQL 8, Redis |
| CI/CD | GitHub Actions, DockerHub |

<br>

## 주요 기능

- **감정 일기** — 8가지 이모지로 하루를 기록하고 달력에서 한눈에 확인
- **타임캡슐 편지** — 지정한 날짜에 도착하는 편지. 도착 여부와 열람 여부를 분리해 관리
- **인증** — accessToken + httpOnly 쿠키 refreshToken 방식. 만료 시 자동 재발급 후 원래 요청 재시도

<br>

## 저장소 구조

```
EmoLetterProject/
├─ EmoLetter_FE/       # React 프론트엔드
├─ EmoLetter_BE/       # Spring Boot REST API
├─ .github/workflows/  # 배포 파이프라인
└─ docs/               # 개발 문서
```

<br>

## 직접 해결한 문제

개발하며 마주친 문제와, 왜 그렇게 고쳤는지를 기록해 두었습니다.
전체 내역은 [개발 문서](docs/DEVELOPMENT.md)에 있고, 대표적인 세 가지만 옮깁니다.

### 1. 인증 실패에 403이 나가 토큰 재발급이 동작하지 않던 문제

프론트는 401을 받아야 재발급을 시도하는데 서버가 403을 반환하고 있었습니다.
`HttpStatusEntryPoint(401)`을 지정해 인증 실패를 401로 통일하고, 재발급 흐름이 동작하도록 맞췄습니다.

동시에 `/error`를 permitAll로 열어, 서버 오류(500)가 401로 둔갑해 원인이 가려지던 것도 함께 해결했습니다.

### 2. 응답에 비밀번호 해시가 실려 나가던 문제

편지 저장 API가 엔티티를 그대로 반환하면서 연관된 사용자 정보까지 직렬화되고 있었습니다.
`LetterResponse` DTO를 만들어 필요한 필드만 내보내도록 바꿨습니다.

### 3. 남의 리소스에 접근할 수 있던 문제

일기·편지의 단건 조회, 수정, 삭제가 각각 다른 방식으로 소유자를 확인하고 있었습니다.
`findOwnedDiary` / `findOwnedLetter`로 통일해, 남의 번호를 넣으면 존재하지 않는 리소스와 동일하게 처리되도록 했습니다.

<br>

## 실행 방법

Docker 없이 로컬에서 띄우는 순서입니다.

```bash
# 1. MySQL이 3306에서 실행 중인지 확인 (.env의 DATABASE_DB 이름으로 DB 생성)

# 2. Redis 기동 (WSL, 최초 1회만 등록)
wsl -u root -- systemctl enable --now redis-server

# 3. 백엔드 — .env를 읽어 기동
cd EmoLetter_BE && ./run-local.ps1

# 4. 프론트엔드
cd EmoLetter_FE && npm install && npm run dev   # http://localhost:5173
```

> 스프링이 `.env`를 스스로 읽지 않아 `run-local.ps1`이 환경변수로 주입합니다.
> IntelliJ에서는 `EmoLetter BE (local)` 실행 구성을 사용하세요.

자세한 설정은 [개발 문서 — 실행 방법](docs/DEVELOPMENT.md#실행-방법)을 참고하세요.

<br>

## 현재 상태

로컬 환경에서 프론트엔드와 백엔드 연동을 검증한 단계이며, 아래는 아직 남아 있는 과제입니다.

| 항목 | 내용 |
| --- | --- |
| refreshToken 회전 | 재발급 시 accessToken만 갱신합니다. 24시간 후 재로그인이 필요합니다 |
| 로그아웃 즉시 차단 | 발급된 accessToken을 서버가 회수할 수 없습니다. Redis 블랙리스트를 검토 중이며, 매 요청 조회 비용과의 트레이드오프가 있습니다 |
| 배포 파이프라인 | EC2/DockerHub 배포가 중단되어 트리거를 `workflow_dispatch`로 막아둔 상태입니다 |

<br>

---

**상세 문서** — [개발 문서](docs/DEVELOPMENT.md) · [JWT 필터 체인 해부](docs/jwt-filter-chain.html)
