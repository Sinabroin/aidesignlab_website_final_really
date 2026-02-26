/** Vercel Blob Client-side Upload — 토큰 발급 라우트 */
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';
import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth/session';

export const dynamic = 'force-dynamic';

/** 허용할 파일 타입 목록 */
const ALLOWED_TYPES = [
  'image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/zip', 'application/x-zip-compressed',
  'text/plain',
];

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: '로그인이 필요합니다.' }, { status: 401 });
    }

    const body = (await request.json()) as HandleUploadBody;

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        return {
          allowedContentTypes: ALLOWED_TYPES,
          maximumSizeInBytes: 10 * 1024 * 1024, // 파일 1개당 최대 10MB
          tokenPayload: JSON.stringify({ userId: user.id, email: user.email }),
        };
      },
      onUploadCompleted: async ({ blob }) => {
        console.log('[Blob] 업로드 완료:', blob.url, `(${(blob.size / 1024).toFixed(0)}KB)`);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error('[POST /api/upload]', message);
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
