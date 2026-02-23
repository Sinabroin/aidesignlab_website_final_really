import LoginButton from "@/components/LoginButton";

interface LoginPageProps {
  searchParams: Promise<{ callbackUrl?: string; error?: string }>;
}

/**
 * 커스텀 로그인 페이지
 *
 * /api/auth/signin 대신 이 페이지로 리다이렉트하여 302 루프 방지.
 * signIn() 클라이언트 함수로 Azure 로그인 진행.
 */
export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const callbackUrl = params.callbackUrl ?? "/playground";
  const error = params.error;
  if (error) {
    // #region agent log
    fetch("http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({runId:"auth-debug-3",hypothesisId:"D1-D3",location:"app/login/page.tsx",message:"login page rendered with error",data:{error,hasCallbackUrl:!!callbackUrl},timestamp:Date.now()})}).catch(()=>{});
    // #endregion
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-none shadow-2xl p-8 md:p-12 max-w-md w-full">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4">🔐</div>
          <h1 className="text-2xl font-normal tracking-tight text-gray-900 mb-2">
            AI 디자인랩 로그인
          </h1>
          <p className="text-gray-600 text-sm">
            현대건설 이메일(@hdec.co.kr)로 로그인해주세요.
          </p>
          {error && (
            <p className="mt-2 text-sm text-red-600">
              이전 로그인 시도가 실패했습니다. 다시 시도해주세요.
            </p>
          )}
        </div>

        <LoginButton callbackUrl={callbackUrl} />

        <p className="mt-6 text-center text-xs text-gray-500">
          로그인 시 개인정보 처리방침에 동의하게 됩니다.
        </p>
      </div>
    </div>
  );
}
