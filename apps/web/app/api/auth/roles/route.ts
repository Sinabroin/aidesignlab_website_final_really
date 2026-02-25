/** 현재 로그인 사용자의 RBAC 역할 목록을 반환하는 API */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getRolesForUser } from '@/lib/auth/rbac';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ roles: [] });

    const roles = getRolesForUser(user);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({runId:'session-fix',hypothesisId:'D1',location:'api/auth/roles/route.ts',message:'roles resolved via getServerSession',data:{userId:user.id,roles},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
    return NextResponse.json({ roles });
  } catch {
    return NextResponse.json({ roles: [] });
  }
}
