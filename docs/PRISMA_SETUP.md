# Prisma ORM 초기 세팅 가이드

## 1. 설치 (이미 package.json에 추가됨)

```bash
cd apps/web
npm install
```

`postinstall` 스크립트가 `prisma generate`를 자동 실행합니다.

## 2. 수동 초기화 (이미 완료된 경우 생략)

```bash
cd apps/web
npx prisma init
```

- `prisma/schema.prisma` 생성
- `prisma/.env` 또는 프로젝트 `.env`에 DATABASE_URL 참조

## 3. DATABASE_URL 설정

`apps/web/.env.local` (또는 프로젝트 루트 `.env.local`)에 추가:

```
DATABASE_URL="sqlserver://YOUR_SERVER.database.windows.net:1433;database=YOUR_DB;user=YOUR_USER;password=YOUR_PASSWORD;encrypt=true"
```

Azure SQL 생성 방법은 [AZURE_SQL_SETUP.md](./AZURE_SQL_SETUP.md) 참고.

**주의:** `DATABASE_URL`이 없으면 앱은 mockData를 사용합니다.

## 4. 마이그레이션 (DB 연결 후)

```bash
cd apps/web
npx prisma migrate dev --name init
```

## 5. Prisma Studio (선택)

```bash
npx prisma studio
```

DB 내용을 브라우저에서 확인할 수 있습니다.
