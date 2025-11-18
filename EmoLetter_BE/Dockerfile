# 1단계: 빌드(Stage 1)
FROM gradle:8.5-jdk21 AS builder
WORKDIR /app

# 전체 복사 후 빌드
COPY . .
RUN gradle clean bootJar --no-daemon

# 2단계: 실행(Stage 2)
FROM eclipse-temurin:21-jre
WORKDIR /app

COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]
