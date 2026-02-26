/** Vercel Blob Client-side Upload 헬퍼 */
import { upload } from '@vercel/blob/client';

/**
 * 파일을 Vercel Blob에 직접 업로드하고 공개 URL을 반환합니다.
 * - /api/upload 라우트에서 토큰을 발급받아 클라이언트가 직접 Blob 스토리지에 업로드
 * - 서버를 통한 base64 전송 없이 처리하므로 413 오류가 발생하지 않음
 */
export async function uploadToBlob(file: File, folder = 'uploads'): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const pathname = `${folder}/${Date.now()}-${safeName}`;

  const blob = await upload(pathname, file, {
    access: 'public',
    handleUploadUrl: '/api/upload',
  });

  return blob.url;
}
