# IMF API 접근 제한 문제 해결 방안

## 🔍 문제 진단

502 Bad Gateway 오류는 다음과 같은 이유로 발생할 수 있습니다:

### 가능한 원인들:

1. **IMF API 정책**
   - IMF API가 외부 서버(Netlify Functions)에서의 호출을 차단
   - 브라우저에서 직접 접근만 허용할 수 있음
   - API 키나 인증이 필요할 수 있음

2. **Netlify Functions 제한**
   - Netlify의 아웃바운드 연결이 제한될 수 있음
   - 특정 도메인에 대한 접근이 차단될 수 있음

3. **네트워크 보안 정책**
   - 사내 네트워크나 보안 정책에 의해 차단
   - 방화벽 규칙에 의해 차단

## ✅ 적용된 해결책

### 1. 향상된 샘플 데이터
- 랜덤 데이터 대신 **현실적인 범위의 데이터** 생성
- 지표별로 적절한 데이터 범위 설정:
  - GDP 성장률: -2% ~ 8%
  - 인플레이션율: 0% ~ 5%
  - 실업률: 2% ~ 12%
  - GDP: 1조 ~ 50조
  - 경상수지: -5% ~ 5%
- 연도별 추세를 반영한 데이터 생성

### 2. 명확한 사용자 안내
- API 접근 실패 시 명확한 메시지 표시
- 샘플 데이터임을 명시
- 문제 원인 설명

### 3. 자동 폴백
- API 호출 실패 시 자동으로 샘플 데이터 표시
- 사용자는 데모 기능을 계속 사용 가능

## 🚀 대안 해결책

### 방안 1: 다른 공개 경제 데이터 API 사용

다음과 같은 대안 API를 고려할 수 있습니다:

1. **World Bank API**
   - URL: `https://api.worldbank.org/v2/`
   - 공개 API, 무료 사용 가능
   - 다양한 경제 지표 제공

2. **FRED API (Federal Reserve Economic Data)**
   - URL: `https://api.stlouisfed.org/fred/`
   - API 키 필요 (무료 등록 가능)
   - 미국 및 글로벌 경제 데이터

3. **OECD API**
   - URL: `https://stats.oecd.org/`
   - 공개 데이터 제공

### 방안 2: 정적 데이터 파일 사용

IMF에서 제공하는 CSV나 JSON 파일을 다운로드하여:
- 프로젝트에 포함
- 또는 GitHub에 저장하여 직접 호출

### 방안 3: IMF API 직접 테스트

브라우저에서 직접 테스트:
```
https://www.imf.org/external/datamapper/api/v1/LUR/KR?periods=2015-2024
```

이 URL이 브라우저에서 작동한다면:
- IMF API는 공개되어 있음
- 문제는 Netlify Functions의 아웃바운드 연결 제한일 가능성

## 📝 현재 상태

현재 코드는:
- ✅ API 호출 시도
- ✅ 실패 시 자동으로 샘플 데이터 표시
- ✅ 사용자에게 명확한 안내 메시지 제공
- ✅ 데모 기능은 정상 작동

## 💡 권장 사항

1. **즉시 사용 가능**: 현재 샘플 데이터로 데모 기능 사용
2. **장기 해결책**: 
   - World Bank API 같은 다른 공개 API 사용
   - 또는 IMF API 접근 권한 확인

3. **프로덕션 환경**:
   - 실제 데이터가 필요한 경우, 다른 데이터 소스 사용
   - 또는 IMF API 접근 권한 획득

## 🔗 참고 자료

- [World Bank API 문서](https://datahelpdesk.worldbank.org/knowledgebase/articles/889392)
- [FRED API 문서](https://fred.stlouisfed.org/docs/api/)
- [IMF Data Portal](https://www.imf.org/external/datamapper/)

