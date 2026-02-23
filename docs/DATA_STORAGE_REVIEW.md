# 실제 데이터 저장 방식 전환 - 검토 보고서

**최종 업데이트:** mockData 직접 사용 제거 완료. 모든 UI가 API를 통해 데이터 조회.

## 1. 이전 상태 (해결됨)

### 문제: 프론트엔드가 mockData를 직접 사용 중

| 컴포넌트 | 데이터 소스 | API 호출 여부 |
|----------|-------------|---------------|
| PlayBookSection | mockData 직접 import | 없음 |
| PlayDaySection | mockData 직접 import | 없음 |
| NoticesSection | mockData 직접 import | 없음 |
| HomeSection | mockData (notices, schedules, quickLinks) | 없음 |
| ACECommunitySection | mockData (activityData) | 없음 |
| MarqueeShowcase | mockData | 없음 |

**결론:** API(`/api/data/*`)는 존재하지만, **어떤 컴포넌트도 호출하지 않음**. 모든 UI가 mockData를 직접 import하여 사용.

---

## 2. API 라우트 (모두 추가 완료)

| 데이터 | API 경로 | 상태 |
|--------|----------|------|
| PlayBook | `/api/data/playbook` | 완료 |
| PlayDay | `/api/data/playday` | 완료 |
| Notices | `/api/data/notices` | 완료 |
| Schedules | `/api/data/schedules` | 완료 |
| QuickLinks | `/api/data/quick-links` | 완료 |
| Activity (ACE 커뮤니티) | `/api/data/activity` | 완료 |
| Marquee | `/api/data/marquee` | 완료 |
| Admin Content | `/api/admin/content` | 완료 (Operator 전용) |

---

## 3. 해결 책임 분리

### 3.1 AI가 해결할 수 있는 항목 (코드 수정)

1. **누락 API 라우트 추가**: `/api/data/schedules`, `/api/data/quick-links`, `/api/data/activity`
2. **프론트엔드 데이터 페칭 전환**: mockData import → API 호출로 변경
3. **데이터 페칭 훅/유틸 생성**: `usePlaybookData`, `usePlaydayData` 등 또는 공통 fetcher
4. **로딩/에러 상태 처리**: 컴포넌트에 loading, error UI 추가

### 3.2 사용자가 수동으로 해결해야 하는 항목

1. **Azure SQL Database 생성 및 연결**
   - Azure Portal에서 DB 생성 ([docs/AZURE_SQL_SETUP.md](./AZURE_SQL_SETUP.md))
   - `apps/web/.env`에 `DATABASE_URL` 설정
   - `npx prisma migrate dev --name init` 실행
   - `npm run db:seed` 실행 (초기 데이터 삽입)

2. **인증 환경**
   - 데이터 API는 로그인 필수. 미로그인 시 401 반환
   - `/playground` 등 접근 경로가 미들웨어로 보호되는지 확인 필요

---

## 4. 데이터 흐름 (변경 후)

```
[DB (Azure SQL)] ←→ [Repository] ←→ [API Routes] ←→ [Frontend fetch] ←→ [UI]
       ↑                    ↑
  DATABASE_URL 있음    DATABASE_URL 없음
  → Prisma 쿼리       → mockData 반환 (fallback)
```

**주의:** DATABASE_URL 미설정 시에도 API는 mockData를 반환하므로, 프론트엔드가 API를 호출하면 mockData 기반으로 동작 가능. DB 연결 후에는 동일 API가 실제 DB 데이터를 반환.
