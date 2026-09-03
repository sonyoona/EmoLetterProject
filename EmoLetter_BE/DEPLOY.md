# 배포 구성 기록 (현재 중단 상태)

로컬 개발로 전환하면서 Docker 실행을 쓰지 않기로 했다.
나중에 배포를 다시 살릴 때를 위해 기존 구성을 여기에 남겨둔다. **파일은 아무것도 지우지 않았다.**

## 배포 흐름 (GitHub Actions)

`dev` 브랜치에 push하면 [.github/workflows/gradle.yml](../.github/workflows/gradle.yml)이 돈다.

1. JDK 21 세팅 → DockerHub 로그인
2. `EmoLetter_BE/Dockerfile`로 이미지 빌드 → `<DOCKERHUB_USERNAME>/spring-be:latest` push
3. `EmoLetter_BE/docker-compose.yml`을 EC2의 `~/app/`으로 SCP
4. EC2에 SSH 접속 →
   - `SPRING_ENV_FILE` 시크릿 내용을 `.env`로 기록
   - 기존 `spring-be` / `redis` / `mysql` 컨테이너 제거
   - 최신 이미지 pull → `docker compose up -d`

> **주의:** 트리거가 `push: branches: ["dev"]`이고 현재 작업 브랜치가 `dev`다.
> 배포를 원치 않는 상태에서 push하면 워크플로가 돈다. 필요하면 워크플로를 비활성화하거나
> 트리거를 `workflow_dispatch`로 바꿔둘 것.

## 필요한 GitHub Secrets

`DOCKERHUB_USERNAME`, `DOCKERHUB_TOKEN`, `EC2_HOST`, `EC2_USER`, `EC2_SSH_KEY`, `SPRING_ENV_FILE`

## docker-compose.yml 관련 주의

`spring-be` 서비스가 `image: ${DOCKERHUB_USERNAME}/spring-be:latest`로 되어 있다.
즉 **DockerHub에 올라간 이미지를 받아오는 것**이라, 로컬 코드 수정분은 반영되지 않는다.
로컬에서 컨테이너로 띄워 보고 싶다면 그 부분을 아래처럼 바꿔야 한다.

```yaml
  spring-be:
    build: .          # image: ... 대신
```

## 지금의 로컬 실행 방식 (Docker 미사용)

| 구성요소 | 실행 방법 |
| --- | --- |
| MySQL | 윈도우에 설치된 것을 그대로 사용 (3306) |
| Redis | WSL(Ubuntu-22.04) 안에서 실행 (6379) |
| Spring | IntelliJ 실행 구성 `EmoLetterBeApplication` |
| Frontend | `cd EmoLetter_FE && npm run dev` (5173 → /api 프록시 → 8080) |

Redis 실행 (WSL 안에서):

```bash
redis-server --bind 0.0.0.0 --protected-mode no --daemonize yes --dir /tmp --pidfile /tmp/redis.pid
```

환경변수는 `EmoLetter_BE/.env`를 실행 구성이 직접 읽는다(`envFilePaths`).
