# GitHub 업로드 가이드

## 📚 Git과 GitHub란?

### Git
- **로컬 버전 관리 시스템**: 파일 변경 이력을 추적하는 도구
- 컴퓨터에 설치하여 사용하는 프로그램

### GitHub
- **온라인 저장소**: Git으로 관리하는 프로젝트를 클라우드에 저장하는 서비스
- 다른 사람과 협업하거나 여러 기기에서 접근할 수 있게 해줍니다

## 🔧 Git 설치하기

### Windows에서 Git 설치

1. **Git 공식 웹사이트 방문**
   - https://git-scm.com/download/win
   - 자동으로 다운로드가 시작됩니다

2. **설치 프로그램 실행**
   - 다운로드한 `.exe` 파일을 실행
   - 기본 설정으로 "Next"를 계속 클릭
   - 설치 완료 후 컴퓨터 재시작 권장

3. **설치 확인**
   - PowerShell 또는 명령 프롬프트를 열고:
   ```bash
   git --version
   ```
   - 버전 번호가 나오면 설치 완료!

## 📝 GitHub에 업로드하는 단계별 가이드

### 1단계: GitHub 계정 만들기 (아직 없다면)

1. https://github.com 접속
2. "Sign up" 클릭하여 계정 생성

### 2단계: GitHub에 새 저장소(Repository) 만들기

1. GitHub에 로그인
2. 오른쪽 상단의 "+" 버튼 클릭 → "New repository"
3. 저장소 이름 입력 (예: `imf-economic-dashboard`)
4. "Public" 또는 "Private" 선택
5. **"Initialize this repository with a README" 체크 해제** (이미 README.md가 있으므로)
6. "Create repository" 클릭

### 3단계: 로컬 프로젝트를 Git 저장소로 만들기

PowerShell 또는 명령 프롬프트에서 프로젝트 폴더로 이동:

```bash
cd C:\Users\cheong.moon.kee\.cursor\Study\251226_IMF
```

#### 3-1. Git 저장소 초기화
```bash
git init
```
→ 현재 폴더를 Git 저장소로 만듭니다

#### 3-2. 파일 추가 (스테이징)
```bash
git add .
```
→ **의미**: 현재 폴더의 모든 변경된 파일을 "커밋 준비 완료" 상태로 만듭니다
→ `.`은 "현재 폴더의 모든 파일"을 의미합니다

#### 3-3. 변경사항 저장 (커밋)
```bash
git commit -m "Add Netlify Functions to fix CORS issue"
```
→ **의미**: 준비된 파일들을 하나의 "저장 지점"으로 저장합니다
→ `-m` 뒤의 텍스트는 이번 변경사항에 대한 설명입니다
→ 예: "첫 번째 버전", "CORS 문제 수정" 등

#### 3-4. GitHub 저장소 연결
```bash
git remote add origin https://github.com/당신의사용자명/저장소이름.git
```
→ **의미**: 로컬 저장소와 GitHub 저장소를 연결합니다
→ `당신의사용자명`과 `저장소이름`을 실제 값으로 변경하세요
→ 예: `https://github.com/johndoe/imf-economic-dashboard.git`

#### 3-5. GitHub에 업로드 (푸시)
```bash
git branch -M main
git push -u origin main
```
→ **의미**: 로컬에 저장한 변경사항을 GitHub에 업로드합니다
→ `git branch -M main`: 기본 브랜치를 "main"으로 설정
→ `git push`: 실제로 업로드하는 명령어

### 4단계: 인증 (첫 번째 푸시 시)

첫 번째 `git push`를 실행하면 GitHub 로그인을 요청합니다:
- 사용자 이름 입력
- 비밀번호 대신 **Personal Access Token** 입력 필요
  - GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
  - "Generate new token" 클릭
  - 권한 선택: `repo` 체크
  - 생성된 토큰을 복사하여 비밀번호 대신 입력

## 🔄 이후 변경사항 업로드하기

파일을 수정한 후에는 다음 명령어만 실행하면 됩니다:

```bash
git add .
git commit -m "변경사항 설명"
git push
```

## 📋 명령어 요약

| 명령어 | 의미 | 언제 사용? |
|--------|------|-----------|
| `git init` | Git 저장소 만들기 | 처음 한 번만 |
| `git add .` | 변경된 파일 준비하기 | 파일 수정 후 |
| `git commit -m "메시지"` | 변경사항 저장하기 | 파일 준비 후 |
| `git push` | GitHub에 업로드하기 | 저장 후 |
| `git status` | 현재 상태 확인하기 | 언제든지 |

## 🎯 간단한 비유

- **`git add .`**: "이 파일들을 포장 상자에 넣겠습니다"
- **`git commit`**: "포장 상자를 봉인하고 라벨을 붙입니다"
- **`git push`**: "포장 상자를 택배로 보냅니다 (GitHub로)"

## 💡 팁

- 커밋 메시지는 명확하게 작성하세요
  - 좋은 예: "CORS 문제 해결을 위해 Netlify Functions 추가"
  - 나쁜 예: "수정", "변경"
- 자주 커밋하고 푸시하는 것이 좋습니다
- 실수해도 걱정 마세요! Git은 이전 버전으로 돌아갈 수 있습니다

## 🆘 문제 해결

### "fatal: not a git repository" 오류
→ `git init`을 먼저 실행하세요

### "fatal: remote origin already exists" 오류
→ 이미 연결되어 있습니다. `git push`만 실행하세요

### "Permission denied" 오류
→ GitHub 인증을 확인하세요 (Personal Access Token 사용)

