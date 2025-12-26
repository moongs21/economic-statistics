# Git 설치 스크립트 (winget 사용)
# PowerShell을 관리자 권한으로 실행한 후 이 스크립트를 실행하세요

Write-Host "Git 설치를 시작합니다..." -ForegroundColor Green

# winget으로 Git 설치 시도
try {
    winget install --id Git.Git -e --source winget
    Write-Host "`nGit 설치가 완료되었습니다!" -ForegroundColor Green
    Write-Host "PowerShell을 다시 시작한 후 다음 명령어를 실행하세요:" -ForegroundColor Yellow
    Write-Host "  git --version" -ForegroundColor Cyan
} catch {
    Write-Host "`nwinget을 사용할 수 없습니다. 수동 설치를 진행하세요." -ForegroundColor Red
    Write-Host "https://git-scm.com/download/win 에서 다운로드하세요." -ForegroundColor Yellow
}

