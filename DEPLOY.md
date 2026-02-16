# 실시간 배포 가이드

코드 수정 후 **푸시만 하면 자동으로 배포**되어 웹사이트에서 바로 확인할 수 있도록 설정하는 방법입니다.

---

## 모노레포 구조 배포 (현재 프로젝트)

이 프로젝트는 **모노레포 구조**입니다:
- `apps/web/` - Next.js 프론트엔드
- `apps/api/` - FastAPI 백엔드 (별도 배포 필요)

Vercel은 **프론트엔드(`apps/web`)만 배포**합니다.

---

## 1. Vercel로 실시간 배포 (권장)

### 1) 모노레포 프로젝트 설정 (최초 1회 또는 구조 변경 시)

#### 방법 A: Vercel 대시보드에서 설정 (권장)

1. [vercel.com](https://vercel.com) 접속 후 로그인
2. 프로젝트 선택 → **Settings** → **General**
3. **Root Directory** 섹션에서 **Edit** 클릭
4. `apps/web` 입력 후 **Save**
5. Vercel이 자동으로 `apps/web`을 프로젝트 루트로 인식

#### 방법 B: vercel.json 파일 사용 (코드로 관리)

프로젝트 루트에 `vercel.json` 파일이 이미 생성되어 있습니다:

```json
{
  "rootDirectory": "apps/web",
  "buildCommand": "npm run build:web",
  "outputDirectory": "apps/web/.next",
  "framework": "nextjs"
}
```

이 파일이 있으면 Vercel이 자동으로 모노레포 구조를 인식합니다.

### 2) Vercel 연결 (최초 1회)

1. [vercel.com](https://vercel.com) 접속 후 로그인
2. **Add New** → **Project**
3. **Import Git Repository**에서 이 프로젝트의 GitHub 저장소 선택
4. **Framework Preset**: Next.js 자동 감지
5. **Root Directory**: `apps/web` (위에서 설정했거나 `vercel.json`이 있으면 자동 인식)
6. **Environment Variables**에 배포 환경에 필요한 값 추가:
   - `NEXTAUTH_URL`: Vercel이 부여한 도메인 (예: `https://프로젝트명.vercel.app`)
   - `NEXTAUTH_SECRET`: 시크릿 키
   - `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`: Azure AD 설정
   - `ALLOWED_EMAIL_DOMAINS`: 허용된 이메일 도메인 (예: `hdec.co.kr`)
7. **Deploy** 클릭

### 3) 실시간 배포 흐름

- **main** 브랜치에 `git push` → 프로덕션 사이트가 자동으로 최신 코드로 배포됨
- 보통 1~2분 내에 배포 완료 후, 해당 웹사이트에서 수정 사항 확인 가능

```bash
git add .
git commit -m "fix: 로그인 문구 수정"
git push origin main
```

- 다른 브랜치에 푸시하면 **Preview URL**이 생성되어, main에 머지 전 미리 확인 가능

---

## 2. 기존 Vercel 프로젝트 업데이트 (모노레포로 변경한 경우)

기존에 루트 기준으로 배포하던 프로젝트를 모노레포로 변경한 경우:

1. Vercel 대시보드 → 프로젝트 → **Settings** → **General**
2. **Root Directory** 섹션에서 **Edit** 클릭
3. `apps/web` 입력 후 **Save**
4. 다음 배포부터 자동으로 `apps/web` 기준으로 빌드됨

또는 프로젝트 루트의 `vercel.json` 파일이 있으면 자동으로 적용됩니다.

---

## 3. Netlify로 실시간 배포

1. [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. 저장소 연결 후 빌드 설정:
   - **Base directory**: `apps/web`
   - **Build command**: `npm run build` (또는 `npm run build:web` 루트에서)
   - **Publish directory**: `apps/web/.next` (Next.js는 보통 **Vercel** 또는 **Netlify Next.js runtime** 사용 권장)
3. 환경 변수 설정 후 배포
4. 이후 **main**에 푸시할 때마다 자동 재배포

---

## 4. 배포 확인 체크리스트

배포 전 확인사항:

- [ ] `vercel.json`에 `rootDirectory: "apps/web"` 설정되어 있음
- [ ] 또는 Vercel 대시보드에서 Root Directory가 `apps/web`으로 설정됨
- [ ] 환경 변수 설정 완료 (NEXTAUTH_URL, AZURE_AD_* 등)
- [ ] Azure AD 앱 등록에 배포 도메인 리디렉션 URI 추가됨
- [ ] 로컬에서 `npm run build:web` 정상 실행 확인

---

## 5. 요약

| 단계 | 작업 |
|------|------|
| 1 | Vercel 대시보드에서 Root Directory를 `apps/web`으로 설정 (또는 `vercel.json` 확인) |
| 2 | 환경 변수 설정 (NEXTAUTH_URL, AZURE_AD_* 등) |
| 3 | Azure AD 등에 배포 도메인 리디렉션 URI 등록 |
| 4 | 코드 수정 후 `git add` → `git commit` → `git push origin main` |
| 5 | 1~2분 후 배포된 웹사이트에서 변경 사항 확인 |

이렇게 설정해 두면 **수정사항을 실시간으로 배포하면서 웹사이트에서 바로 확인**할 수 있습니다.

---

## 참고 자료

- [Vercel Monorepo 문서](https://vercel.com/docs/monorepos)
- [Vercel Root Directory 설정](https://vercel.com/docs/projects/overview/root-directory)
