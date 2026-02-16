# 실시간 배포 가이드

코드 수정 후 **푸시만 하면 자동으로 배포**되어 웹사이트에서 바로 확인할 수 있도록 설정하는 방법입니다.

---

## 1. Vercel로 실시간 배포 (권장)

Next.js는 Vercel과 연동하면 **푸시 시 자동 빌드·배포**가 됩니다.

### 1) Vercel 연결 (최초 1회)

1. [vercel.com](https://vercel.com) 접속 후 로그인
2. **Add New** → **Project**
3. **Import Git Repository**에서 이 프로젝트의 GitHub(또는 GitLab) 저장소 선택
4. **Framework Preset**: Next.js 자동 감지
5. **Environment Variables**에 배포 환경에 필요한 값 추가 (예: `NEXTAUTH_URL`, `NEXTAUTH_SECRET`, `AZURE_AD_*` 등). `NEXTAUTH_URL`은 Vercel이 부여한 도메인으로 설정 (예: `https://프로젝트명.vercel.app`)
6. **Deploy** 클릭

### 2) 실시간 배포 흐름

- **main** 브랜치에 `git push` → 프로덕션 사이트가 자동으로 최신 코드로 배포됨
- 보통 1~2분 내에 배포 완료 후, 해당 웹사이트에서 수정 사항 확인 가능

```bash
git add .
git commit -m "fix: 로그인 문구 수정"
git push origin main
```

- 다른 브랜치에 푸시하면 **Preview URL**이 생성되어, main에 머지 전 미리 확인 가능

---

## 2. Netlify로 실시간 배포

1. [netlify.com](https://netlify.com) → **Add new site** → **Import an existing project**
2. 저장소 연결 후 빌드 설정:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (Next.js는 보통 **Vercel** 또는 **Netlify Next.js runtime** 사용 권장. Netlify에서 Next.js 선택 시 자동 설정됨)
3. 환경 변수 설정 후 배포
4. 이후 **main**에 푸시할 때마다 자동 재배포

---

## 3. GitHub 저장소와만 연동돼 있을 때

아직 Vercel/Netlify에 연결하지 않았다면:

1. 위 **1. Vercel로 실시간 배포** 절차대로 Vercel에 GitHub 저장소 연결
2. 배포가 끝나면 Vercel 대시보드에서 **도메인 URL** 확인
3. Azure AD(또는 사용 중인 OAuth) 앱 등록에 **리디렉션 URI**로 해당 URL 추가  
   예: `https://프로젝트명.vercel.app/api/auth/callback/azure-ad`
4. 이후에는 **수정 → 커밋 → 푸시**만 하면 실시간으로 배포 사이트에 반영됨

---

## 4. 요약

| 단계 | 작업 |
|------|------|
| 1 | Vercel(또는 Netlify)에 GitHub 저장소 연결 및 환경 변수 설정 |
| 2 | Azure AD 등에 배포 도메인 리디렉션 URI 등록 |
| 3 | 코드 수정 후 `git add` → `git commit` → `git push origin main` |
| 4 | 1~2분 후 배포된 웹사이트에서 변경 사항 확인 |

이렇게 설정해 두면 **수정사항을 실시간으로 배포하면서 웹사이트에서 바로 확인**할 수 있습니다.
