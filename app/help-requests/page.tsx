'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface HelpRequest {
  id: string;
  title: string;
  category: string;
  author: string;
  date: string;
  status: 'pending' | 'in-progress' | 'completed';
  content: string;
  replies: {
    author: string;
    date: string;
    content: string;
    isAdmin: boolean;
  }[];
}

export default function HelpRequestsPage() {
  const router = useRouter();
  const [selectedRequest, setSelectedRequest] = useState<HelpRequest | null>(null);
  const [replyContent, setReplyContent] = useState('');
  
  const [requests] = useState<HelpRequest[]>([
    {
      id: '1',
      title: '계약서 분석 자동화',
      category: '문서 분석',
      author: '김민수',
      date: '2026.02.10',
      status: 'in-progress',
      content: 'PDF 계약서를 자동으로 분석하여 주요 조항을 추출하는 시스템을 만들고 싶습니다.',
      replies: [
        {
          author: 'ACE 운영진',
          date: '2026.02.10 14:30',
          content: '안녕하세요. GPT-4 Vision API를 활용하면 가능합니다. 자세한 가이드를 메일로 보내드리겠습니다.',
          isAdmin: true
        }
      ]
    },
    {
      id: '2',
      title: '프로젝트 일정 예측 모델',
      category: '데이터 분석',
      author: '이지은',
      date: '2026.02.09',
      status: 'completed',
      content: '과거 프로젝트 데이터를 기반으로 새 프로젝트의 완료 시점을 예측하고 싶습니다.',
      replies: [
        {
          author: 'ACE 멤버 - 박준호',
          date: '2026.02.09 10:15',
          content: '저희 팀에서 비슷한 프로젝트를 진행했습니다. PlayBook에 공유된 자료를 참고해보세요.',
          isAdmin: false
        },
        {
          author: 'ACE 운영진',
          date: '2026.02.09 15:20',
          content: '관련 Playbook 링크와 샘플 코드를 메일로 발송했습니다.',
          isAdmin: true
        }
      ]
    },
    {
      id: '3',
      title: '고객 문의 자동 분류',
      category: 'AI 시스템',
      author: '최영희',
      date: '2026.02.08',
      status: 'pending',
      content: '고객 문의를 카테고리별로 자동 분류하는 시스템이 필요합니다.',
      replies: []
    }
  ]);

  const handleReplySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 실제로는 API 호출
    alert('답변이 등록되었습니다. 이메일로도 발송됩니다.');
    setReplyContent('');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700';
      case 'in-progress': return 'bg-blue-100 text-blue-700';
      case 'completed': return 'bg-green-100 text-green-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return '대기중';
      case 'in-progress': return '진행중';
      case 'completed': return '완료';
      default: return status;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* 헤더 */}
      <div className="bg-gradient-to-r from-[#C1E7ED] to-[#87CEEB] text-white py-12">
        <div className="max-w-[1400px] mx-auto px-6 md:px-12">
          <button
            onClick={() => router.back()}
            className="mb-4 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            돌아가기
          </button>
          <h1 className="text-4xl md:text-5xl font-bold">도와줘요 ACE! 신청 목록</h1>
          <p className="text-lg mt-2 text-white/90">모든 도움 요청을 확인하고 답변할 수 있습니다</p>
        </div>
      </div>

      <div className="max-w-[1400px] mx-auto px-6 md:px-12 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* 요청 목록 */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">요청 목록</h2>
            {requests.map((request) => (
              <div
                key={request.id}
                onClick={() => setSelectedRequest(request)}
                className={`p-4 bg-white rounded-lg border-2 cursor-pointer transition-all hover:shadow-md ${
                  selectedRequest?.id === request.id
                    ? 'border-[#87CEEB] shadow-md'
                    : 'border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(request.status)}`}>
                    {getStatusText(request.status)}
                  </span>
                  <span className="text-xs text-gray-500">{request.date}</span>
                </div>
                <h3 className="font-bold text-gray-900 mb-1">{request.title}</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="px-2 py-0.5 bg-[#E8F6F8] text-[#4A90A4] rounded text-xs">
                    {request.category}
                  </span>
                  <span>•</span>
                  <span>{request.author}</span>
                </div>
                {request.replies.length > 0 && (
                  <div className="mt-2 text-xs text-gray-500 flex items-center gap-1">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    {request.replies.length}개의 답변
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* 상세 내용 */}
          <div className="lg:col-span-2">
            {selectedRequest ? (
              <div className="bg-white rounded-lg border border-gray-200 p-8">
                <div className="mb-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-900 mb-2">{selectedRequest.title}</h2>
                      <div className="flex items-center gap-3 text-sm text-gray-600">
                        <span className="px-3 py-1 bg-[#E8F6F8] text-[#4A90A4] rounded-full font-semibold">
                          {selectedRequest.category}
                        </span>
                        <span>{selectedRequest.author}</span>
                        <span>•</span>
                        <span>{selectedRequest.date}</span>
                      </div>
                    </div>
                    <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(selectedRequest.status)}`}>
                      {getStatusText(selectedRequest.status)}
                    </span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{selectedRequest.content}</p>
                </div>

                {/* 답변 목록 */}
                {selectedRequest.replies.length > 0 && (
                  <div className="mb-6 border-t pt-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4">답변 ({selectedRequest.replies.length})</h3>
                    <div className="space-y-4">
                      {selectedRequest.replies.map((reply, index) => (
                        <div
                          key={index}
                          className={`p-4 rounded-lg ${
                            reply.isAdmin ? 'bg-[#E8F6F8]/50 border-l-4 border-[#87CEEB]' : 'bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {reply.isAdmin && (
                              <span className="px-2 py-0.5 bg-[#87CEEB] text-white text-xs font-bold rounded">
                                운영진
                              </span>
                            )}
                            <span className="font-semibold text-gray-900">{reply.author}</span>
                            <span className="text-sm text-gray-500">{reply.date}</span>
                          </div>
                          <p className="text-gray-700">{reply.content}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* 답변 작성 폼 */}
                <div className="border-t pt-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">답변 작성</h3>
                  <form onSubmit={handleReplySubmit}>
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="답변을 입력하세요. 작성자의 이메일로도 자동 발송됩니다."
                      rows={5}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-[#87CEEB] transition-colors resize-none"
                      required
                    />
                    <div className="flex items-center justify-between mt-4">
                      <p className="text-sm text-gray-600">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        답변은 사내 이메일로도 자동 발송됩니다
                      </p>
                      <button
                        type="submit"
                        className="px-6 py-3 bg-gradient-to-r from-[#87CEEB] to-[#B0E0E6] hover:from-[#77BED5] hover:to-[#A0D8E1] text-white font-bold rounded-lg transition-all shadow-lg hover:shadow-xl"
                      >
                        답변 등록
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg border border-gray-200 p-12 text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-600 text-lg">왼쪽에서 요청을 선택하세요</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
