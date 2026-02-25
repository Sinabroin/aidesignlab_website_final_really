/** 현재 로그인 사용자의 RBAC 역할 목록을 반환하는 API */

import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';
import { getRolesForUser } from '@/lib/auth/rbac';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) return NextResponse.json({ roles: [] });

    const roles = getRolesForUser(user);
    return NextResponse.json({ roles });
  } catch {
    return NextResponse.json({ roles: [] });
  }
}
