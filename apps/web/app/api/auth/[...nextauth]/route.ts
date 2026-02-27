/** NextAuth 라우트 핸들러 */
import NextAuth from "next-auth";
import { NextRequest } from "next/server";
import { authOptions } from "@/lib/auth";

let handler: ReturnType<typeof NextAuth>;
try {
  handler = NextAuth(authOptions);
} catch (err) {
  console.error("[NextAuth] Init error:", err);
}

async function wrappedHandler(req: NextRequest, ctx: { params: Promise<{ nextauth: string[] }> }) {
  // #region agent log
  fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:request',message:'Auth request',data:{url:req.url,method:req.method},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
  // #endregion
  try {
    // @ts-expect-error NextAuth handler typing
    const response = await handler(req, ctx);
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:response',message:'Handler OK',data:{status:response?.status},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
    // #endregion
    return response;
  } catch (err) {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/a0870979-13d6-454e-aa79-007419c9500b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'route.ts:error',message:'Handler error',data:{error:String(err)},timestamp:Date.now(),hypothesisId:'verify',runId:'post-fix'})}).catch(()=>{});
    // #endregion
    return new Response(JSON.stringify({ error: String(err) }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export { wrappedHandler as GET, wrappedHandler as POST };
