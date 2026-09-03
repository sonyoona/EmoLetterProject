# Docker 없이 로컬에서 스프링을 띄운다.
# 사용법:  PowerShell에서  .\run-local.ps1
#
# 전제:
#   - MySQL 3306 실행 중
#   - Redis 6379 실행 중 (WSL에서: redis-server --bind 0.0.0.0 --protected-mode no --daemonize yes --dir /tmp --pidfile /tmp/redis.pid)

$ErrorActionPreference = "Stop"
Set-Location $PSScriptRoot

# 스프링 로그에 한글이 섞여 있어 콘솔을 UTF-8로 맞춘다. (기본 cp949면 깨진다)
try {
    [Console]::OutputEncoding = [System.Text.Encoding]::UTF8
    $OutputEncoding = [System.Text.Encoding]::UTF8
} catch {}

$envPath = Join-Path $PSScriptRoot ".env"
if (-not (Test-Path $envPath)) {
    Write-Host ".env 파일이 없습니다: $envPath" -ForegroundColor Red
    exit 1
}

# .env를 읽어 환경변수로 설정한다. (CRLF/주석/따옴표 처리)
$loaded = @()
foreach ($line in Get-Content $envPath) {
    $t = $line.Trim()
    if ($t -eq "" -or $t.StartsWith("#")) { continue }
    if ($t -match '^([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
        $key = $matches[1]
        $val = $matches[2].Trim().Trim('"').Trim("'")
        [Environment]::SetEnvironmentVariable($key, $val, "Process")
        $loaded += $key
    }
}
Write-Host ("환경변수 " + $loaded.Count + "개 로드: " + ($loaded -join ", ")) -ForegroundColor DarkGray

function Test-Port($port) {
    (Test-NetConnection -ComputerName 127.0.0.1 -Port $port -WarningAction SilentlyContinue).TcpTestSucceeded
}

# --- Redis 깨우기 -------------------------------------------------------
# WSL2는 1분 정도 아무도 쓰지 않으면 가상머신을 통째로 내린다. 그때 그 안에서 돌던
# Redis도 함께 사라진다. WSL에 명령을 하나 보내면 다시 부팅되고,
# redis-server가 systemd 서비스로 등록돼 있으므로 자동으로 따라 올라온다.
#   등록해두지 않았다면 한 번만:
#   wsl -u root -- systemctl enable --now redis-server
if (-not (Test-Port 6379)) {
    if (Get-Command wsl.exe -ErrorAction SilentlyContinue) {
        Write-Host "Redis가 응답하지 않습니다. WSL을 깨우는 중..." -ForegroundColor DarkGray
        try {
            # -d 를 생략해 기본 배포판을 쓴다. (이미 켜져 있으면 아무 일도 일어나지 않는다)
            wsl.exe -u root -- systemctl start redis-server 2>&1 | Out-Null
        } catch {
            Write-Host "  WSL 명령 실행에 실패했습니다: $($_.Exception.Message)" -ForegroundColor DarkGray
        }
        # 부팅과 포트 포워딩이 잡힐 때까지 최대 5초 기다린다.
        for ($i = 0; $i -lt 10 -and -not (Test-Port 6379); $i++) {
            Start-Sleep -Milliseconds 500
        }
    }
}

# --- 의존 서비스 확인 ---------------------------------------------------
$allOk = $true
foreach ($svc in @(@{n="MySQL"; p=3306}, @{n="Redis"; p=6379})) {
    if (Test-Port $svc.p) {
        Write-Host ("  [OK]   " + $svc.n + " " + $svc.p) -ForegroundColor Green
    } else {
        $allOk = $false
        Write-Host ("  [FAIL] " + $svc.n + " " + $svc.p + " 에 접속할 수 없습니다") -ForegroundColor Red
        if ($svc.p -eq 6379) {
            Write-Host "         WSL에서 직접 확인해보세요:" -ForegroundColor DarkGray
            Write-Host "         wsl -u root -- systemctl status redis-server" -ForegroundColor DarkGray
            Write-Host "         wsl -u root -- systemctl enable --now redis-server" -ForegroundColor DarkGray
        } else {
            Write-Host "         MySQL 서비스가 실행 중인지 확인하세요." -ForegroundColor DarkGray
        }
    }
}

if (-not $allOk) {
    Write-Host "`n의존 서비스가 준비되지 않았습니다. 그대로 기동하면 로그인 등이 503으로 실패합니다." -ForegroundColor Yellow
}

# --- WSL 붙잡아 두기 -----------------------------------------------------
# 위에서 깨워도 WSL은 1분쯤 놀면 다시 내려간다. 그러면 서버가 도는 도중에 Redis가
# 끊겨 로그인이 503으로 실패한다. 전역 설정(.wslconfig)을 건드리는 대신,
# 이 스크립트가 사는 동안만 WSL 안에 프로세스를 하나 띄워 VM을 붙잡아 둔다.
# 혹시 정리에 실패해도 8시간 뒤에는 스스로 사라진다.
$keepAlive = $null
if (Get-Command wsl.exe -ErrorAction SilentlyContinue) {
    try {
        $keepAlive = Start-Process wsl.exe -ArgumentList '-e','sleep','28800' `
                                   -WindowStyle Hidden -PassThru
        Write-Host "  WSL 유지 프로세스 시작 (PID $($keepAlive.Id))" -ForegroundColor DarkGray
    } catch {
        Write-Host "  WSL 유지 프로세스를 띄우지 못했습니다: $($_.Exception.Message)" -ForegroundColor DarkGray
    }
}

Write-Host "`nSpring Boot 기동 중... (중지: Ctrl+C)`n" -ForegroundColor Cyan
try {
    & .\gradlew.bat bootRun --console=plain
} finally {
    if ($keepAlive -and -not $keepAlive.HasExited) {
        Stop-Process -Id $keepAlive.Id -Force -ErrorAction SilentlyContinue
        Write-Host "WSL 유지 프로세스를 정리했습니다." -ForegroundColor DarkGray
    }
}
