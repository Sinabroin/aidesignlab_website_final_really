# Azure SQL Database 세팅 가이드

현대건설 AI 디자인랩 PoC를 위한 Azure SQL Database 생성 및 방화벽 설정 단계별 가이드입니다.

---

## 1. Azure Portal 접속

1. [Azure Portal](https://portal.azure.com)에 로그인
2. 상단 검색창에 `SQL databases` 입력 후 선택

---

## 2. SQL Database 생성

1. **+ Create** 클릭
2. **Resource group**: 기존 그룹 선택 또는 새로 생성 (예: `rg-aidesignlab-poc`)
3. **Database name**: `aidesignlab-db` (원하는 이름 사용)
4. **Server**: **Create new** 선택
   - Server name: `aidesignlab-sql-server` (전역 고유해야 함)
   - Location: `Korea Central` 또는 `East Asia` 권장
   - Authentication: **Use SQL authentication**
   - Server admin login: `sqladmin` (또는 원하는 ID)
   - Password: 강력한 비밀번호 설정 후 **반드시 저장**

5. **Compute + storage**: **Configure database** 클릭
   - **Basic** 또는 **Free** 선택 (PoC 비용 최소화)
   - Basic: 약 $5/월 수준, Free: 제한적이지만 무료

6. **Backup storage redundancy**: `Locally-redundant` (Basic/Free에서는 기본값)

7. **Review + create** → **Create** 클릭

---

## 3. 방화벽(Firewall) 설정

DB 생성 후 **Set server firewall** 링크가 표시되거나, SQL Server 리소스로 이동하여 설정합니다.

### 3.1 방화벽 규칙 추가

1. 생성된 **SQL Server** 리소스 클릭 (DB가 아닌 상위 서버)
2. 왼쪽 메뉴에서 **Networking** (또는 **Security** > **Networking**) 선택
3. **Firewall rules** 탭에서:

| 규칙 이름 | 시작 IP | 끝 IP | 용도 |
|-----------|---------|-------|------|
| `LocalDev` | (아래 참고) | (동일) | 로컬 개발 PC |
| `AllowAzure` | 0.0.0.0 | 0.0.0.0 | Azure 서비스 접근 (선택) |

**로컬 IP 확인 방법:**
- [whatismyip.com](https://whatismyip.com) 접속 후 표시된 IP 입력
- 시작 IP = 끝 IP (단일 IP 허용)

### 3.2 Vercel 배포 시 (Phase 1)

Vercel은 기본적으로 **동적 IP**를 사용합니다. 다음 중 하나를 선택합니다.

**옵션 A: Vercel Static IPs (Pro 플랜 이상)**  
- Vercel 대시보드 → Project Settings → Connectivity → Static IPs  
- 할당된 IP를 Azure 방화벽에 추가

**옵션 B: 방화벽 일시 완화 (개발/테스트용)**  
- PoC 단계에서만: `0.0.0.0` ~ `255.255.255.255` 허용 (보안상 비권장, 테스트 후 제거)

**옵션 C: Azure Functions / 같은 리전 서비스 사용**  
- Vercel 대신 Azure에 API를 호스팅하는 경우, 같은 리전 내부 통신으로 제한 가능

---

## 4. 연결 문자열(Connection String) 획득

1. 생성된 **SQL Database** 리소스 클릭
2. **Connection strings** (또는 **Settings** > **Connection strings**) 선택
3. **ADO.NET** 탭에서 연결 문자열 복사

형식 예시:
```
Server=tcp:aidesignlab-sql-server.database.windows.net,1433;Initial Catalog=aidesignlab-db;Persist Security Info=False;User ID=sqladmin;Password=YOUR_PASSWORD;MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;
```

### Prisma용 DATABASE_URL 형식

`.env.local`에 다음 형식으로 저장:

```
DATABASE_URL="sqlserver://aidesignlab-sql-server.database.windows.net:1433;database=aidesignlab-db;user=sqladmin;password=YOUR_PASSWORD;encrypt=true;trustServerCertificate=false"
```

또는 Prisma 공식 형식:
```
DATABASE_URL="sqlserver://sqladmin:YOUR_PASSWORD@aidesignlab-sql-server.database.windows.net:1433;database=aidesignlab-db"
```

---

## 5. 연결 테스트

Azure Portal의 **Query editor** 또는 로컬에서 `sqlcmd` / SSMS로 연결 테스트:

- **Query editor**: DB 리소스 → Query editor (preview) → 로그인

---

## 요약 체크리스트

- [ ] SQL Database 생성 (Basic 또는 Free Tier)
- [ ] SQL Server 방화벽에 로컬 IP 추가
- [ ] Vercel 배포 시 Static IP 또는 대안 검토
- [ ] 연결 문자열을 `.env.local`의 `DATABASE_URL`에 저장
- [ ] Query editor로 연결 확인
