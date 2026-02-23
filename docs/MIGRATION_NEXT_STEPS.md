# 마이그레이션 다음 단계

## 완료된 작업

1. **npm install** - Prisma 패키지 설치 완료
2. **prisma generate** - Prisma Client 생성 완료
3. **.env 파일** - `apps/web/.env` 생성 (DATABASE_URL 주석 처리 상태)

## 수동 진행 필요 (Azure SQL 생성 후)

### 1. Azure SQL Database 생성

[AZURE_SQL_SETUP.md](./AZURE_SQL_SETUP.md)를 참고하여 Azure Portal에서:

- Basic 또는 Free Tier SQL Database 생성
- 방화벽에 로컬 IP 및 Vercel IP 추가
- 연결 문자열(Connection String) 복사

### 2. DATABASE_URL 설정

`apps/web/.env` 파일에서 아래 주석을 해제하고 실제 값으로 교체:

```
DATABASE_URL="sqlserver://YOUR_SERVER.database.windows.net:1433;database=YOUR_DB;user=YOUR_USER;password=YOUR_PASSWORD;encrypt=true"
```

### 3. 마이그레이션 실행

```bash
cd apps/web
npx prisma migrate dev --name init
```

### 4. 시드 데이터 입력

마이그레이션 후 mockData를 DB에 넣으려면:

```bash
cd apps/web
npm run db:seed
```

또는 `npx prisma db seed` 실행. 시드 스크립트는 `prisma/seed.ts`에 정의되어 있으며, PlayBook/PlayDay/Notices/Schedules/QuickLinks 데이터를 삽입합니다.
