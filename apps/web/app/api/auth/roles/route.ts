/** 현재 로그인 사용자의 RBAC 역할 목록을 반환하는 API */

import { NextRequest, NextResponse } from 'next/server';
import { getAuthToken } from '@/lib/auth/get-token';
import { getRolesForUser } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    const token = await getAuthToken(req);
    if (!token || typeof token === 'string') return NextResponse.json({ roles: [] });

    const user = {
      id: (token.sub ?? (token.email as string | undefined) ?? '') as string,
      email: token.email as string | undefined,
      name: token.name as string | undefined,
    };
    const roles = getRolesForUser(user);
    return NextResponse.json({ roles });
  } catch {
    return NextResponse.json({ roles: [] });
  }
}
