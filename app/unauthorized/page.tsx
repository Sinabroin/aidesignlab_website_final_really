import UnauthorizedActions from "@/components/common/UnauthorizedActions";

interface UnauthorizedPageProps {
  searchParams: Promise<{ 
    reason?: string; 
    next?: string 
  }>;
}

/**
 * 권한 없음 페이지
 * 
 * 사용 시나리오:
 * 1. community 권한 없이 /community 접근
 * 2. 프록시 헤더 인증 실패
 * 3. 기타 권한 부족
 */
export default async function UnauthorizedPage({ searchParams }: UnauthorizedPageProps) {
  const params = await searchParams;
  const reason = params.reason ?? "unauthorized";
  const next = params.next ?? "/playground";

  // 이유별 메시지
  const getMessage = () => {
    switch (reason) {
      case "community_only":
        return {
          title: "ACE 커뮤니티 접근 권한이 없습니다",
          description: "이 영역은 ACE 멤버 및 AI디자인랩 운영진 전용입니다.",
          suggestion: "접근 권한이 필요하시면 운영진에게 문의해주세요.",
        };
      case "missing_proxy_auth":
        return {
          title: "인증 정보를 확인할 수 없습니다",
          description: "사내 인증 시스템(AUTOWAY)을 통한 로그인이 필요합니다.",
          suggestion: "IT 지원팀에 문의하거나 다시 로그인해주세요.",
        };
      case "email_domain_not_allowed":
        return {
          title: "접근이 제한됩니다",
          description: "현대건설(@hdec.co.kr) 이메일로 가입된 계정만 로그인할 수 있습니다.",
          suggestion: "회사 이메일로 로그인했는지 확인해주세요.",
        };
      case "admin_only":
        return {
          title: "운영자 콘솔 접근 권한이 없습니다",
          description: "이 영역은 AI디자인랩 운영진 전용입니다.",
          suggestion: "접근 권한이 필요하시면 기존 운영진에게 문의해주세요.",
        };
      default:
        return {
          title: "접근 권한이 없습니다",
          description: "요청하신 페이지에 접근할 권한이 없습니다.",
          suggestion: "권한이 필요하시면 관리자에게 문의해주세요.",
        };
    }
  };

  const message = getMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-none shadow-2xl p-8 md:p-12 max-w-2xl w-full">
        {/* 아이콘 */}
        <div className="text-center mb-8">
          <div className="text-8xl mb-4">🔒</div>
          <h1 className="text-3xl font-normal tracking-tight text-gray-900 mb-3">
            {message.title}
          </h1>
          <p className="text-lg text-gray-600">
            {message.description}
          </p>
        </div>

        {/* 권한 안내 */}
        {reason === "community_only" && (
          <div className="bg-blue-50 border border-blue-200 rounded-none p-6 mb-6">
            <h3 className="font-normal tracking-tight text-blue-900 mb-2">
              📋 ACE 커뮤니티 접근 권한 안내
            </h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• ACE 멤버 (30명)</li>
              <li>• AI디자인랩 운영진 (5명)</li>
            </ul>
          </div>
        )}

        {/* 제안 */}
        <div className="bg-gray-50 rounded-none p-6 mb-6">
          <p className="text-gray-700">
            💡 <strong>도움이 필요하신가요?</strong>
          </p>
          <p className="text-sm text-gray-600 mt-2">
            {message.suggestion}
          </p>
        </div>

        {/* 액션 버튼 */}
        <UnauthorizedActions next={next} />

        {/* 문의 정보 */}
        <div className="mt-8 pt-6 border-t border-gray-200 text-center text-sm text-gray-500">
          <p>문의: AI디자인랩 운영진</p>
          <p className="mt-1">📧 aidesignlab@hdec.co.kr | ☎️ 내선 1234</p>
        </div>
      </div>
    </div>
  );
}
