# Azure AD Redirect URI 설정 가이드

Azure AD 인증 오류 `AADSTS50011`를 해결하기 위한 가이드입니다.

## 오류 내용

```
AADSTS50011: The redirect URI 'https://aidesignlab-website-final-really-j7trzc3r4.vercel.app/api/auth/callback/azure-ad' 
specified in the request does not match the redirect URIs configured for the application.
```

이 오류는 Azure AD 앱 등록에 Vercel 배포 URL이 등록되지 않아서 발생합니다.

---

## 해결 방법

### 1단계: Vercel 배포 URL 확인

1. [Vercel 대시보드](https://vercel.com/dashboard) 접속
2. 프로젝트 선택
3. **Deployments** 탭에서 최신 배포 확인
4. 배포 URL 복사 (예: `https://aidesignlab-website-final-really-j7trzc3r4.vercel.app`)

또는 프로덕션 도메인이 있다면 해당 도메인 사용

### 2단계: Azure Portal에서 Redirect URI 추가

1. [Azure Portal](https://portal.azure.com) 접속
2. **Azure Active Directory** → **앱 등록(App registrations)** 이동
3. 앱 ID `b79da005-0791-485b-a2ea-1350c87c0574` 검색 또는 목록에서 선택
4. **인증(Authentication)** 메뉴 클릭
5. **플랫폼 추가(Add a platform)** 클릭
6. **웹(Web)** 선택
7. **리디렉션 URI(Redirect URIs)** 섹션에서 **URI 추가(Add URI)** 클릭
8. 다음 형식으로 URI 추가:
   ```
   https://[배포-도메인]/api/auth/callback/azure-ad
   ```
   
   예시:
   ```
   https://aidesignlab-website-final-really-j7trzc3r4.vercel.app/api/auth/callback/azure-ad
   ```

9. **저장(Save)** 클릭

### 3단계: 여러 환경 설정 (선택사항)

개발, 스테이징, 프로덕션 환경이 있다면 각각 추가:

```
# 개발 환경 (로컬)
http://localhost:3000/api/auth/callback/azure-ad

# Preview 배포 (Vercel)
https://aidesignlab-website-final-really-*.vercel.app/api/auth/callback/azure-ad

# 프로덕션 배포
https://aidesignlab-website-final-really-j7trzc3r4.vercel.app/api/auth/callback/azure-ad

# 커스텀 도메인 (있는 경우)
https://yourdomain.com/api/auth/callback/azure-ad
```

> 💡 **참고**: Vercel Preview 배포는 와일드카드(`*`)를 지원하지 않으므로, 각 Preview URL을 개별적으로 추가하거나 프로덕션 URL만 사용하는 것을 권장합니다.

### 4단계: 환경 변수 확인

Vercel 대시보드에서 다음 환경 변수가 설정되어 있는지 확인:

- `AZURE_AD_CLIENT_ID`: 앱 등록의 **애플리케이션(클라이언트) ID**
- `AZURE_AD_CLIENT_SECRET`: 앱 등록의 **클라이언트 암호** (만료일 확인 필요)
- `AZURE_AD_TENANT_ID`: 테넌트 ID (`b3dd55aa-4463-40c0-b948-6c81197e30ca`)
- `NEXTAUTH_URL`: 배포 URL (`https://aidesignlab-website-final-really-j7trzc3r4.vercel.app`)
- `NEXTAUTH_SECRET`: NextAuth 시크릿 키

### 5단계: 재배포 및 테스트

1. 환경 변수 변경 후 Vercel에서 재배포
2. 로그인 페이지에서 Azure AD 로그인 시도
3. 정상적으로 리디렉션되는지 확인

---

## 문제 해결

### 여전히 오류가 발생하는 경우

1. **캐시 확인**: 브라우저 캐시 및 쿠키 삭제 후 재시도
2. **URI 형식 확인**: 
   - `https://`로 시작해야 함
   - 끝에 `/`가 없어야 함
   - 대소문자 구분
3. **저장 확인**: Azure Portal에서 변경사항이 저장되었는지 확인
4. **클라이언트 시크릿 만료**: Azure Portal에서 새 시크릿 생성 후 Vercel 환경 변수 업데이트

### 클라이언트 시크릿 생성 방법

1. Azure Portal → 앱 등록 → **인증서 및 암호(Certificates & secrets)**
2. **새 클라이언트 암호(New client secret)** 클릭
3. 설명 입력 (예: "Vercel Production")
4. 만료 기간 선택
5. **추가(Add)** 클릭
6. **값(Value)** 복사 (한 번만 표시됨!)
7. Vercel 환경 변수 `AZURE_AD_CLIENT_SECRET` 업데이트

---

## 보안 권장사항

1. **프로덕션과 개발 환경 분리**: 별도의 Azure AD 앱 등록 사용 권장
2. **클라이언트 시크릿 로테이션**: 정기적으로 갱신
3. **허용된 이메일 도메인**: `ALLOWED_EMAIL_DOMAINS` 환경 변수로 제한
4. **HTTPS만 사용**: 프로덕션에서는 반드시 HTTPS 사용

---

## 참고 자료

- [Azure AD 앱 등록 가이드](https://docs.microsoft.com/azure/active-directory/develop/quickstart-register-app)
- [NextAuth.js Azure AD 설정](https://next-auth.js.org/providers/azure-ad)
- [Vercel 환경 변수 설정](https://vercel.com/docs/projects/environment-variables)

---

**마지막 업데이트**: 2026-02-20
