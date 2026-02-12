# 🔐 AI 디자인랩 RBAC 시스템 가이드

현대건설 AI 디자인랩 웹사이트의 **역할 기반 접근 제어(RBAC)** 시스템 설명서

---

## 📋 **권한 정책**

### **1. Home / PlayBook / PlayDay**
- **접근 권한**: 현대건설 임직원 전체
- **요구사항**: 사내 SSO 로그인만 완료되면 OK
- **역할**: `employee`

### **2. ACE 커뮤니티** (`/community`)
- **접근 권한**: ACE 멤버 30명 + AI디자인랩 운영진 5명 (총 35명)
- **요구사항**: 사내 SSO 로그인 + `community` 역할
- **역할**: `employee` + `community`

---

## 🎯 **역할(Role) 정의**

```typescript
type Role = "employee" | "community";
```

### **employee**
- 현대건설 임직원 전체
- SSO 로그인만 되면 자동 부여
- Home, PlayBook, PlayDay 접근 가능

### **community**
- ACE 커뮤니티 접근 가능자
- allowlist에 사번/이메일이 등록된 경우 부여
- `/community` 페이지 접근 가능

---

## 🏗️ **시스템 아키텍처**

### **인증(AuthN)과 권한(AuthZ) 분리**

```
┌─────────────────────────────────────────┐
│  1. 인증 (Authentication)               │
│  "너는 현대건설 임직원이 맞니?"         │
│  → SSO Provider (AUTOWAY 등)            │
│  → 나중에 갈아끼울 수 있게 어댑터 구조  │
└─────────────────────────────────────────┘
              ↓
┌─────────────────────────────────────────┐
│  2. 권한 (Authorization)                │
│  "임직원 중에서도 커뮤니티 권한 있니?"  │
│  → allowlist 기반 (나중에 SSO 클레임)   │
│  → SSO 방식과 무관하게 유지              │
└─────────────────────────────────────────┘
```

---

## 🔧 **파일 구조**

```
lib/
├── auth/
│   ├── provider.ts          # Auth Provider 어댑터 (dev/proxy/oidc/saml)
│   ├── session.ts           # 현재 사용자 조회
│   └── rbac.ts              # 역할 판정 로직
└── data/
    └── community-allowlist.ts  # ACE 커뮤니티 35명 목록

app/
├── api/auth/
│   ├── login/route.ts       # 로그인 API (Dev용)
│   └── logout/route.ts      # 로그아웃 API
├── playground/              # Home/PlayBook/PlayDay (임직원 전체)
├── community/               # ACE 커뮤니티 (35명)
└── unauthorized/            # 권한 없음 페이지

middleware.ts                # 로그인 체크 미들웨어
.env.local                   # 환경 변수 (AUTH_PROVIDER 등)
```

---

## 🚀 **사용 방법**

### **1. 환경 변수 설정**

`.env.local` 파일 생성:

```env
AUTH_PROVIDER=dev
SESSION_SECRET=your-secret-key
```

### **2. allowlist 설정**

`lib/data/community-allowlist.ts` 파일에서 ACE 35명 등록:

```typescript
export const COMMUNITY_ALLOWLIST = new Set<string>([
  // 사번 또는 회사 이메일
  "lab001@hdec.co.kr",
  "ace001@hdec.co.kr",
  // ... 나머지 33명
]);
```

### **3. 개발 서버 실행**

```bash
npm run dev
```

### **4. 테스트**

#### **임직원 로그인 (Dev Provider)**
```
http://localhost:3000/api/auth/login?user=EMP001
```

#### **커뮤니티 접근 (allowlist 포함 사용자)**
```
http://localhost:3000/api/auth/login?user=lab001@hdec.co.kr
http://localhost:3000/community
```

#### **권한 없음 테스트**
```
http://localhost:3000/api/auth/login?user=EMP999
http://localhost:3000/community
→ /unauthorized로 리다이렉트
```

---

## 🔄 **SSO 연동 방법**

### **단계 1: IT 부서에서 정보 받기**

AUTOWAY 인증 방식 확인:
- OAuth 2.0 / OIDC?
- SAML 2.0?
- 프록시 헤더?

필요한 정보:
- Client ID / Secret
- Authorization URL
- Token URL
- UserInfo URL (사번/이메일 포함)

### **단계 2: 환경 변수 변경**

`.env.local`:

```env
AUTH_PROVIDER=oidc  # 또는 saml, proxy_header

OIDC_ISSUER=https://autoway.hdec.co.kr
OIDC_CLIENT_ID=your-client-id
OIDC_CLIENT_SECRET=your-client-secret
```

### **단계 3: Provider 구현**

`lib/auth/provider.ts`에서 해당 Provider 구현:

```typescript
const oidcProvider: AuthProvider = {
  name: "oidc",
  async getUser() {
    // OIDC 토큰 검증 및 사용자 정보 추출
    // id: 사번 또는 이메일
    // name, email 포함
  },
  // ...
};
```

### **단계 4: 테스트**

나머지 코드 (RBAC, middleware, 페이지)는 변경 없이 그대로 작동!

---

## 📊 **권한 흐름도**

```
사용자 접속
    ↓
middleware.ts
    ↓
로그인 여부 체크
    ├─ 미로그인 → /api/auth/login
    └─ 로그인 완료
         ↓
페이지 접근
    ├─ /playground → employee 역할만 (통과)
    └─ /community → community 역할 필요
         ↓
    rbac.ts에서 allowlist 체크
         ├─ 권한 있음 → 페이지 렌더링
         └─ 권한 없음 → /unauthorized
```

---

## 🛠️ **관리 작업**

### **allowlist에 사용자 추가**

`lib/data/community-allowlist.ts`:

```typescript
export const COMMUNITY_ALLOWLIST = new Set<string>([
  // 기존 사용자...
  "new.member@hdec.co.kr",  // 추가
]);
```

### **SSO 그룹 클레임으로 전환**

나중에 AUTOWAY가 "ACE그룹" 클레임을 제공하면:

`lib/auth/rbac.ts`:

```typescript
export function getRolesForUser(user: User): Role[] {
  const roles: Role[] = ["employee"];

  // SSO 그룹 클레임 확인
  if (user.groups?.includes("ACE")) {
    roles.push("community");
  }

  return roles;
}
```

allowlist는 제거 가능!

---

## ⚠️ **보안 주의사항**

### **1. Dev Provider는 절대 프로덕션 사용 금지**

```env
# 프로덕션
AUTH_PROVIDER=oidc  # dev 절대 사용 금지!
```

### **2. SESSION_SECRET 강력한 값 사용**

```bash
openssl rand -base64 32
```

### **3. allowlist 민감 정보 관리**

- Git에 커밋 시 실제 이메일 노출 주의
- 프로덕션에서는 DB로 관리 권장

---

## 🧪 **테스트 시나리오**

### **시나리오 1: 임직원 일반 사용자**

```bash
# 로그인
curl http://localhost:3000/api/auth/login?user=EMP123

# Playground 접근 (성공)
curl http://localhost:3000/playground

# 커뮤니티 접근 (실패 - unauthorized)
curl http://localhost:3000/community
```

### **시나리오 2: ACE 멤버**

```bash
# 로그인 (allowlist 포함)
curl http://localhost:3000/api/auth/login?user=ace001@hdec.co.kr

# Playground 접근 (성공)
curl http://localhost:3000/playground

# 커뮤니티 접근 (성공)
curl http://localhost:3000/community
```

---

## 📞 **문의**

- **기술 지원**: AI디자인랩 운영진
- **권한 신청**: aidesignlab@hdec.co.kr
- **IT 연동**: 내선 1234

---

**마지막 업데이트**: 2024.02.09
