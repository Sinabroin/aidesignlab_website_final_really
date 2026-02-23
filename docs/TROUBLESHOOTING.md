# 트러블슈팅

## "Module not found: Can't resolve '@prisma/client'"

**원인:** `@prisma/client` 패키지가 설치되지 않았거나 Prisma Client가 생성되지 않음.

**해결 방법 (순서대로 시도):**

### 1. 프로젝트 루트에서 설치

```bash
cd C:\Users\HDEC\aidesignlab_website_final_really
npm install
cd apps\web
npx prisma generate
npm run dev
```

### 2. npm install 실패 시 (Cannot read properties of null)

```bash
cd C:\Users\HDEC\aidesignlab_website_final_really
rmdir /s /q node_modules 2>nul
del package-lock.json 2>nul
cd apps\web
rmdir /s /q node_modules 2>nul
cd ..\..
npm install --legacy-peer-deps
cd apps\web
npx prisma generate
```

### 3. Prisma 7 오류 (datasource url no longer supported)

`npx prisma`가 Prisma 7을 설치한 경우. `package.json`에서 prisma를 6.19.0으로 고정했는지 확인. 설치 후 `npx prisma generate`는 프로젝트의 Prisma 6을 사용함.
