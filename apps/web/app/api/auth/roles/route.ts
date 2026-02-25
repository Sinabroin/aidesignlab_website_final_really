/** 현재 로그인 사용자의 RBAC 역할 목록을 반환하는 API */

import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getRolesForUser } from '@/lib/auth/rbac';

export async function GET(req: NextRequest) {
  try {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) return NextResponse.json({ roles: [] });

    const user = {
      id: (token.sub ?? token.email ?? '') as string,
      email: token.email as string | undefined,
      name: token.name as string | undefined,
    };
    const roles = getRolesForUser(user);
    return NextResponse.json({ roles });
  } catch {
    return NextResponse.json({ roles: [] });
  }
}
